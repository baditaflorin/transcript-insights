import type { Genkit } from 'genkit';
import { z } from 'zod';

const TranscriptInputSchema = z.object({
  transcript: z.string(),
});

export const AnalyzeConversationPerspectivesOutputSchema = z.object({
  analysis: z
    .string()
    .describe(
      'An explanation of the conversation from each speaker’s point of view, identifying their goals and contributions. Format the output as Markdown.'
    ),
});
export type AnalyzeConversationPerspectivesOutput = z.infer<typeof AnalyzeConversationPerspectivesOutputSchema>;

export const definePerspectivesPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'analyzeConversationPerspectivesPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: AnalyzeConversationPerspectivesOutputSchema},
  prompt: `Explain the conversation from both speakers’ point of view. Focus on what each person wanted, asked, and contributed. Format your response as Markdown.\n\nTranscript:\n{{transcript}}`,
});
