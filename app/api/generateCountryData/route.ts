import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { country, section, language } = await request.json();

		let prompt = `Generate information about ${country} in ${language}. `;

		if (section === 'legal') {
			prompt += `Respond in ${language} with ONLY a JSON object in the following format, with no additional text or formatting:
    {
      "visaRequirements": "string describing visa requirements",
      "pathToResidency": "string describing path to residency",
      "requiredDocuments": ["array", "of", "required", "documents"]
    }`;
		} else if (section === 'quality') {
			prompt += `Generate quality of life information for ${country} in ${language}. Respond with ONLY a JSON object in the following format, with no additional text or formatting:
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
		} else if (section === 'work') {
			prompt += `Generate comprehensive work and employment information for ${country} in ${language}. Respond with ONLY a JSON object in the following format, with no additional text or formatting:
      {
        "jobMarket": {
          "overview": "string describing the current job market",
          "inDemandSectors": ["array", "of", "in-demand", "sectors"],
          "averageSalaries": "string describing salary ranges",
          "unemployment": "string with unemployment rate and context"
        },
        "businessEnvironment": {
          "startupScene": "string describing startup ecosystem",
          "majorEmployers": ["array", "of", "major", "companies"],
          "regulations": "string describing business regulations"
        },
        "workCulture": {
          "workLifeBalance": "string describing work-life balance",
          "officeHours": "string describing typical working hours",
          "practices": ["array", "of", "workplace", "practices"]
        },
        "foreignWorkers": {
          "opportunities": "string describing opportunities for foreigners",
          "workPermits": "string describing work permit process",
          "challenges": ["array", "of", "common", "challenges"]
        }
      }`;
		} else if (section === 'culture') {
			prompt += `Generate comprehensive cultural information for ${country} in ${language}. Respond with ONLY a JSON object in the following format, with no additional text or formatting:
      {
        "society": {
          "values": ["array of core societal values"],
          "customs": ["array of important customs"],
          "etiquette": ["array of etiquette rules"],
          "taboos": ["array of social taboos"]
        },
        "lifestyle": {
          "overview": "string describing daily life",
          "socialLife": "string about social interactions",
          "dating": "string about dating culture",
          "familyLife": "string about family dynamics"
        },
        "language": {
          "official": ["array of official languages"],
          "common": "string about commonly used languages",
          "businessEnglish": "string about English usage in business",
          "usefulPhrases": ["simple string phrases or translations"]
        },
        "expats": {
          "communities": ["array of major expat communities"],
          "integration": "string about integration experience",
          "socialGroups": "string about expat social groups and meetups",
          "commonChallenges": ["array of common challenges faced by expats"]
        }
      }`;
		} else if (section === 'cities') {
			prompt += `Generate comprehensive city information for ${country} in ${language}. Respond with ONLY a JSON object in the following format, with no additional text or formatting:
      {
        "capital": {
          "name": "string",
          "isCapital": true,
          "population": "string with population and year",
          "description": "detailed string about the city",
          "costOfLiving": "string with monthly cost range",
          "internetSpeed": "string with average speeds",
          "climate": "string describing climate",
          "neighborhoods": ["array", "of", "popular", "neighborhoods"]
        },
        "majorCities": [
          {
            "name": "string",
            "population": "string with population and year",
            "description": "detailed string about the city",
            "costOfLiving": "string with monthly cost range",
            "internetSpeed": "string with average speeds",
            "climate": "string describing climate",
            "neighborhoods": ["array", "of", "popular", "neighborhoods"]
          }
        ]
      }`;
		} else {
			return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
		}

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: 'gpt-4.1-nano',
				messages: [
					{
						role: 'system',
						content: `You are a helpful assistant that responds only with valid JSON objects. All text content should be in ${language}.`,
					},
					{
						role: 'user',
						content: prompt,
					},
				],
				temperature: 0.5,
				max_tokens: 7500,
			}),
		});

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
			} else if (section === 'work') {
				if (
					!generatedContent.jobMarket ||
					!generatedContent.businessEnvironment ||
					!generatedContent.workCulture ||
					!generatedContent.foreignWorkers
				) {
					throw new Error('Invalid work response structure');
				}
			} else if (section === 'culture') {
				if (
					!generatedContent.society ||
					!generatedContent.lifestyle ||
					!generatedContent.language ||
					!generatedContent.expats
				) {
					throw new Error('Invalid culture response structure');
				}
			} else if (section === 'cities') {
				if (!generatedContent.capital || !generatedContent.majorCities) {
					throw new Error('Invalid cities response structure');
				}
			} else {
				// Validate the legal response structure
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
			} else if (section === 'work') {
				return NextResponse.json({
					jobMarket: {
						overview: 'Information temporarily unavailable',
						inDemandSectors: ['Information unavailable'],
						averageSalaries: 'Information temporarily unavailable',
						unemployment: 'Information temporarily unavailable',
					},
					businessEnvironment: {
						startupScene: 'Information temporarily unavailable',
						majorEmployers: ['Information unavailable'],
						regulations: 'Information temporarily unavailable',
					},
					workCulture: {
						workLifeBalance: 'Information temporarily unavailable',
						officeHours: 'Information temporarily unavailable',
						practices: ['Information unavailable'],
					},
					foreignWorkers: {
						opportunities: 'Information temporarily unavailable',
						workPermits: 'Information temporarily unavailable',
						challenges: ['Information unavailable'],
					},
				});
			} else if (section === 'culture') {
				return NextResponse.json({
					society: {
						values: ['Information unavailable'],
						customs: ['Information unavailable'],
						etiquette: ['Information unavailable'],
						taboos: ['Information unavailable'],
					},
					lifestyle: {
						overview: 'Information temporarily unavailable',
						socialLife: 'Information temporarily unavailable',
						dating: 'Information temporarily unavailable',
						familyLife: 'Information temporarily unavailable',
					},
					language: {
						official: ['Information unavailable'],
						common: 'Information temporarily unavailable',
						businessEnglish: 'Information temporarily unavailable',
						usefulPhrases: ['Information unavailable'],
					},
					expats: {
						communities: ['Information unavailable'],
						integration: 'Information temporarily unavailable',
						socialGroups: 'Information temporarily unavailable',
						commonChallenges: ['Information unavailable'],
					},
				});
			} else if (section === 'cities') {
				return NextResponse.json({
					capital: {
						name: 'Information unavailable',
						isCapital: true,
						population: 'Information unavailable',
						description: 'Information unavailable',
						costOfLiving: 'Information unavailable',
						internetSpeed: 'Information unavailable',
						climate: 'Information unavailable',
						neighborhoods: ['Information unavailable'],
					},
					majorCities: [],
				});
			} else {
				// Return a legal fallback response
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
