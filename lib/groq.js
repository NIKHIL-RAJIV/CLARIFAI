// lib/groq.js
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

export async function callGroq(systemPrompt, userContent, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        temperature: 0.1,       // Low temp = consistent, structured output
        max_tokens: 2048,
        response_format: { type: 'json_object' }, // Forces JSON output
      });
      return completion.choices[0].message.content;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

export default groq;
