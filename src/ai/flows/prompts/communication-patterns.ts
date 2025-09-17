import type { Genkit } from 'genkit';
import { z } from 'zod';

const TranscriptInputSchema = z.object({
  transcript: z.string(),
});

export const CommunicationPatternsOutputSchema = z.object({
  communicationPatterns: z
    .string()
    .describe(
      'An analysis of speaking time, interruption patterns, and agreement/disagreement frequencies. Format as Markdown.'
    ),
});
export type CommunicationPatternsOutput = z.infer<typeof CommunicationPatternsOutputSchema>;

export const defineCommunicationPatternsPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'communicationPatternsPrompt',
  input: { schema: TranscriptInputSchema },
  output: { schema: CommunicationPatternsOutputSchema },
  prompt: `Analyze speaking time distribution, interruption patterns, and agreement/disagreement frequencies from the transcript. Your response must be a JSON object with a single key, "communicationPatterns", which contains the full analysis in Markdown format.\n\nTranscript:\n{{transcript}}`,
});
