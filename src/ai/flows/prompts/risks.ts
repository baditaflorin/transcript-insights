import type { Genkit } from 'genkit';
import { z } from 'zod';

const TranscriptInputSchema = z.object({
  transcript: z.string(),
});

export const RisksAndConcernsOutputSchema = z.object({
  risksAndConcerns: z
    .string()
    .describe(
      'A list of any risks, concerns, or objections raised explicitly or implicitly. For each, explain which speaker raised it and why it matters. Format as Markdown.'
    ),
});
export type RisksAndConcernsOutput = z.infer<typeof RisksAndConcernsOutputSchema>;

export const defineRisksPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'risksAndConcernsPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: RisksAndConcernsOutputSchema},
  prompt: `From the transcript, identify any risks, concerns, or objections raised explicitly or implicitly. For each, explain which speaker raised it and why it matters. Format your response as Markdown.\n\nTranscript:\n{{transcript}}`,
});
