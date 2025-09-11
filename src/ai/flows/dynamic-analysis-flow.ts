'use server';
/**
 * @fileOverview A dynamic analysis flow that can run multiple types of transcript analysis
 * based on user selection and configure the AI provider at runtime.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {openAI} from 'genkitx-openai';
import {z} from 'zod';
import {
  defineSummaryPrompt,
  definePerspectivesPrompt,
  defineActionItemsPrompt,
  defineOpenQuestionsPrompt,
  defineTimelinePrompt,
  defineRisksPrompt,
  defineOpportunitiesPrompt,
  defineSentimentPrompt,
  AnalysisType,
} from './prompts';

const DynamicAnalysisInputSchema = z.object({
  transcript: z.string(),
  selectedAnalyses: z.array(z.nativeEnum(AnalysisType)),
  provider: z.enum(['google', 'openai']),
  apiKey: z.string(),
});

export type DynamicAnalysisInput = z.infer<typeof DynamicAnalysisInputSchema>;


export async function run(
  input: DynamicAnalysisInput
) {
  const {provider, apiKey} = input;
  const plugins = [];
  let model;

  if (provider === 'openai') {
    if (!apiKey) throw new Error("OpenAI API key is required.");
    plugins.push(openAI({apiKey}));
    model = 'openai/gpt-5-mini-2025-08-07';
  } else {
    if (!apiKey) throw new Error("Google AI API key is required.");
    plugins.push(googleAI({apiKey}));
    model = 'google/gemini-1.5-flash';
  }

  const dynamicAi = genkit({
    plugins: plugins,
  });
  
  // Define prompts for each analysis type using the dynamic AI instance
  const prompts = {
    summary: defineSummaryPrompt(dynamicAi),
    perspectives: definePerspectivesPrompt(dynamicAi),
    actionItems: defineActionItemsPrompt(dynamicAi),
    openQuestions: defineOpenQuestionsPrompt(dynamicAi),
    timeline: defineTimelinePrompt(dynamicAi),
    risks: defineRisksPrompt(dynamicAi),
    opportunities: defineOpportunitiesPrompt(dynamicAi),
    sentiment: defineSentimentPrompt(dynamicAi),
  };


  const runFlow = dynamicAi.defineFlow(
    {
      name: 'dynamicAnalysisFlow',
      inputSchema: DynamicAnalysisInputSchema,
      outputSchema: z.any(),
    },
    async (input) => {
      const {transcript, selectedAnalyses} = input;

      const analysisPromises = selectedAnalyses.map(async type => {
        const prompt = prompts[type];
        if (!prompt) {
          console.warn(`No prompt found for analysis type: ${type}`);
          return;
        }

        try {
          const {output} = await prompt({transcript}, {model});
          return {type, data: output};
        } catch (e: any) {
          console.error(`Error in '${type}' analysis:`, e.message);
          // Return error information to be handled by the caller
          return {type, error: e.message};
        }
      });

      const results = await Promise.all(analysisPromises);
      const finalResult: Record<string, any> = {};

      for (const result of results) {
        if (result) {
          if (result.error) {
            finalResult[result.type] = {error: result.error};
          } else {
            finalResult[result.type] = result.data;
          }
        }
      }
      return finalResult;
    }
  );


  return runFlow(input);
}
