import type { Genkit } from 'genkit';
import { z } from 'zod';

const TranscriptInputSchema = z.object({
  transcript: z.string(),
});

export const TimelineOfKeyMomentsOutputSchema = z.object({
  timeline: z
    .string()
    .describe(
      'A chronological timeline of the main discussion points and decisions from the transcript. Include timestamps if available. Use concise bullet points with who said what. Format as Markdown.'
    ),
});
export type TimelineOfKeyMomentsOutput = z.infer<typeof TimelineOfKeyMomentsOutputSchema>;

export const defineTimelinePrompt = (ai: Genkit) => ai.definePrompt({
  name: 'timelineOfKeyMomentsPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: TimelineOfKeyMomentsOutputSchema},
  prompt: `Create a chronological timeline of the main discussion points and decisions from the transcript. Include timestamps if available. Use concise bullet points with who said what. Format your response as Markdown.\n\nTranscript:\n{{transcript}}`,
});
