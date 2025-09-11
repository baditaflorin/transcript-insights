'use server';

/**
 * @fileOverview A flow to identify risks and concerns from a transcript.
 *
 * - risksAndConcerns - A function that takes a transcript and returns a list of risks and concerns.
 * - RisksAndConcernsInput - The input type for the risksAndConcerns function.
 * - RisksAndConcernsOutput - The return type for the risksAndConcerns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RisksAndConcernsInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the conversation to analyze.'),
});
export type RisksAndConcernsInput = z.infer<typeof RisksAndConcernsInputSchema>;

const RisksAndConcernsOutputSchema = z.object({
  risksAndConcerns: z
    .string()
    .describe(
      'A list of any risks, concerns, or objections raised explicitly or implicitly. For each, explain which speaker raised it and why it matters. Format as Markdown.'
    ),
});
export type RisksAndConcernsOutput = z.infer<
  typeof RisksAndConcernsOutputSchema
>;

export async function risksAndConcerns(
  input: RisksAndConcernsInput,
  onChunk?: (chunk: RisksAndConcernsOutput) => void
): Promise<RisksAndConcernsOutput> {
  return risksAndConcernsFlow(input, onChunk);
}

const prompt = ai.definePrompt({
  name: 'risksAndConcernsPrompt',
  input: {schema: RisksAndConcernsInputSchema},
  output: {schema: RisksAndConcernsOutputSchema},
  prompt: `From the transcript, identify any risks, concerns, or objections raised explicitly or implicitly.
For each, explain which speaker raised it and why it matters.
Format your response as Markdown.

Transcript:
{{transcript}}`,
});

const risksAndConcernsFlow = ai.defineFlow(
  {
    name: 'risksAndConcernsFlow',
    inputSchema: RisksAndConcernsInputSchema,
    outputSchema: RisksAndConcernsOutputSchema,
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
