export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;
    // Log submission (in production, use SendGrid or store in a database)
    console.log('Form submission:', { name, email, message });
    res.status(200).json({ message: 'Form submitted successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
