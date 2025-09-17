import type { Genkit } from 'genkit';
import { z } from 'zod';

const TranscriptInputSchema = z.object({
  transcript: z.string(),
});

export const StakeholderMappingOutputSchema = z.object({
  stakeholders: z
    .string()
    .describe(
      'A map of all people, teams, or organizations mentioned, their roles, influence, and relationships. Format as Markdown.'
    ),
});
export type StakeholderMappingOutput = z.infer<typeof StakeholderMappingOutputSchema>;

export const defineStakeholdersPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'stakeholderMappingPrompt',
  input: { schema: TranscriptInputSchema },
  output: { schema: StakeholderMappingOutputSchema },
  prompt: `Identify all people, teams, or organizations mentioned in the call, their roles, influence levels, and relationships to the discussed topics. This helps understand the broader ecosystem and potential impact areas. Format as Markdown.\n\nTranscript:\n{{transcript}}`,
});
