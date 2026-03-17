
'use server';
/**
 * @fileOverview A Genkit flow for real-time interaction with an AI tutor.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConversationMessageSchema = z.object({
  role: z.enum(['user', 'model', 'system']),
  content: z.string(),
});

const RealTimeTutorConversationInputSchema = z.object({
  conversationHistory: z.array(ConversationMessageSchema),
  userMessage: z.string(),
});
export type RealTimeTutorConversationInput = z.infer<typeof RealTimeTutorConversationInputSchema>;

const RealTimeTutorConversationOutputSchema = z.object({
  tutorResponse: z.string(),
});
export type RealTimeTutorConversationOutput = z.infer<typeof RealTimeTutorConversationOutputSchema>;

export async function realTimeTutorConversation(
  input: RealTimeTutorConversationInput
): Promise<RealTimeTutorConversationOutput> {
  return realTimeTutorConversationFlow(input);
}

const tutorConversationPrompt = ai.definePrompt({
  name: 'tutorConversationPrompt',
  input: { schema: RealTimeTutorConversationInputSchema },
  output: { schema: RealTimeTutorConversationOutputSchema },
  model: 'googleai/gemini-1.5-pro',
  prompt: `You are EduGemini, a friendly and helpful AI tutor. Use the history to provide context-aware guidance.

History:
{{#each conversationHistory}}
{{this.role}}: {{this.content}}
{{/each}}

Student: {{{userMessage}}}

EduGemini: `,
});

const realTimeTutorConversationFlow = ai.defineFlow(
  {
    name: 'realTimeTutorConversationFlow',
    inputSchema: RealTimeTutorConversationInputSchema,
    outputSchema: RealTimeTutorConversationOutputSchema,
  },
  async (input) => {
    const {output} = await tutorConversationPrompt(input);
    return output!;
  }
);
