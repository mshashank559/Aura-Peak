export default async function handler(req: any, res: any) {
  // CORS configuration if needed
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const data = req.body || {};

    // 1. Honeypot check for spam protection
    if (data.website) {
      console.log('[Spam Prevention] Spam bot detected via honeypot field.');
      res.status(200).json({
        success: true,
        message: 'Thank you for contacting AuraPeak Woodcraft. Our team will get back to you shortly.',
      });
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
      res.status(400).json({ error: errors.join(' ') });
      return;
    }

    // 3. Email Delivery
    const apiKey = process.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY;
    const receiver = process.env.VITE_CONTACT_RECEIVER_EMAIL || process.env.CONTACT_RECEIVER_EMAIL || 'info@aurapeakwoodcraft.com';

    if (!apiKey) {
      res.status(500).json({ error: 'Resend API Key is not configured. Please add RESEND_API_KEY to your environment variables.' });
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
      res.status(200).json({ success: true, message: 'Email sent successfully!', data: resData });
    } else {
      console.error('Resend API Error:', resData);
      res.status(response.status).json({ error: resData.message || 'Failed to deliver the email via Resend.' });
    }

  } catch (err: any) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'An internal server error occurred: ' + err.message });
  }
}
