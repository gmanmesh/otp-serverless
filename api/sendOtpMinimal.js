export default async function handler(req, res) {
  console.log('Handler start');
  console.log('Method:', req.method);
    if (req.method !== 'POST') {
      console.log('Invalid method');
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const { email } = req.body;
    console.log('Received email:', email);
  res.status(200).json({ message:"Successfully Started", email: email});
}
