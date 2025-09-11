'use server';

import {run} from '@/ai/flows/dynamic-analysis-flow';
import type {
  AnalysisType,
  AnalyzeConversationPerspectivesOutput,
  ExtractActionItemsOutput,
  IdentifyOpenQuestionsOutput,
  SummarizeTranscriptOutput,
  TimelineOfKeyMomentsOutput,
  RisksAndConcernsOutput,
  OpportunitiesAndIdeasOutput,
  ToneAndSentimentOutput,
} from '@/app/page';

export type {
  AnalyzeConversationPerspectivesOutput,
  ExtractActionItemsOutput,
  IdentifyOpenQuestionsOutput,
  SummarizeTranscriptOutput,
  TimelineOfKeyMomentsOutput,
  RisksAndConcernsOutput,
  OpportunitiesAndIdeasOutput,
  ToneAndSentimentOutput,
};

export type AnalysisResult = {
  perspectives?: AnalyzeConversationPerspectivesOutput;
  actionItems?: ExtractActionItemsOutput;
  openQuestions?: IdentifyOpenQuestionsOutput;
  summary?: SummarizeTranscriptOutput;
  timeline?: TimelineOfKeyMomentsOutput;
  risks?: RisksAndConcernsOutput;
  opportunities?: OpportunitiesAndIdeasOutput;
  sentiment?: ToneAndSentimentOutput;
};

export type AnalysisChunk =
  | {type: 'perspectives'; data: AnalyzeConversationPerspectivesOutput}
  | {type: 'actionItems'; data: ExtractActionItemsOutput}
  | {type: 'openQuestions'; data: IdentifyOpenQuestionsOutput}
  | {type: 'summary'; data: SummarizeTranscriptOutput}
  | {type: 'timeline'; data: TimelineOfKeyMomentsOutput}
  | {type: 'risks'; data: RisksAndConcernsOutput}
  | {type: 'opportunities'; data: OpportunitiesAndIdeasOutput}
  | {type: 'sentiment'; data: ToneAndSentimentOutput};

export async function analyzeTranscript(
  transcript: string,
  selectedAnalyses: AnalysisType[],
  provider: 'google' | 'openai',
  apiKey: string | undefined,
  onChunk: (chunk: AnalysisChunk) => void
): Promise<AnalysisResult | {error: string}> {
  if (!transcript || transcript.trim().length === 0) {
    return {error: 'Transcript is empty. Please provide some text to analyze.'};
  }
  if (selectedAnalyses.length === 0) {
    return {error: 'No analysis types were selected.'};
  }
   if (!apiKey) {
    return { error: 'API key is missing.' };
  }

  try {
    const results = await run(
      {
        transcript,
        selectedAnalyses,
        provider,
        apiKey,
      },
      chunk => {
        // The dynamic flow returns chunks with a specific shape. We adapt it here.
        onChunk(chunk as AnalysisChunk);
      }
    );
    return results as AnalysisResult;
  } catch (e: any) {
    console.error('Error analyzing transcript:', e);
    return {
      error: `An unexpected error occurred while analyzing the transcript: ${e.message}`,
    };
  }
}
