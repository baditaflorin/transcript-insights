'use server';

/**
 * @fileOverview A flow to identify opportunities and ideas from a transcript.
 *
 * - opportunitiesAndIdeas - A function that takes a transcript and returns a list of opportunities and ideas.
 * - OpportunitiesAndIdeasInput - The input type for the opportunitiesAndIdeas function.
 * - OpportunitiesAndIdeasOutput - The return type for the opportunitiesAndIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OpportunitiesAndIdeasInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the conversation to analyze.'),
});
export type OpportunitiesAndIdeasInput = z.infer<
  typeof OpportunitiesAndIdeasInputSchema
>;

const OpportunitiesAndIdeasOutputSchema = z.object({
  opportunitiesAndIdeas: z
    .string()
    .describe(
      'A list of all opportunities, ideas, or suggestions that came up in the conversation. Highlight which person suggested each idea and any next steps attached to it. Format as Markdown.'
    ),
});
export type OpportunitiesAndIdeasOutput = z.infer<
  typeof OpportunitiesAndIdeasOutputSchema
>;

export async function opportunitiesAndIdeas(
  input: OpportunitiesAndIdeasInput,
  onChunk?: (chunk: OpportunitiesAndIdeasOutput) => void
): Promise<OpportunitiesAndIdeasOutput> {
  return opportunitiesAndIdeasFlow(input, onChunk);
}

const prompt = ai.definePrompt({
  name: 'opportunitiesAndIdeasPrompt',
  input: {schema: OpportunitiesAndIdeasInputSchema},
  output: {schema: OpportunitiesAndIdeasOutputSchema},
  prompt: `List all opportunities, ideas, or suggestions that came up in the conversation.
Highlight which person suggested each idea and any next steps attached to it.
Format your response as Markdown.

Transcript:
{{transcript}}`,
});

const opportunitiesAndIdeasFlow = ai.defineFlow(
  {
    name: 'opportunitiesAndIdeasFlow',
    inputSchema: OpportunitiesAndIdeasInputSchema,
    outputSchema: OpportunitiesAndIdeasOutputSchema,
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
