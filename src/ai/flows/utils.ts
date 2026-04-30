/**
 * @fileOverview This file contains utility functions for the AI flows.
 */

import {genkit, type Genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {openAI} from 'genkitx-openai';

export function configureAi(provider: 'google' | 'openai', apiKey: string): Genkit {
  const plugins = [];

  if (provider === 'openai') {
    if (!apiKey) throw new Error('OpenAI API key is required.');
    plugins.push(openAI({apiKey}));
  } else {
    if (!apiKey) throw new Error('Google AI API key is required.');
    plugins.push(googleAI({apiKey}));
  }

  return genkit({
    plugins: plugins,
  });
}
