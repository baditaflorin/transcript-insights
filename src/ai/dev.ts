import { config } from 'dotenv';
config();

import '@/ai/flows/extract-action-items.ts';
import '@/ai/flows/analyze-conversation-perspectives.ts';
import '@/ai/flows/identify-open-questions.ts';
import '@/ai/flows/summarize-transcript.ts';
import '@/ai/flows/timeline-of-key-moments';
import '@/ai/flows/risks-and-concerns';
import '@/ai/flows/opportunities-and-ideas';
import '@/ai/flows/tone-and-sentiment';
