'use server';
/**
 * @fileOverview This file defines a Genkit flow for the AI tutor to provide contextual explanations from scanned notes.
 *
 * - contextualNoteExplanations - A function that handles processing scanned notes and answering questions about them.
 * - ContextualNoteExplanationInput - The input type for the contextualNoteExplanations function.
 * - ContextualNoteExplanationOutput - The return type for the contextualNoteExplanations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualNoteExplanationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of scanned notes, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z
    .string()
    .describe(
      "The student's question specifically about the content of the scanned notes."
    ),
});
export type ContextualNoteExplanationInput = z.infer<
  typeof ContextualNoteExplanationInputSchema
>;

const ContextualNoteExplanationOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      "A detailed explanation or insight provided by the AI tutor based on the scanned notes and the student's question."
    ),
});
export type ContextualNoteExplanationOutput = z.infer<
  typeof ContextualNoteExplanationOutputSchema
>;

export async function contextualNoteExplanations(
  input: ContextualNoteExplanationInput
): Promise<ContextualNoteExplanationOutput> {
  return contextualNoteExplanationFlow(input);
}

const contextualNoteExplanationPrompt = ai.definePrompt({
  name: 'contextualNoteExplanationPrompt',
  input: {schema: ContextualNoteExplanationInputSchema},
  output: {schema: ContextualNoteExplanationOutputSchema},
  model: 'googleai/gemini-1.5-pro', // Using a multimodal model to interpret both image and text
  prompt: `You are an expert AI tutor specializing in explaining educational content.
I have provided a photo of my scanned notes and a question about them.
Your primary task is to carefully 'see' and interpret the visual information present in the notes.
Based on the content of these notes, provide a detailed, relevant, and insightful explanation that directly answers the student's question.
Your response should be clear, concise, and helpful, acting as a personalized guide.

Notes: {{media url=photoDataUri}}
Question: {{{question}}}

Provide your explanation here:`,
});

const contextualNoteExplanationFlow = ai.defineFlow(
  {
    name: 'contextualNoteExplanationFlow',
    inputSchema: ContextualNoteExplanationInputSchema,
    outputSchema: ContextualNoteExplanationOutputSchema,
  },
  async input => {
    const {output} = await contextualNoteExplanationPrompt(input);
    return output!;
  }
);
