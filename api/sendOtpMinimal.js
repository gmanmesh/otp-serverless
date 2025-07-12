export default async function handler(req, res) {
  console.log('Handler start');
  res.status(200).json({ message:"Successfully Started"});
}
