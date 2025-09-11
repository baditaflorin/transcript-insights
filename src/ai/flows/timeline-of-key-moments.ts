'use server';

/**
 * @fileOverview A flow to create a timeline of key moments from a transcript.
 *
 * - timelineOfKeyMoments - A function that takes a transcript and returns a timeline.
 * - TimelineOfKeyMomentsInput - The input type for the timelineOfKeyMoments function.
 * - TimelineOfKeyMomentsOutput - The return type for the timelineOfKeyMoments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TimelineOfKeyMomentsInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the conversation to analyze.'),
});
export type TimelineOfKeyMomentsInput = z.infer<
  typeof TimelineOfKeyMomentsInputSchema
>;

const TimelineOfKeyMomentsOutputSchema = z.object({
  timeline: z
    .string()
    .describe(
      'A chronological timeline of the main discussion points and decisions from the transcript. Include timestamps if available. Use concise bullet points with who said what. Format as Markdown.'
    ),
});
export type TimelineOfKeyMomentsOutput = z.infer<
  typeof TimelineOfKeyMomentsOutputSchema
>;

export async function timelineOfKeyMoments(
  input: TimelineOfKeyMomentsInput,
  onChunk?: (chunk: TimelineOfKeyMomentsOutput) => void
): Promise<TimelineOfKeyMomentsOutput> {
  return timelineOfKeyMomentsFlow(input, onChunk);
}

const prompt = ai.definePrompt({
  name: 'timelineOfKeyMomentsPrompt',
  input: {schema: TimelineOfKeyMomentsInputSchema},
  output: {schema: TimelineOfKeyMomentsOutputSchema},
  prompt: `Create a chronological timeline of the main discussion points and decisions from the transcript.
Include timestamps if available. Use concise bullet points with who said what.
Format your response as Markdown.

Transcript:
{{transcript}}`,
});

const timelineOfKeyMomentsFlow = ai.defineFlow(
  {
    name: 'timelineOfKeyMomentsFlow',
    inputSchema: TimelineOfKeyMomentsInputSchema,
    outputSchema: TimelineOfKeyMomentsOutputSchema,
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
