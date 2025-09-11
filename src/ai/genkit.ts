import {genkit, Model} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

let model: Model<any, any> = 'googleai/gemini-2.5-flash';
const plugins = [googleAI()];

// The default 'ai' instance will use Google AI.
// The dynamic flow will create its own instance based on user input.
export const ai = genkit({
  plugins: plugins,
  model: model,
});
