
'use server';
/**
 * @fileOverview A Genkit flow that takes an image of notes and provides a concise, organized summary.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanAndSummarizeNotesInputSchema = z.object({
  notesImageUri: z
    .string()
    .describe(
      "A photo of handwritten or typed notes, as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type ScanAndSummarizeNotesInput = z.infer<
  typeof ScanAndSummarizeNotesInputSchema
>;

const ScanAndSummarizeNotesOutputSchema = z.object({
  summary: z.string().describe('A concise and organized summary of the provided notes.'),
});
export type ScanAndSummarizeNotesOutput = z.infer<
  typeof ScanAndSummarizeNotesOutputSchema
>;

export async function scanAndSummarizeNotes(
  input: ScanAndSummarizeNotesInput
): Promise<ScanAndSummarizeNotesOutput> {
  return scanAndSummarizeNotesFlow(input);
}

const summarizeNotesPrompt = ai.definePrompt({
  name: 'summarizeNotesPrompt',
  input: {schema: ScanAndSummarizeNotesInputSchema},
  output: {schema: ScanAndSummarizeNotesOutputSchema},
  model: 'googleai/gemini-1.5-pro',
  prompt: `You are an expert tutor. Provide a concise, organized summary of these notes. Focus on key concepts and definitions.

Notes: {{media url=notesImageUri}}`,
});

const scanAndSummarizeNotesFlow = ai.defineFlow(
  {
    name: 'scanAndSummarizeNotesFlow',
    inputSchema: ScanAndSummarizeNotesInputSchema,
    outputSchema: ScanAndSummarizeNotesOutputSchema,
  },
  async input => {
    const {output} = await summarizeNotesPrompt(input);
    return output!;
  }
);
