import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Use JavaScript date for timestamps
    const createdAt = new Date();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Insert into database
    const { data, error } = await supabase
      .from('otp-codes')
      .insert([{
        email,
        otp,
        created_at: createdAt.toISOString(),
        expires_at: expiresAt.toISOString()
      }]);

    if (error) {
      console.error('Supabase insert error:', error);
      res.status(500).json({ error: 'Failed to store OTP', details: error.message });
      return;
    }

    // Send email via Brevo
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Ethio Digital Academy', email: 'ethiodigitalacademy@gmail.com' },
        to: [{ email }],
        subject: 'Your Verification Code',
        htmlContent: `<p>Your Alerta verification code is <b>${otp}</b></p>`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Email sending error:', errorData);
      res.status(500).json({ error: 'Failed to send the verification email' });
      return;
    }

    res.status(200).json({ message: 'Verification code has been sent to your email successfully' });
  } catch (err) {
    console.error('Error in handler:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
