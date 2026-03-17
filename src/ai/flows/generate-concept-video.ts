
'use server';
/**
 * @fileOverview A flow to generate short educational animations using Veo 2.0.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const ConceptVideoInputSchema = z.object({
  processDescription: z.string().describe('A description of a dynamic process to animate (e.g., "how a steam engine works").'),
});

const ConceptVideoOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated 5-second educational video.'),
});

export async function generateConceptVideo(input: z.infer<typeof ConceptVideoInputSchema>) {
  return generateConceptVideoFlow(input);
}

const generateConceptVideoFlow = ai.defineFlow(
  {
    name: 'generateConceptVideoFlow',
    inputSchema: ConceptVideoInputSchema,
    outputSchema: ConceptVideoOutputSchema,
  },
  async (input) => {
    const prompt = `A 5-second cinematic 3D educational animation showing: ${input.processDescription}. 
    High clarity, scientific accuracy, smooth motion. 4k resolution style.`;

    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Polling loop
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      if (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    if (operation.error) {
      throw new Error('Failed to generate video: ' + operation.error.message);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media) {
      throw new Error('Failed to find the generated video media');
    }

    // Fetch and convert to base64 data URI
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`);
    
    if (!response.ok) {
      throw new Error('Failed to download generated video');
    }

    const buffer = await response.arrayBuffer();
    const base64Video = Buffer.from(buffer).toString('base64');

    return {
      videoUrl: `data:video/mp4;base64,${base64Video}`,
    };
  }
);
