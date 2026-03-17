
'use server';
/**
 * @fileOverview A flow to generate educational diagrams/illustrations using Imagen 4.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VisualAidInputSchema = z.object({
  concept: z.string().describe('The educational concept to illustrate.'),
  context: z.string().optional().describe('Additional context from the notes.'),
});

const VisualAidOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});

export async function generateVisualAid(input: z.infer<typeof VisualAidInputSchema>) {
  return generateVisualAidFlow(input);
}

const generateVisualAidFlow = ai.defineFlow(
  {
    name: 'generateVisualAidFlow',
    inputSchema: VisualAidInputSchema,
    outputSchema: VisualAidOutputSchema,
  },
  async (input) => {
    const prompt = `Create a clear, high-quality educational diagram or illustration explaining the following concept: ${input.concept}. 
    Context: ${input.context || 'General educational material'}. 
    Style: Professional, clean, and easy to understand for a student. Focus on accuracy and clarity.`;

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate image');
    }

    return {
      imageUrl: media.url,
    };
  }
);
