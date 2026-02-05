export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY || 're_QPpLZbKt_91c2eKq1Cv2VAPrcaTkPNyoX'}`
      },
      body: JSON.stringify({
        from: 'AI Academy <onboarding@resend.dev>',
        to: ['sabrinka.k@gmail.com'],
        subject: `פנייה חדשה מ-${name}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">🤖 אקדמיית AI - פנייה חדשה</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">פרטי הפונה:</h2>
              <p style="font-size: 16px; line-height: 1.6;">
                <strong>שם:</strong> ${name}<br>
                <strong>דואר אלקטרוני:</strong> ${email}
              </p>
              <h3 style="color: #333; margin-top: 25px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">תוכן ההודעה:</h3>
              <div style="background: #f9f9f9; padding: 20px; border-right: 4px solid #667eea; margin: 15px 0; border-radius: 5px;">
                <p style="font-size: 15px; line-height: 1.8; color: #555; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="color: #888; font-size: 13px; margin-top: 30px; text-align: center;">
                נשלח מאתר אקדמיית AI | ${new Date().toLocaleString('he-IL')}
              </p>
            </div>
          </div>
        `
      })
    });

    if (response.ok) {
        const data = await response.json();
        return res.status(200).json(data);
    } else {
        const error = await response.json();
        return res.status(response.status).json(error);
    }
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
