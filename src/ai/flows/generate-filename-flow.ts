'use server';
/**
 * @fileOverview A flow to generate a descriptive filename from a transcript.
 */

import {z} from 'zod';
import {configureAi} from './utils';
import type { GenerateFilenameInput, GenerateFilenameOutput, GenerateFilenameInputSchema, GenerateFilenameOutputSchema } from '@/app/actions';


export async function generateFilename(
  input: GenerateFilenameInput
): Promise<GenerateFilenameOutput> {
  const {provider, apiKey} = input;
  const dynamicAi = configureAi(provider, apiKey);
  const model = provider === 'openai' ? 'openai/gpt-4o-mini' : 'google/gemini-1.5-flash';

  const FilenamePrompt = dynamicAi.definePrompt(
    {
      name: 'filenamePrompt',
      input: {schema: z.object({transcript: z.string()})},
      output: {schema: z.object({filename: z.string()})},
      prompt: `Based on the following transcript, generate a short, descriptive, file-safe filename. The filename should be in kebab-case and end with '.md'. For example: 'quarterly-sales-review.md'.\n\nTranscript:\n{{transcript}}`,
    }
  );

  const generateFilenameFlow = dynamicAi.defineFlow(
    {
      name: 'generateFilenameFlow',
      inputSchema: z.object({
        transcript: z.string(),
        provider: z.enum(['google', 'openai']),
        apiKey: z.string(),
      }),
      outputSchema: z.object({
        filename: z.string(),
      }),
    },
    async (input) => {
        const {output} = await FilenamePrompt({transcript: input.transcript}, {model});
        return output!;
    }
  );
  
  return generateFilenameFlow(input);
}
