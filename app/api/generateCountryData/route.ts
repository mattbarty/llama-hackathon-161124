import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { country, section } = await request.json();

		if (section !== 'legal') {
			return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
		}

		const prompt = `Generate legal immigration information for ${country}. Respond with ONLY a JSON object in the following format, with no additional text or formatting:
    {
      "visaRequirements": "string describing visa requirements",
      "pathToResidency": "string describing path to residency",
      "requiredDocuments": ["array", "of", "required", "documents"]
    }`;

		const response = await fetch(
			'https://api.groq.com/openai/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					model: 'mixtral-8x7b-32768',
					messages: [
						{
							role: 'system',
							content:
								'You are a helpful assistant that responds only with valid JSON objects.',
						},
						{
							role: 'user',
							content: prompt,
						},
					],
					temperature: 0.5,
					max_tokens: 1024,
				}),
			}
		);

		const data = await response.json();

		try {
			const generatedContent = JSON.parse(
				data.choices[0].message.content.trim()
			);

			// Validate the response structure
			if (
				!generatedContent.visaRequirements ||
				!generatedContent.pathToResidency ||
				!Array.isArray(generatedContent.requiredDocuments)
			) {
				throw new Error('Invalid response structure');
			}

			return NextResponse.json(generatedContent);
		} catch (parseError) {
			console.error(
				'Failed to parse AI response:',
				data.choices[0].message.content
			);
			// Return a fallback response
			return NextResponse.json({
				visaRequirements: 'Information temporarily unavailable',
				pathToResidency: 'Information temporarily unavailable',
				requiredDocuments: ['Documentation unavailable'],
			});
		}
	} catch (error) {
		console.error('Error generating country data:', error);
		return NextResponse.json(
			{
				visaRequirements: 'Failed to load information',
				pathToResidency: 'Failed to load information',
				requiredDocuments: ['Failed to load documents'],
			},
			{ status: 200 }
		); // Return 200 with fallback data instead of 500
	}
}
