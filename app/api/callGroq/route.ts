import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const userMessage = body.message;

		const chatCompletion = await groq.chat.completions.create({
			messages: [
				{
					role: 'user',
					content: userMessage,
				},
			],
			model: 'llama3-8b-8192',
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
