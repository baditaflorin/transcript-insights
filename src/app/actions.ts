'use server';

import {run} from '@/ai/flows/dynamic-analysis-flow';
import type {
  AnalyzeConversationPerspectivesOutput,
  ExtractActionItemsOutput,
  IdentifyOpenQuestionsOutput,
  SummarizeTranscriptOutput,
  TimelineOfKeyMomentsOutput,
  RisksAndConcernsOutput,
  OpportunitiesAndIdeasOutput,
  ToneAndSentimentOutput,
} from '@/ai/flows/prompts';
import {AnalysisType} from '@/ai/flows/prompts';

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

type ErrorResult = {error: string};

export type AnalysisResult = {
  perspectives?: AnalyzeConversationPerspectivesOutput | ErrorResult;
  actionItems?: ExtractActionItemsOutput | ErrorResult;
  openQuestions?: IdentifyOpenQuestionsOutput | ErrorResult;
  summary?: SummarizeTranscriptOutput | ErrorResult;
  timeline?: TimelineOfKeyMomentsOutput | ErrorResult;
  risks?: RisksAndConcernsOutput | ErrorResult;
  opportunities?: OpportunitiesAndIdeasOutput | ErrorResult;
  sentiment?: ToneAndSentimentOutput | ErrorResult;
};

export type AnalysisChunk =
  | {type: 'perspectives'; data: AnalyzeConversationPerspectivesOutput | ErrorResult}
  | {type: 'actionItems'; data: ExtractActionItemsOutput | ErrorResult}
  | {type: 'openQuestions'; data: IdentifyOpenQuestionsOutput | ErrorResult}
  | {type: 'summary'; data: SummarizeTranscriptOutput | ErrorResult}
  | {type: 'timeline'; data: TimelineOfKeyMomentsOutput | ErrorResult}
  | {type: 'risks'; data: RisksAndConcernsOutput | ErrorResult}
  | {type: 'opportunities'; data: OpportunitiesAndIdeasOutput | ErrorResult}
  | {type: 'sentiment'; data: ToneAndSentimentOutput | ErrorResult};


export async function analyzeTranscript(
  transcript: string,
  selectedAnalyses: (typeof AnalysisType)[keyof typeof AnalysisType][],
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
   if (provider === 'openai' && !apiKey) {
    return { error: 'API key is missing for OpenAI.' };
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
        if (chunk.error) {
          onChunk({ type: chunk.type, data: { error: chunk.error } } as AnalysisChunk);
        } else {
          onChunk(chunk as AnalysisChunk);
        }
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
