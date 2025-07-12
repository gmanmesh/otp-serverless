export default async function handler(req, res) {
  console.log('Function invoked');
  res.status(200).json({ message: 'Function works' });
}