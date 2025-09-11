import { config } from 'dotenv';
config();

import '@/ai/flows/extract-action-items.ts';
import '@/ai/flows/analyze-conversation-perspectives.ts';
import '@/ai/flows/identify-open-questions.ts';