
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
    //const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //console.log('Generated OTP:', otp);

   
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}

}
