'use server';

/**
 * @fileOverview A flow to summarize a transcript.
 *
 * - summarizeTranscript - A function that takes a transcript and returns a summary.
 * - SummarizeTranscriptInput - The input type for the summarizeTranscript function.
 * - SummarizeTranscriptOutput - The return type for the summarizeTranscript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTranscriptInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the conversation to summarize.'),
});
export type SummarizeTranscriptInput = z.infer<
  typeof SummarizeTranscriptInputSchema
>;

const SummarizeTranscriptOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the conversation. Format the output as Markdown.'
    ),
});
export type SummarizeTranscriptOutput = z.infer<
  typeof SummarizeTranscriptOutputSchema
>;

export async function summarizeTranscript(
  input: SummarizeTranscriptInput,
  onChunk?: (chunk: SummarizeTranscriptOutput) => void
): Promise<SummarizeTranscriptOutput> {
  return summarizeTranscriptFlow(input, onChunk);
}

const prompt = ai.definePrompt({
  name: 'summarizeTranscriptPrompt',
  input: {schema: SummarizeTranscriptInputSchema},
  output: {schema: SummarizeTranscriptOutputSchema},
  prompt: `Summarize the following conversation.
Format your response as Markdown.

Transcript:
{{transcript}}`,
});

const summarizeTranscriptFlow = ai.defineFlow(
  {
    name: 'summarizeTranscriptFlow',
    inputSchema: SummarizeTranscriptInputSchema,
    outputSchema: SummarizeTranscriptOutputSchema,
  },
  async (input, onChunk) => {
    const {response} = await prompt.stream(input);
    const output = (await response)!;
    if (onChunk) {
      onChunk(output);
    }
    return output;
  }
);
