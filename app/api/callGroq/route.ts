import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
	name?: string;
}

export async function POST(request: Request) {
	try {
		const { messages, language } = await request.json();

		const systemMessage = {
			role: 'system',
			content: `You are a helpful assistant that responds in ${language}. Please provide all responses in ${language}.`,
		};

		const chatCompletion = await openai.chat.completions.create({
			messages: [systemMessage, ...messages] as ChatMessage[],
			model: 'gpt-4.1-nano',
			temperature: 0.7,
			max_tokens: 4096,
		});

		return NextResponse.json({
			message: chatCompletion.choices[0]?.message?.content || '',
		});
	} catch (error) {
		console.error('OpenAI API error:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch from OpenAI API' },
			{ status: 500 }
		);
	}
}
