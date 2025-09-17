import type { Genkit } from 'genkit';
import { z } from 'zod';

const TranscriptInputSchema = z.object({
  transcript: z.string(),
});

const ActionItemSchema = z.object({
  speaker: z.string().describe('The speaker assigned the action item.'),
  task: z.string().describe('The specific action item or task.'),
});

export const ExtractActionItemsOutputSchema = z.object({
  actionItems: z
    .array(ActionItemSchema)
    .describe('A list of action items for each speaker.'),
});
export type ExtractActionItemsOutput = z.infer<typeof ExtractActionItemsOutputSchema>;

export const defineActionItemsPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'extractActionItemsPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: ExtractActionItemsOutputSchema},
  prompt: `Create a checklist of action items for each speaker based on the transcript. Make it specific, task-oriented, and assign clearly who is responsible. If no tasks exist for a person, you can omit them from the output.\n\nTranscript:\n{{transcript}}`,
});
