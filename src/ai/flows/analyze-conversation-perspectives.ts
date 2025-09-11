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
export type AnalyzeConversationPerspectivesInput = z.infer<
  typeof AnalyzeConversationPerspectivesInputSchema
>;

const AnalyzeConversationPerspectivesOutputSchema = z.object({
  analysis: z
    .string()
    .describe(
      'An explanation of the conversation from each speaker’s point of view, identifying their goals and contributions. Format the output as Markdown.'
    ),
});
export type AnalyzeConversationPerspectivesOutput = z.infer<
  typeof AnalyzeConversationPerspectivesOutputSchema
>;

export async function analyzeConversationPerspectives(
  input: AnalyzeConversationPerspectivesInput,
  onChunk?: (chunk: AnalyzeConversationPerspectivesOutput) => void
): Promise<AnalyzeConversationPerspectivesOutput> {
  return analyzeConversationPerspectivesFlow(input, onChunk);
}

const prompt = ai.definePrompt({
  name: 'analyzeConversationPerspectivesPrompt',
  input: {schema: AnalyzeConversationPerspectivesInputSchema},
  output: {schema: AnalyzeConversationPerspectivesOutputSchema},
  prompt: `Explain the conversation from both speakers’ point of view.
Focus on what each person wanted, asked, and contributed.
Format your response as Markdown.

Transcript:
{{transcript}}`,
});

const analyzeConversationPerspectivesFlow = ai.defineFlow(
  {
    name: 'analyzeConversationPerspectivesFlow',
    inputSchema: AnalyzeConversationPerspectivesInputSchema,
    outputSchema: AnalyzeConversationPerspectivesOutputSchema,
  },
  async (input, onChunk) => {
    const {stream, response} = prompt.stream(input);
    if (onChunk) {
      for await (const chunk of stream) {
        onChunk(chunk);
      }
    }
    return (await response)!;
  }
);
