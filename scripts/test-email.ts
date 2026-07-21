import { config } from 'dotenv';
config(); // Load .env file

import { Resend } from 'resend';

async function testResend() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'ESS India <marketing@essindia.com>';
  
  const recipient = process.argv[2] || 'rajkumar@sjmedialabs.com';

  console.log('Testing Resend Integration...');
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 7)}...` : 'NOT FOUND');
  console.log('From Email:', fromEmail);
  console.log('Recipient Email:', recipient);

  const resend = new Resend(apiKey);

  try {
    const response = await resend.emails.send({
      from: fromEmail,
      to: recipient,
      subject: 'Resend Test Email - ESS India',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #4B2A63;">Resend Integration Test Successful!</h2>
          <p>This email was sent using the <strong>Resend API</strong> from ESS India website.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    console.log('\n--- Resend Response ---');
    console.log(JSON.stringify(response, null, 2));

    if (response.error) {
      console.error('\n⚠️ Resend API returned an error:');
      console.error(response.error);
      if (response.error.message?.includes('domain')) {
        console.log('\n💡 Note: If domain essindia.com is not yet verified in Resend dashboard, use onboarding@resend.dev as FROM email or verify essindia.com on https://resend.com/domains');
      }
    } else {
      console.log('\n✅ Email sent successfully! Email ID:', response.data?.id);
    }
  } catch (err) {
    console.error('Exception while sending email:', err);
  }
}

testResend();
