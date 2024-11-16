import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST() {
	try {
		const chatCompletion = await getGroqChatCompletion();
		return NextResponse.json({
			message: chatCompletion.choices[0]?.message?.content || '',
		});
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch from Groq API' },
			{ status: 500 }
		);
	}
}

export async function getGroqChatCompletion() {
	return groq.chat.completions.create({
		messages: [
			{
				role: 'user',
				content: 'Explain the importance of fast language models',
			},
		],
		model: 'llama3-8b-8192',
	});
}
