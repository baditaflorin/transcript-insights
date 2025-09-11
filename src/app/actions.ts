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
  opportunitiesAndIdeas,
  OpportunitiesAndIdeasOutput,
} from '@/ai/flows/opportunities-and-ideas';
import {
  risksAndConcerns,
  RisksAndConcernsOutput,
} from '@/ai/flows/risks-and-concerns';
import {
  summarizeTranscript,
  SummarizeTranscriptOutput,
} from '@/ai/flows/summarize-transcript';
import {
  timelineOfKeyMoments,
  TimelineOfKeyMomentsOutput,
} from '@/ai/flows/timeline-of-key-moments';
import {
  toneAndSentiment,
  ToneAndSentimentOutput,
} from '@/ai/flows/tone-and-sentiment';
import { analysisTypes, AnalysisType } from '@/app/page';

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
  onChunk: (chunk: AnalysisChunk) => void
): Promise<AnalysisResult | {error: string}> {
  if (!transcript || transcript.trim().length === 0) {
    return {error: 'Transcript is empty. Please provide some text to analyze.'};
  }
  if (selectedAnalyses.length === 0) {
    return {error: 'No analysis types were selected.'};
  }

  try {
    const analysisPromises: Partial<Record<AnalysisType, Promise<any>>> = {};

    if (selectedAnalyses.includes('perspectives')) {
      analysisPromises.perspectives = analyzeConversationPerspectives(
        {transcript},
        chunk => onChunk({type: 'perspectives', data: chunk})
      );
    }
    if (selectedAnalyses.includes('actionItems')) {
      analysisPromises.actionItems = extractActionItems({transcript}, chunk =>
        onChunk({type: 'actionItems', data: chunk})
      );
    }
    if (selectedAnalyses.includes('openQuestions')) {
      analysisPromises.openQuestions = identifyOpenQuestions(
        {transcript},
        chunk => onChunk({type: 'openQuestions', data: chunk})
      );
    }
    if (selectedAnalyses.includes('summary')) {
      analysisPromises.summary = summarizeTranscript({transcript}, chunk =>
        onChunk({type: 'summary', data: chunk})
      );
    }
    if (selectedAnalyses.includes('timeline')) {
      analysisPromises.timeline = timelineOfKeyMoments({transcript}, chunk =>
        onChunk({type: 'timeline', data: chunk})
      );
    }
    if (selectedAnalyses.includes('risks')) {
      analysisPromises.risks = risksAndConcerns({transcript}, chunk =>
        onChunk({type: 'risks', data: chunk})
      );
    }
    if (selectedAnalyses.includes('opportunities')) {
      analysisPromises.opportunities = opportunitiesAndIdeas(
        {transcript},
        chunk => onChunk({type: 'opportunities', data: chunk})
      );
    }
    if (selectedAnalyses.includes('sentiment')) {
      analysisPromises.sentiment = toneAndSentiment({transcript}, chunk =>
        onChunk({type: 'sentiment', data: chunk})
      );
    }

    const settledResults = await Promise.allSettled(
      Object.values(analysisPromises)
    );

    settledResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        const key = Object.keys(analysisPromises)[
          index
        ] as keyof typeof analysisPromises;
        console.error(`Error in ${key} analysis:`, result.reason);
      }
    });

    const successfulResults = await Promise.all(
      Object.entries(analysisPromises).map(async ([key, promise]) => {
        const result = await promise;
        return [key, result];
      })
    );

    const analysisResult: AnalysisResult =
      Object.fromEntries(successfulResults);

    return analysisResult;
  } catch (e: any) {
    console.error('Error analyzing transcript:', e);
    return {
      error: `An unexpected error occurred while analyzing the transcript: ${e.message}`,
    };
  }
}
