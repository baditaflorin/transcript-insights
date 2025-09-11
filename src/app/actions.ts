'use server';

import {run} from '@/ai/flows/dynamic-analysis-flow';
import type {
  DynamicAnalysisInput
} from '@/ai/flows/dynamic-analysis-flow';
import {
  AnalysisType,
} from '@/ai/flows/prompts';
import type {
  AnalyzeConversationPerspectivesOutput,
  ExtractActionItemsOutput,
  IdentifyOpenQuestionsOutput,
  SummarizeTranscriptOutput,
  TimelineOfKeyMomentsOutput,
  RisksAndConcernsOutput,
  OpportunitiesAndIdeasOutput,
  ToneAndSentimentOutput,
  KeyDecisionsOutput,
  StakeholderMappingOutput,
  KnowledgeGapsOutput,
  CommunicationPatternsOutput,
} from '@/ai/flows/prompts';


export type {
  AnalyzeConversationPerspectivesOutput,
  ExtractActionItemsOutput,
  IdentifyOpenQuestionsOutput,
  SummarizeTranscriptOutput,
  TimelineOfKeyMomentsOutput,
  RisksAndConcernsOutput,
  OpportunitiesAndIdeasOutput,
  ToneAndSentimentOutput,
  KeyDecisionsOutput,
  StakeholderMappingOutput,
  KnowledgeGapsOutput,
  CommunicationPatternsOutput,
};

type ErrorResult = {error: string};

export type AnalysisResult = {
  summary?: SummarizeTranscriptOutput | ErrorResult;
  perspectives?: AnalyzeConversationPerspectivesOutput | ErrorResult;
  actionItems?: ExtractActionItemsOutput | ErrorResult;
  openQuestions?: IdentifyOpenQuestionsOutput | ErrorResult;
  timeline?: TimelineOfKeyMomentsOutput | ErrorResult;
  risks?: RisksAndConcernsOutput | ErrorResult;
  opportunities?: OpportunitiesAndIdeasOutput | ErrorResult;
  sentiment?: ToneAndSentimentOutput | ErrorResult;
  decisions?: KeyDecisionsOutput | ErrorResult;
  stakeholders?: StakeholderMappingOutput | ErrorResult;
  knowledgeGaps?: KnowledgeGapsOutput | ErrorResult;
  communicationPatterns?: CommunicationPatternsOutput | ErrorResult;
};

export async function analyzeTranscript(
  transcript: string,
  selectedAnalyses: (typeof AnalysisType)[keyof typeof AnalysisType][],
  provider: 'google' | 'openai',
  apiKey: string,
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
