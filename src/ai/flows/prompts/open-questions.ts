import type { Genkit } from 'genkit';
import { z } from 'zod';

const TranscriptInputSchema = z.object({
  transcript: z.string(),
});

const OpenQuestionSchema = z.object({
  speaker: z.string().describe('The speaker who raised the question or whose point is unclear.'),
  question: z.string().describe('The specific unanswered question, unclear point, or topic for follow-up.'),
});

export const IdentifyOpenQuestionsOutputSchema = z.object({
  openQuestions: z
    .array(OpenQuestionSchema)
    .describe('A list of unanswered questions, grouped by the speaker who raised them.'),
});
export type IdentifyOpenQuestionsOutput = z.infer<typeof IdentifyOpenQuestionsOutputSchema>;

export const defineOpenQuestionsPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'identifyOpenQuestionsPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: IdentifyOpenQuestionsOutputSchema},
  prompt: `Identify any unanswered questions, unclear points, or topics that require follow-up from this conversation. For each item, identify the speaker who raised it and what the question was. Phrase them as clear questions or reminders that can be used in the next meeting.\n\nTranscript:\n{{transcript}}`,
});
