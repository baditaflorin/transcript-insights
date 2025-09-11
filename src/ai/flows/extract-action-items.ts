'use server';

/**
 * @fileOverview A flow to extract action items for each speaker from a transcript.
 *
 * - extractActionItems - A function that handles the extraction of action items.
 * - ExtractActionItemsInput - The input type for the extractActionItems function.
 * - ExtractActionItemsOutput - The return type for the extractActionItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractActionItemsInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the conversation to extract action items from.'),
});
export type ExtractActionItemsInput = z.infer<
  typeof ExtractActionItemsInputSchema
>;

const ActionItemSchema = z.object({
  speaker: z.string().describe('The speaker assigned the action item.'),
  task: z.string().describe('The specific action item or task.'),
});

const ExtractActionItemsOutputSchema = z.object({
  actionItems: z
    .array(ActionItemSchema)
    .describe('A list of action items for each speaker.'),
});
export type ExtractActionItemsOutput = z.infer<
  typeof ExtractActionItemsOutputSchema
>;

export async function extractActionItems(
  input: ExtractActionItemsInput,
  onChunk?: (chunk: ExtractActionItemsOutput) => void
): Promise<ExtractActionItemsOutput> {
  return extractActionItemsFlow(input, onChunk);
}

const prompt = ai.definePrompt({
  name: 'extractActionItemsPrompt',
  input: {schema: ExtractActionItemsInputSchema},
  output: {schema: ExtractActionItemsOutputSchema},
  prompt: `Create a checklist of action items for each speaker based on the transcript.
Make it specific, task-oriented, and assign clearly who is responsible.
If no tasks exist for a person, you can omit them from the output.`,
});

const extractActionItemsFlow = ai.defineFlow(
  {
    name: 'extractActionItemsFlow',
    inputSchema: ExtractActionItemsInputSchema,
    outputSchema: ExtractActionItemsOutputSchema,
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
