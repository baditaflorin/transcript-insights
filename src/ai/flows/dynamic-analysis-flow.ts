'use server';
/**
 * @fileOverview A dynamic analysis flow that can run multiple types of transcript analysis
 * based on user selection and configure the AI provider at runtime.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {openAI} from 'genkitx-openai';
import {z} from 'genkit/zod';
import {
  summaryPrompt,
  perspectivesPrompt,
  actionItemsPrompt,
  openQuestionsPrompt,
  timelinePrompt,
  risksPrompt,
  opportunitiesPrompt,
  sentimentPrompt,
  AnalysisType,
} from './prompts';

// Define prompts for each analysis type
const prompts = {
  summary: summaryPrompt,
  perspectives: perspectivesPrompt,
  actionItems: actionItemsPrompt,
  openQuestions: openQuestionsPrompt,
  timeline: timelinePrompt,
  risks: risksPrompt,
  opportunities: opportunitiesPrompt,
  sentiment: sentimentPrompt,
};

const DynamicAnalysisInputSchema = z.object({
  transcript: z.string(),
  selectedAnalyses: z.array(z.nativeEnum(AnalysisType)),
  provider: z.enum(['google', 'openai']),
  apiKey: z.string(),
});

export type DynamicAnalysisInput = z.infer<typeof DynamicAnalysisInputSchema>;

const runFlow = genkit.defineFlow(
  {
    name: 'dynamicAnalysisFlow',
    inputSchema: DynamicAnalysisInputSchema,
    outputSchema: z.any(),
  },
  async (input, onChunk) => {
    const {transcript, selectedAnalyses} = input;

    const analysisPromises = selectedAnalyses.map(async type => {
      const prompt = prompts[type];
      if (!prompt) {
        console.warn(`No prompt found for analysis type: ${type}`);
        return;
      }

      try {
        const {response} = await prompt.stream({transcript});
        const output = (await response)!;
        if (onChunk) {
          onChunk({type, data: output});
        }
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

export async function run(
  input: DynamicAnalysisInput,
  onChunk?: (chunk: any) => void
) {
  const {provider, apiKey} = input;
  const plugins = [];
  let model;

  if (provider === 'openai') {
    plugins.push(openAI({apiKey}));
    model = 'openai/gpt-4o-mini';
  } else {
    plugins.push(googleAI({apiKey}));
    model = 'googleai/gemini-2.5-flash';
  }

  const dynamicAi = genkit({
    plugins: plugins,
    model: model,
  });

  return runFlow.run(dynamicAi, input, onChunk);
}
