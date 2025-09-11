"use client";

import { useState }from 'react';
import Header from '@/components/app/header';
import TranscriptForm from '@/components/app/transcript-form';
import AnalysisResults from '@/components/app/analysis-results';
import {
  AnalysisResult,
  AnalyzeConversationPerspectivesOutput,
  ExtractActionItemsOutput,
  IdentifyOpenQuestionsOutput,
  SummarizeTranscriptOutput,
  TimelineOfKeyMomentsOutput,
  RisksAndConcernsOutput,
  OpportunitiesAndIdeasOutput,
  ToneAndSentimentOutput,
} from './actions';
import { AnalysisType } from '@/ai/flows/prompts';


export type { AnalysisType };
export const analysisTypes = Object.values(AnalysisType);

type ErrorResult = {error: string};

export type StreamingAnalysisResult = {
  perspectives: AnalyzeConversationPerspectivesOutput | ErrorResult | null;
  actionItems: ExtractActionItemsOutput | ErrorResult | null;
  openQuestions: IdentifyOpenQuestionsOutput | ErrorResult | null;
  summary: SummarizeTranscriptOutput | ErrorResult | null;
  timeline: TimelineOfKeyMomentsOutput | ErrorResult | null;
  risks: RisksAndConcernsOutput | ErrorResult | null;
  opportunities: OpportunitiesAndIdeasOutput | ErrorResult | null;
  sentiment: ToneAndSentimentOutput | ErrorResult | null;
};

export default function Home() {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [streamingResults, setStreamingResults] = useState<StreamingAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnalyses, setSelectedAnalyses] = useState<(typeof analysisTypes)[number][]>(['summary', 'perspectives', 'actionItems', 'openQuestions']);

  const handleReset = () => {
    setResults(null);
    setStreamingResults(null);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground/90">Input Transcript</h2>
            <TranscriptForm
              setResults={setResults}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              setError={setError}
              setStreamingResults={setStreamingResults}
              onReset={handleReset}
              selectedAnalyses={selectedAnalyses}
              setSelectedAnalyses={setSelectedAnalyses}
            />
          </div>
          <div className="flex flex-col gap-6">
             <h2 className="text-2xl font-semibold tracking-tight text-foreground/90">Analysis Output</h2>
            <AnalysisResults
              results={results}
              streamingResults={streamingResults}
              isLoading={isLoading}
              error={error}
              selectedAnalyses={selectedAnalyses}
            />
          </div>
        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by an expert AI engineer.
          </p>
        </div>
      </footer>
    </div>
  );
}
