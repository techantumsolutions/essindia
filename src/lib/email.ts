import nodemailer from 'nodemailer';

// Create a transporter using environment SMTP credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailParams {
  candidateEmail: string;
  candidateName: string;
  jobTitle: string;
  hrEmail: string;
  jdUrl?: string | null;
  applicantDetails: {
    phone: string;
    experience: string;
    currentCompany?: string | null;
    noticePeriod: string;
    linkedInProfile?: string | null;
    portfolioUrl?: string | null;
    coverLetter?: string | null;
    resumeUrl: string;
  };
}

export async function sendApplicationEmails({
  candidateEmail,
  candidateName,
  jobTitle,
  hrEmail,
  jdUrl,
  applicantDetails,
}: SendEmailParams) {
  // 1. Email to Candidate (Confirmation)
  const candidateMailOptions = {
    from: `"ESS India Careers" <${process.env.SMTP_USER || 'noreply@essindia.com'}>`,
    to: candidateEmail,
    subject: `Application Received: ${jobTitle} at ESS India`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4B2A63; padding: 24px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 24px;">Application Confirmed</h2>
        </div>
        <div style="padding: 24px;">
          <p>Dear <strong>${candidateName}</strong>,</p>
          <p>Thank you for applying for the <strong>${jobTitle}</strong> position at ESS India. We have successfully received your application.</p>
          <p>Our recruitment team is currently reviewing all profiles. If your experience and skills align with our requirements, we will contact you for the next steps in our selection process.</p>
          <p>Below is a summary of your application details:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold; width: 150px;">Role:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">${jobTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold;">Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">${candidateName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">${candidateEmail}</td>
            </tr>
          </table>
          
          ${jdUrl ? `
          <div style="background-color: #f7fafc; padding: 16px; border-radius: 8px; margin-top: 20px; border: 1px solid #edf2f7;">
            <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 14px;">Job Description Attached:</p>
            <p style="margin: 0 0 12px 0; font-size: 13px; color: #4a5568;">You can review the detailed job description and role details here:</p>
            <a href="${jdUrl.startsWith('/') ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5002'}${jdUrl}` : jdUrl}" target="_blank" style="background-color: #4B2A63; color: white; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 12px; display: inline-block;">
              Download Job Description
            </a>
          </div>
          ` : ''}

          <p style="margin-top: 24px;">We wish you the best of luck!</p>
          <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 24px 0;" />
          <p style="font-size: 12px; color: #718096; text-align: center;">This is an automated confirmation email from ESS India. Please do not reply directly to this message.</p>
        </div>
      </div>
    `,
  };

  // 2. Email to HR (Notification)
  const resumeDownloadUrl = applicantDetails.resumeUrl.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5002'}${applicantDetails.resumeUrl}`
    : applicantDetails.resumeUrl;

  const hrMailOptions = {
    from: `"ESS India Careers" <${process.env.SMTP_USER || 'noreply@essindia.com'}>`,
    to: hrEmail,
    subject: `New Job Application: ${candidateName} - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4B2A63; padding: 24px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 24px;">New Application Received</h2>
          <p style="margin: 4px 0 0 0; opacity: 0.9;">Role: ${jobTitle}</p>
        </div>
        <div style="padding: 24px;">
          <p>A new application has been submitted for the role of <strong>${jobTitle}</strong>.</p>
          
          <h3 style="color: #4B2A63; border-bottom: 2px solid #f7fafc; padding-bottom: 8px; margin-top: 24px;">Applicant Profile</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold; width: 180px;">Full Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">${candidateName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold;">Email Address:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;"><a href="mailto:${candidateEmail}">${candidateEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold;">Phone Number:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">${applicantDetails.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold;">Total Experience:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">${applicantDetails.experience}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold;">Current Company:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">${applicantDetails.currentCompany || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold;">Notice Period:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;">${applicantDetails.noticePeriod}</td>
            </tr>
            ${applicantDetails.linkedInProfile ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold;">LinkedIn Profile:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;"><a href="${applicantDetails.linkedInProfile}" target="_blank">${applicantDetails.linkedInProfile}</a></td>
            </tr>
            ` : ''}
            ${applicantDetails.portfolioUrl ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7; font-weight: bold;">Portfolio URL:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #edf2f7;"><a href="${applicantDetails.portfolioUrl}" target="_blank">${applicantDetails.portfolioUrl}</a></td>
            </tr>
            ` : ''}
          </table>

          ${applicantDetails.coverLetter ? `
          <h3 style="color: #4B2A63; margin-top: 24px;">Cover Letter</h3>
          <div style="background-color: #f7fafc; padding: 16px; border-radius: 6px; font-style: italic; color: #4a5568; white-space: pre-line;">
            ${applicantDetails.coverLetter}
          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 32px; margin-bottom: 16px;">
            <a href="${resumeDownloadUrl}" target="_blank" style="background-color: #4B2A63; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              View & Download Resume
            </a>
          </div>
        </div>
      </div>
    `,
  };

  // Dispatch both emails in parallel
  await Promise.all([
    transporter.sendMail(candidateMailOptions),
    transporter.sendMail(hrMailOptions),
  ]);
}
