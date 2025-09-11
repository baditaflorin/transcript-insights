'use server';

import { analyzeConversationPerspectives } from '@/ai/flows/analyze-conversation-perspectives';
import { extractActionItems } from '@/ai/flows/extract-action-items';
import { identifyOpenQuestions } from '@/ai/flows/identify-open-questions';
import type { AnalyzeConversationPerspectivesOutput } from '@/ai/flows/analyze-conversation-perspectives';
import type { ExtractActionItemsOutput } from '@/ai/flows/extract-action-items';
import type { IdentifyOpenQuestionsOutput } from '@/ai/flows/identify-open-questions';

export type AnalysisResult = {
  perspectives: AnalyzeConversationPerspectivesOutput;
  actionItems: ExtractActionItemsOutput;
  openQuestions: IdentifyOpenQuestionsOutput;
};

export async function analyzeTranscript(transcript: string): Promise<AnalysisResult | { error: string }> {
  if (!transcript || transcript.trim().length === 0) {
    return { error: 'Transcript is empty. Please provide some text to analyze.' };
  }

  try {
    const [perspectives, actionItems, openQuestions] = await Promise.all([
      analyzeConversationPerspectives({ transcript }),
      extractActionItems({ transcript }),
      identifyOpenQuestions({ transcript }),
    ]);

    return {
      perspectives,
      actionItems,
      openQuestions,
    };
  } catch (e: any) {
    console.error('Error analyzing transcript:', e);
    return { error: `An unexpected error occurred while analyzing the transcript: ${e.message}` };
  }
}
