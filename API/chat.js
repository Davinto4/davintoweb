// api/chat.js
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Securely use Vercel environment variable
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { message } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or "gpt-4" if your account allows
      messages: [
        { role: 'system', content: 'You are a helpful assistant from DavintoWeb.' },
        { role: 'user', content: message },
      ],
    });

    const reply = chatCompletion.choices[0]?.message?.content;
    res.status(200).json({ response: reply });
  } catch (err) {
    console.error('OpenAI Error:', err);
    res.status(500).json({ error: 'Failed to connect to AI' });
  }
}
