// app/api/ai-generate/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    console.log('Calling OpenRouter API with prompt:', prompt);
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: `You are a helpful assistant that generates flashcards. Create a flashcard based on the given topic. The front should be a concise question or prompt, and the back should be a brief, informative answer. Do not repeat the user's prompt verbatim. Always respond in the following format:
Front: [A question or prompt about the topic]
Back: [A concise, informative answer or explanation]` },
          { role: 'user', content: `Generate a flashcard about: ${prompt}` }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': `${process.env.NEXT_PUBLIC_BASE_URL}`,
          'X-Title': 'Flashcard Generator',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Full OpenRouter API response:', JSON.stringify(response.data, null, 2));

    const generatedContent = response.data.choices[0].message.content.trim();
    console.log('Generated content:', generatedContent);

    const frontMatch = generatedContent.match(/Front:\s*(.*)/i);
    const backMatch = generatedContent.match(/Back:\s*(.*)/i);

    let front = frontMatch ? frontMatch[1].trim() : '';
    let back = backMatch ? backMatch[1].trim() : '';

    if (!front && !back) {
      // If we couldn't parse the content, use it all as the front
      front = generatedContent;
      back = 'Please edit this side of the flashcard.';
    } else if (!back) {
      back = 'Please edit this side of the flashcard.';
    }

    console.log('Parsed flashcard:', { front, back });

    return NextResponse.json({ front, back });
  } catch (error) {
    console.error('Detailed error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Error generating flashcard', details: error.response?.data || error.message }, { status: 500 });
  }
}