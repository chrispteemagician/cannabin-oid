// Cannabin-Oid Welcome Email - Netlify Function
// Called after first successful Patreon auth. Uses Resend API.
// Requires: RESEND_API_KEY env var in Netlify
// From domain: cannabin-oid.co.uk must be verified in Resend dashboard

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://cannabin-oid.co.uk',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { email, name, tier } = JSON.parse(event.body || '{}');

    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) };
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log('No RESEND_API_KEY set — skipping welcome email');
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Skipped (no API key)' }) };
    }

    const tierLabels = { founder: '🏛️ Founder', elder: '⚔️ Elder', villager: '🏡 Villager' };
    const tierLabel = tierLabels[tier] || '🏡 Villager';
    const firstName = name ? name.split(' ')[0] : 'friend';

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', sans-serif; background: #f0fdf4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #14532d 0%, #16a34a 100%); padding: 40px 30px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 12px;">🌿</div>
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Welcome to the Village</h1>
      <p style="color: rgba(255,255,255,0.85); margin: 10px 0 0 0; font-size: 16px;">Cannabin-Oid — Your Corner of the Community</p>
    </div>

    <!-- Tier badge -->
    <div style="text-align: center; padding: 30px 30px 0;">
      <div style="display: inline-block; background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 10px 24px; border-radius: 30px; font-weight: bold; font-size: 14px; letter-spacing: 0.5px;">
        ${tierLabel}
      </div>
    </div>

    <!-- Body -->
    <div style="padding: 24px 30px 30px;">
      <p style="color: #374151; font-size: 17px; line-height: 1.7; margin-top: 0;">
        Hey ${firstName},
      </p>
      <p style="color: #374151; font-size: 16px; line-height: 1.7;">
        You're in. No algorithms deciding what you see. No ads. Just a real community of people who actually know what they're talking about.
      </p>

      <div style="background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 8px; padding: 18px 20px; margin: 24px 0;">
        <p style="color: #14532d; font-weight: 700; margin: 0 0 10px 0; font-size: 15px;">Your next step — set up your Hamlet page:</p>
        <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0;">
          A Hamlet page is your personal corner of the village. Your name. What you do. Where you are. A QR code that's yours forever.
          It's free for every member. Takes 60 seconds to set up.
        </p>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="https://cannabin-oid.co.uk/hamlet/signup.html" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 16px 36px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Set Up My Hamlet →
        </a>
      </div>

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
        Or just come back to the app at <a href="https://cannabin-oid.co.uk" style="color: #16a34a;">cannabin-oid.co.uk</a> whenever you're ready.
      </p>
      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
        Questions? Reply here or find Doc Strange on the site.
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #14532d; padding: 20px 30px; text-align: center;">
      <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 14px;">
        World domination through kindness. One ember at a time.
      </p>
      <p style="color: rgba(255,255,255,0.5); margin: 8px 0 0 0; font-size: 12px;">
        Cannabin-Oid · Part of <a href="https://feelfamous.co.uk" style="color: #86efac;">FeelFamous</a> · <a href="https://cannabin-oid.co.uk" style="color: #86efac;">cannabin-oid.co.uk</a>
      </p>
    </div>

  </div>
</body>
</html>`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Cannabin-Oid <welcome@cannabin-oid.co.uk>',
        to: email,
        subject: `You're in the village, ${firstName} 🌿`,
        html: emailHtml
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend error:', response.status, errorText);
      // Don't fail the user flow — email is non-critical
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Email queued' }) };
    }

    const result = await response.json();
    console.log('Welcome email sent:', result.id, 'to:', email);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Sent', id: result.id })
    };

  } catch (error) {
    console.error('send-welcome error:', error);
    // Never fail the user flow for email
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Email queued' }) };
  }
};
