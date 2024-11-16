import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { country, section } = await request.json();

		let prompt;
		if (section === 'legal') {
			prompt = `Generate legal immigration information for ${country}. Respond with ONLY a JSON object in the following format, with no additional text or formatting:
    {
      "visaRequirements": "string describing visa requirements",
      "pathToResidency": "string describing path to residency",
      "requiredDocuments": ["array", "of", "required", "documents"]
    }`;
		} else if (section === 'quality') {
			prompt = `Generate quality of life information for ${country}. Respond with ONLY a JSON object in the following format, with no additional text or formatting:
      {
        "healthcare": {
          "system": "string describing the healthcare system",
          "quality": "string describing healthcare quality",
          "cost": "string describing healthcare costs"
        },
        "safety": {
          "index": "string with safety rating",
          "details": "string with safety details"
        },
        "environment": {
          "airQuality": "string describing air quality",
          "climate": "string describing climate",
          "sustainability": "string describing environmental initiatives"
        },
        "education": {
          "system": "string describing education system",
          "universities": "string about higher education",
          "internationalSchools": "string about international schools"
        }
      }`;
		} else {
			return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
		}

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

			// Validate the response structure based on section
			if (section === 'quality') {
				if (
					!generatedContent.healthcare ||
					!generatedContent.safety ||
					!generatedContent.environment ||
					!generatedContent.education
				) {
					throw new Error('Invalid quality response structure');
				}
			} else {
				// Validate the response structure
				if (
					!generatedContent.visaRequirements ||
					!generatedContent.pathToResidency ||
					!Array.isArray(generatedContent.requiredDocuments)
				) {
					throw new Error('Invalid response structure');
				}
			}

			return NextResponse.json(generatedContent);
		} catch (parseError) {
			console.error(
				'Failed to parse AI response:',
				data.choices[0].message.content
			);
			// Return section-specific fallback response
			if (section === 'quality') {
				return NextResponse.json({
					healthcare: {
						system: 'Information temporarily unavailable',
						quality: 'Information temporarily unavailable',
						cost: 'Information temporarily unavailable',
					},
					safety: {
						index: 'Information temporarily unavailable',
						details: 'Information temporarily unavailable',
					},
					environment: {
						airQuality: 'Information temporarily unavailable',
						climate: 'Information temporarily unavailable',
						sustainability: 'Information temporarily unavailable',
					},
					education: {
						system: 'Information temporarily unavailable',
						universities: 'Information temporarily unavailable',
						internationalSchools: 'Information temporarily unavailable',
					},
				});
			} else {
				// Return a fallback response
				return NextResponse.json({
					visaRequirements: 'Information temporarily unavailable',
					pathToResidency: 'Information temporarily unavailable',
					requiredDocuments: ['Documentation unavailable'],
				});
			}
		}
	} catch (error) {
		console.error('Error generating country data:', error);
		return NextResponse.json(
			{
				error: 'Failed to generate country data',
			},
			{ status: 500 }
		);
	}
}
