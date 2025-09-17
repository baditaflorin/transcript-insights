import type { Genkit } from 'genkit';
import { z } from 'zod';

const TranscriptInputSchema = z.object({
  transcript: z.string(),
});

export const ToneAndSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'An analysis of the overall tone and sentiment of the conversation. Describe how each speaker felt during the conversation (positive, neutral, concerned, skeptical, enthusiastic, etc.) and support with evidence from their words. Format as Markdown.'
    ),
});
export type ToneAndSentimentOutput = z.infer<typeof ToneAndSentimentOutputSchema>;

export const defineSentimentPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'toneAndSentimentPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: ToneAndSentimentOutputSchema},
  prompt: `Analyze the overall tone and sentiment of the conversation from the provided transcript. Your response must be a JSON object with a single key, "sentiment", which contains the full analysis in Markdown format.\n\nTranscript:\n{{transcript}}`,
});
