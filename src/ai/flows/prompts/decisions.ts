import type { Genkit } from 'genkit';
import { z } from 'zod';

const TranscriptInputSchema = z.object({
  transcript: z.string(),
});

export const KeyDecisionsOutputSchema = z.object({
  decisions: z
    .string()
    .describe(
      'A list of specific decisions made, commitments given, and agreed-upon next steps with ownership. Format as Markdown.'
    ),
});
export type KeyDecisionsOutput = z.infer<typeof KeyDecisionsOutputSchema>;

export const defineDecisionsPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'keyDecisionsPrompt',
  input: { schema: TranscriptInputSchema },
  output: { schema: KeyDecisionsOutputSchema },
  prompt: `Extract specific decisions made, commitments given by participants, and any agreed-upon next steps with ownership from the transcript. This differs from action items by focusing on binding agreements and strategic choices. Format as Markdown.\n\nTranscript:\n{{transcript}}`,
});
