import type { Genkit } from 'genkit';
import { z } from 'zod';

const TranscriptInputSchema = z.object({
  transcript: z.string(),
});

export const SummarizeTranscriptOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the conversation. Format the output as Markdown.'
    ),
});
export type SummarizeTranscriptOutput = z.infer<typeof SummarizeTranscriptOutputSchema>;

export const defineSummaryPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'summarizeTranscriptPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: SummarizeTranscriptOutputSchema},
  prompt: `Summarize the following conversation. Format your response as Markdown.\n\nTranscript:\n{{transcript}}`,
});
