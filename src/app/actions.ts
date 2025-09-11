'use server';

import {
  analyzeConversationPerspectives,
  AnalyzeConversationPerspectivesOutput,
} from '@/ai/flows/analyze-conversation-perspectives';
import {
  extractActionItems,
  ExtractActionItemsOutput,
} from '@/ai/flows/extract-action-items';
import {
  identifyOpenQuestions,
  IdentifyOpenQuestionsOutput,
} from '@/ai/flows/identify-open-questions';
import {
  summarizeTranscript,
  SummarizeTranscriptOutput,
} from '@/ai/flows/summarize-transcript';

export type {
  AnalyzeConversationPerspectivesOutput,
  ExtractActionItemsOutput,
  IdentifyOpenQuestionsOutput,
  SummarizeTranscriptOutput,
};

export type AnalysisResult = {
  perspectives: AnalyzeConversationPerspectivesOutput;
  actionItems: ExtractActionItemsOutput;
  openQuestions: IdentifyOpenQuestionsOutput;
  summary: SummarizeTranscriptOutput;
};

export async function analyzeTranscript(
  transcript: string,
  onChunk: (
    chunk:
      | {type: 'perspectives'; data: AnalyzeConversationPerspectivesOutput}
      | {type: 'actionItems'; data: ExtractActionItemsOutput}
      | {type: 'openQuestions'; data: IdentifyOpenQuestionsOutput}
      | {type: 'summary'; data: SummarizeTranscriptOutput}
  ) => void
): Promise<AnalysisResult | {error: string}> {
  if (!transcript || transcript.trim().length === 0) {
    return {error: 'Transcript is empty. Please provide some text to analyze.'};
  }

  try {
    const [perspectives, actionItems, openQuestions, summary] =
      await Promise.all([
        analyzeConversationPerspectives({transcript}, chunk =>
          onChunk({type: 'perspectives', data: chunk})
        ),
        extractActionItems({transcript}, chunk =>
          onChunk({type: 'actionItems', data: chunk})
        ),
        identifyOpenQuestions({transcript}, chunk =>
          onChunk({type: 'openQuestions', data: chunk})
        ),
        summarizeTranscript({transcript}, chunk =>
          onChunk({type: 'summary', data: chunk})
        ),
      ]);

    return {
      perspectives,
      actionItems,
      openQuestions,
      summary,
    };
  } catch (e: any) {
    console.error('Error analyzing transcript:', e);
    return {
      error: `An unexpected error occurred while analyzing the transcript: ${e.message}`,
    };
  }
}
