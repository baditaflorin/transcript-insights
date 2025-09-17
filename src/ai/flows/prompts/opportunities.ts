import type { Genkit } from 'genkit';
import { z } from 'zod';

const TranscriptInputSchema = z.object({
  transcript: z.string(),
});

export const OpportunitiesAndIdeasOutputSchema = z.object({
  opportunitiesAndIdeas: z
    .string()
    .describe(
      'A list of all opportunities, ideas, or suggestions that came up in the conversation. Highlight which person suggested each idea and any next steps attached to it. Format as Markdown.'
    ),
});
export type OpportunitiesAndIdeasOutput = z.infer<typeof OpportunitiesAndIdeasOutputSchema>;

export const defineOpportunitiesPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'opportunitiesAndIdeasPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: OpportunitiesAndIdeasOutputSchema},
prompt: `List all opportunities, ideas, or suggestions that came up in the conversation. Highlight which person suggested each idea and any next steps attached to it. Format your response as Markdown.\n\nTranscript:\n{{transcript}}`,
});
