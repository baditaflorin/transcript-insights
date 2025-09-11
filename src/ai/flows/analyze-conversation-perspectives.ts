'use server';

/**
 * @fileOverview Analyzes a conversation transcript and explains the conversation from each speaker's point of view.
 *
 * - analyzeConversationPerspectives - A function that analyzes the conversation and returns the perspectives of each speaker.
 * - AnalyzeConversationPerspectivesInput - The input type for the analyzeConversationPerspectives function.
 * - AnalyzeConversationPerspectivesOutput - The return type for the analyzeConversationPerspectives function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeConversationPerspectivesInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the conversation to analyze.'),
});
export type AnalyzeConversationPerspectivesInput = z.infer<typeof AnalyzeConversationPerspectivesInputSchema>;

const AnalyzeConversationPerspectivesOutputSchema = z.object({
  analysis: z
    .string()
    .describe(
      'An explanation of the conversation from each speaker’s point of view, identifying their goals and contributions.'
    ),
});
export type AnalyzeConversationPerspectivesOutput = z.infer<typeof AnalyzeConversationPerspectivesOutputSchema>;

export async function analyzeConversationPerspectives(
  input: AnalyzeConversationPerspectivesInput
): Promise<AnalyzeConversationPerspectivesOutput> {
  return analyzeConversationPerspectivesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeConversationPerspectivesPrompt',
  input: {schema: AnalyzeConversationPerspectivesInputSchema},
  output: {schema: AnalyzeConversationPerspectivesOutputSchema},
  prompt: `Explain the conversation from both speakers’ point of view.
Focus on what each person wanted, asked, and contributed.

Transcript:
{{transcript}}`,
});

const analyzeConversationPerspectivesFlow = ai.defineFlow(
  {
    name: 'analyzeConversationPerspectivesFlow',
    inputSchema: AnalyzeConversationPerspectivesInputSchema,
    outputSchema: AnalyzeConversationPerspectivesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
