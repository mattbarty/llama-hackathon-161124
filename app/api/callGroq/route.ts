import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface ChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
	name?: string;
}

export async function POST(request: Request) {
	try {
		const { messages } = await request.json();

		const chatCompletion = await groq.chat.completions.create({
			messages: messages as ChatMessage[],
			model: 'llama-3.2-3b-preview',
			temperature: 0.7,
			max_tokens: 4096,
		});

		return NextResponse.json({
			message: chatCompletion.choices[0]?.message?.content || '',
		});
	} catch (error) {
		console.error('Groq API error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch from Groq API' },
			{ status: 500 }
		);
	}
}
