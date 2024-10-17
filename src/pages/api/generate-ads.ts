import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { brandName, product, userBenefit, promotion, audience, goal, keywords, csvData } = req.body;

  const prompt = `As My Ad Headline Mentor, your expertise is in writing, providing primary text and headline text, from information provided in the data input fields. With a deep understanding of the techniques of advertising legends like David Ogilvy, Dave Trott, Bill Bernbach, and Joseph Sugarman. Your advice is anchored in creating engaging headlines.These are the data input fields that you'll receive data from:

Brand Name: ${brandName}
Product: ${product}
User Benefit or Use: ${userBenefit}
Promotion or Offer: ${promotion}
Audience Segment: ${audience}
Goal or Objective: ${goal}
Core Keywords: ${keywords}
CSV Data: ${csvData}

Write five versions of ads, each containing:
1. Primary Text (constrained to 125 characters)
2. Headline (constrained to 40 characters)

Format each ad as follows:
Primary Text: [Your primary text here]
Headline: [Your headline here]

Separate each ad with a blank line and number each group Ad 1, Ad 2 etc.`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      n: 1,
      temperature: 0.7,
    });

    const generatedText = completion.data.choices[0].message?.content?.trim() || '';
    const ads = generatedText.split('\n\n').map(adText => {
      const [_, primaryText, headline] = adText.split('\n');
      return {
        primaryText: primaryText.replace('Primary Text: ', ''),
        headline: headline.replace('Headline: ', ''),
      };
    }).filter(ad => ad.primaryText && ad.headline);

    res.status(200).json({ ads });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ message: 'Error generating ads', error: error.message });
  }
}