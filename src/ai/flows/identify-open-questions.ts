'use server';

/**
 * @fileOverview A flow to identify open questions and follow-up items from a transcript.
 *
 * - identifyOpenQuestions - A function that takes a transcript and returns a list of open questions.
 * - IdentifyOpenQuestionsInput - The input type for the identifyOpenQuestions function.
 * - IdentifyOpenQuestionsOutput - The return type for the identifyOpenQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyOpenQuestionsInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the conversation to analyze.'),
});
export type IdentifyOpenQuestionsInput = z.infer<
  typeof IdentifyOpenQuestionsInputSchema
>;

const IdentifyOpenQuestionsOutputSchema = z.object({
  openQuestions: z
    .string()
    .describe(
      'A list of unanswered questions, unclear points, or topics that require follow-up from this conversation, phrased as clear questions or reminders that can be used in the next meeting.'
    ),
});
export type IdentifyOpenQuestionsOutput = z.infer<
  typeof IdentifyOpenQuestionsOutputSchema
>;

export async function identifyOpenQuestions(
  input: IdentifyOpenQuestionsInput
): Promise<IdentifyOpenQuestionsOutput> {
  return identifyOpenQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyOpenQuestionsPrompt',
  input: {schema: IdentifyOpenQuestionsInputSchema},
  output: {schema: IdentifyOpenQuestionsOutputSchema},
  prompt: `Identify any unanswered questions, unclear points, or topics that require follow-up from this conversation. Phrase them as clear questions or reminders that can be used in the next meeting.\n\nTranscript:\n{{transcript}}`,
});

const identifyOpenQuestionsFlow = ai.defineFlow(
  {
    name: 'identifyOpenQuestionsFlow',
    inputSchema: IdentifyOpenQuestionsInputSchema,
    outputSchema: IdentifyOpenQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
