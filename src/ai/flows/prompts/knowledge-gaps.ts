import type { Genkit } from 'genkit';
import { z } from 'zod';

const TranscriptInputSchema = z.object({
  transcript: z.string(),
});

export const KnowledgeGapsOutputSchema = z.object({
  knowledgeGaps: z
    .string()
    .describe(
      'A list of acknowledged uncertainties, assumptions made, or missing information. Format as Markdown.'
    ),
});
export type KnowledgeGapsOutput = z.infer<typeof KnowledgeGapsOutputSchema>;

export const defineKnowledgeGapsPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'knowledgeGapsPrompt',
  input: { schema: TranscriptInputSchema },
  output: { schema: KnowledgeGapsOutputSchema },
  prompt: `Highlight areas from the transcript where participants acknowledged uncertainty, made assumptions, or identified missing information that could affect outcomes. This is distinct from open questions by focusing on what's unknown or unverified. Format as Markdown.\n\nTranscript:\n{{transcript}}`,
});
