import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'send-email-api',
        configureServer(server) {
          server.middlewares.use('/api/send-email', async (req, res, next) => {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', async () => {
                try {
                  const data = JSON.parse(body || '{}');

                  // 1. Honeypot check for spam protection
                  if (data.website) {
                    console.log('[Spam Prevention] Spam bot detected via honeypot field.');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                      success: true,
                      message: 'Thank you for contacting AuraPeak Woodcraft. Our team will get back to you shortly.',
                    }));
                    return;
                  }

                  // 2. Server-side validation
                  const errors: string[] = [];
                  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
                    errors.push('Full Name is required.');
                  }
                  if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                    errors.push('A valid Email Address is required.');
                  }
                  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length < 7) {
                    errors.push('A valid Phone Number (at least 7 characters) is required.');
                  }
                  if (!data.service || typeof data.service !== 'string' || data.service.trim() === '') {
                    errors.push('Service Required option is required.');
                  }
                  if (!data.message || typeof data.message !== 'string' || data.message.trim() === '') {
                    errors.push('Project Details / Message is required.');
                  }

                  if (errors.length > 0) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: errors.join(' ') }));
                    return;
                  }

                  // 3. Email Delivery
                  const apiKey = env.VITE_RESEND_API_KEY || env.RESEND_API_KEY;
                  const receiver = env.VITE_CONTACT_RECEIVER_EMAIL || env.CONTACT_RECEIVER_EMAIL || 'info@aurapeakwoodcraft.com';

                  if (!apiKey) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Resend API Key is not configured. Please add VITE_RESEND_API_KEY to your environment variables.' }));
                    return;
                  }

                  const emailBody = `Name: ${data.name.trim()}
Email: ${data.email.trim()}
Phone: ${data.phone.trim()}
Service: ${data.service.trim()}
Message: ${data.message.trim()}
Submitted At: ${new Date().toLocaleString()}`;

                  const response = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                      from: 'AuraPeak Inquiry <onboarding@resend.dev>',
                      to: receiver,
                      subject: 'New Website Inquiry - AuraPeak Woodcraft',
                      text: emailBody,
                    }),
                  });

                  const resData = await response.json() as any;

                  if (response.ok) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ success: true, message: 'Email sent successfully!', data: resData }));
                  } else {
                    console.error('Resend API Error:', resData);
                    res.statusCode = response.status;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: resData.message || 'Failed to deliver the email via Resend.' }));
                  }

                } catch (err: any) {
                  console.error('API Error:', err);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'An internal server error occurred: ' + err.message }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
  };
});
