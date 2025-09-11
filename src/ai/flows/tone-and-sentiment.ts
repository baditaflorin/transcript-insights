'use server';

/**
 * @fileOverview A flow to analyze the tone and sentiment of a conversation.
 *
 * - toneAndSentiment - A function that takes a transcript and returns a sentiment analysis.
 * - ToneAndSentimentInput - The input type for the toneAndSentiment function.
 * - ToneAndSentimentOutput - The return type for the toneAndSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ToneAndSentimentInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the conversation to analyze.'),
});
export type ToneAndSentimentInput = z.infer<typeof ToneAndSentimentInputSchema>;

const ToneAndSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'An analysis of the overall tone and sentiment of the conversation. Describe how each speaker felt during the conversation (positive, neutral, concerned, skeptical, enthusiastic, etc.) and support with evidence from their words. Format as Markdown.'
    ),
});
export type ToneAndSentimentOutput = z.infer<
  typeof ToneAndSentimentOutputSchema
>;

export async function toneAndSentiment(
  input: ToneAndSentimentInput,
  onChunk?: (chunk: ToneAndSentimentOutput) => void
): Promise<ToneAndSentimentOutput> {
  return toneAndSentimentFlow(input, onChunk);
}

const prompt = ai.definePrompt({
  name: 'toneAndSentimentPrompt',
  input: {schema: ToneAndSentimentInputSchema},
  output: {schema: ToneAndSentimentOutputSchema},
  prompt: `Analyze the overall tone and sentiment of the conversation.
Describe how each speaker felt during the conversation (positive, neutral, concerned, skeptical, enthusiastic, etc.) and support with evidence from their words.
Format your response as Markdown.

Transcript:
{{transcript}}`,
});

const toneAndSentimentFlow = ai.defineFlow(
  {
    name: 'toneAndSentimentFlow',
    inputSchema: ToneAndSentimentInputSchema,
    outputSchema: ToneAndSentimentOutputSchema,
  },
  async (input, onChunk) => {
    const {stream, response} = await prompt.stream(input);
    if (onChunk) {
      for await (const chunk of stream) {
        onChunk(chunk);
      }
    }
    return (await response)!;
  }
);
