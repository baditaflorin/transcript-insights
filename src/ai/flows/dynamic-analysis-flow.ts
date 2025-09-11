'use server';
/**
 * @fileOverview A dynamic analysis flow that can run multiple types of transcript analysis
 * based on user selection and configure the AI provider at runtime.
 */

import {z} from 'zod';
import {
  AnalysisType,
  defineSummaryPrompt,
  definePerspectivesPrompt,
  defineActionItemsPrompt,
  defineOpenQuestionsPrompt,
  defineTimelinePrompt,
  defineRisksPrompt,
  defineOpportunitiesPrompt,
  defineSentimentPrompt,
  defineDecisionsPrompt,
  defineStakeholdersPrompt,
  defineKnowledgeGapsPrompt,
  defineCommunicationPatternsPrompt,
} from './prompts';
import { configureAi } from './utils';

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
  
  const dynamicAi = configureAi(provider, apiKey);
  const model = provider === 'openai' ? 'openai/gpt-4o-mini' : 'google/gemini-1.5-flash';

  
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
    decisions: defineDecisionsPrompt(dynamicAi),
    stakeholders: defineStakeholdersPrompt(dynamicAi),
    knowledgeGaps: defineKnowledgeGapsPrompt(dynamicAi),
    communicationPatterns: defineCommunicationPatternsPrompt(dynamicAi),
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
        const prompt = prompts[type as keyof typeof prompts];
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
