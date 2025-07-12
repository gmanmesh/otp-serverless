import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;
const BREVO_API_KEY = process.env.BREVO_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
export default async function handler(req, res) {
  console.log('Handler start');

  try {
    console.log('Method:', req.method);
    if (req.method !== 'POST') {
      console.log('Invalid method');
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const { email } = req.body;
    console.log('Received email:', email);

    if (!email) {
      console.log('Email missing');
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp);

   
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

}
