import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/cms/auth';
import { serverError, unauthorized, badRequest } from '@/lib/cms/api-response';
import { extractText, getDocumentProxy } from 'unpdf';
import mammoth from 'mammoth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return badRequest('No file uploaded');
    }

    let text = '';
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the JD document to local uploads folder
    const ext = file.name.split('.').pop() || 'pdf';
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'jds');
    await mkdir(uploadDir, { recursive: true });
    const filename = `${randomUUID()}.${ext}`;
    await writeFile(join(uploadDir, filename), buffer);
    const jdUrl = `/uploads/jds/${filename}`;

    try {
      if (file.name.endsWith('.pdf')) {
        const pdfProxy = await getDocumentProxy(new Uint8Array(buffer));
        const { text: pdfText } = await extractText(pdfProxy, { mergePages: true });
        text = pdfText;
      } else if (file.name.endsWith('.docx')) {
        const docxData = await mammoth.extractRawText({ buffer });
        text = docxData.value;
      } else {
        // Fallback for .txt or other text-based files
        text = buffer.toString('utf-8');
      }

      if (!text || !text.trim()) {
        throw new Error('The uploaded document appears to be empty or could not be read.');
      }

      // Limit text to a maximum of 30,000 characters to prevent excessive API latency/timeouts
      if (text.length > 30000) {
        text = text.substring(0, 30000) + '\n[Truncated due to length limit]';
      }

      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not configured. Please add GEMINI_API_KEY to your env file.');
      }
      console.log("Calling Gemienni api");
      // Call Gemini API using native fetch with a 2-minute timeout signal
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(120000), // 120 seconds timeout
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert HR recruiter. Analyze the following Job Description (JD) text and extract the details into a structured JSON object matching this schema exactly.

                  Expected Schema:
                  {
                    "title": "string (the exact job title or most fitting title, e.g. 'Senior React Developer')",
                    "department": "string (e.g. 'Engineering', 'Sales', 'HR', 'Marketing', etc.)",
                    "description": "string (a brief 1-2 sentence overview summarizing what the role is)",
                    "type": "Full-Time" | "Part-Time" | "Contract" | "Internship",
                    "experience": "string (experience requirement, e.g. '3+ Years' or 'Fresher')",
                    "locations": ["string (locations list, e.g. ['Noida', 'Remote'])"],
                    "aboutText": "string (a comprehensive introduction to the role, company context, and team)",
                    "requirements": ["string (bullet points of required skills, qualifications, or experience)"],
                    "responsibilities": ["string (bullet points of day-to-day duties and key responsibilities)"],
                    "niceToHave": ["string (bullet points of preferred or optional skills/certifications)"],
                    "whatWeOffer": ["string (bullet points of perks, benefits, and salary info if mentioned)"]
                  }

                  Rules:
                  1. Make sure key lists like requirements, responsibilities, niceToHave, and whatWeOffer are arrays of strings. If any category is not mentioned, return an empty array [].
                  2. For 'type', it must strictly be one of: "Full-Time", "Part-Time", "Contract", or "Internship". Choose the closest match.
                  3. Make sure to capture as much detail as possible in the 'aboutText' section.
                  4. Ensure that the returned output is 100% syntactically valid JSON. Properly escape any internal double quotes inside string values (use \" instead of unescaped quotes). Do not include trailing commas in arrays/objects or add comments.

                  JD Text content:
                  ${text}`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: 'OBJECT',
                properties: {
                  title: { type: 'STRING' },
                  department: { type: 'STRING' },
                  description: { type: 'STRING' },
                  type: { type: 'STRING', enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'] },
                  experience: { type: 'STRING' },
                  locations: { type: 'ARRAY', items: { type: 'STRING' } },
                  aboutText: { type: 'STRING' },
                  requirements: { type: 'ARRAY', items: { type: 'STRING' } },
                  responsibilities: { type: 'ARRAY', items: { type: 'STRING' } },
                  niceToHave: { type: 'ARRAY', items: { type: 'STRING' } },
                  whatWeOffer: { type: 'ARRAY', items: { type: 'STRING' } }
                },
                required: ['title', 'department', 'description', 'type', 'experience', 'locations', 'aboutText', 'requirements', 'responsibilities']
              }
            },
          }),
        }
      );

      if (!response.ok) {
        const errResponseText = await response.text();
        console.error('[Gemini API Error]', errResponseText);
        throw new Error(`Gemini API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      let jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!jsonString) {
        throw new Error('Invalid response received from the AI model.');
      }

      // Clean JSON of any markdown code blocks if the model wrapped it
      jsonString = jsonString.trim();
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```(json)?\n/, '').replace(/\n```$/, '');
      }

      // Safely remove any trailing commas inside JSON arrays/objects to prevent parsing errors
      jsonString = jsonString.replace(/,(\s*[\]}])/g, '$1');

      const parsedJobData = JSON.parse(jsonString);
      return NextResponse.json({
        success: true,
        parsed: true,
        ...parsedJobData,
        jdUrl
      });
    } catch (parseError: any) {
      console.error('[JD Parser Extraction Error]', parseError);
      return NextResponse.json({
        success: false,
        parsed: false,
        jdUrl,
        error: parseError.message || 'Unable to extract content'
      });
    }
  } catch (error: any) {
    console.error('[JD Parser Upload Error]', error);
    return serverError(error);
  }
}
