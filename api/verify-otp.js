
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400).json({ error: 'Email and OTP are required' });
    return;
  }

  // Fetch OTP from Supabase
  const { data, error } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return res.status(400).json({ error: 'OTP not found or expired' });
  }

  // Check if OTP matches and is not expired
  const now = new Date();
  const expiresAt = new Date(data.expires_at);

  if (data.otp !== otp || now > expiresAt) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  // OTP verified, you can now proceed (mark user as verified)
  res.status(200).json({ message: 'OTP verified successfully' });
}