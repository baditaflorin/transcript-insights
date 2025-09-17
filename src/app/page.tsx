"use client";

import { useState }from 'react';
import Header from '@/components/app/header';
import TranscriptForm from '@/components/app/transcript-form';
import AnalysisResults from '@/components/app/analysis-results';
import {
  AnalysisResult,
  analyzeTranscript,
} from './actions';
import { AnalysisType } from '@/ai/flows/prompts';


export const analysisTypes = Object.values(AnalysisType);

export default function Home() {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnalyses, setSelectedAnalyses] = useState<(typeof analysisTypes)[number][]>(['summary', 'perspectives', 'actionItems', 'openQuestions', 'timeline', 'risks', 'opportunities', 'sentiment', 'decisions', 'stakeholders', 'knowledgeGaps', 'communicationPatterns']);
  const [transcript, setTranscript] = useState('');
  const [provider, setProvider] = useState<'google' | 'openai'>('google');
  const [apiKey, setApiKey] = useState('');


  const handleReset = () => {
    setResults(null);
    setError(null);
  };
  
  const handleAnalyze = async (formData: {
    transcript: string;
    provider: 'google' | 'openai';
    apiKey: string;
    selectedAnalyses: AnalysisType[];
  }) => {
    handleReset();
    setIsLoading(true);
    setTranscript(formData.transcript);
    setProvider(formData.provider);
    setApiKey(formData.apiKey);

    const result = await analyzeTranscript(
      formData.transcript,
      formData.selectedAnalyses,
      formData.provider,
      formData.apiKey
    );

    if (result && 'error' in result) {
      setError(result.error);
      setResults(null);
    } else {
      setResults(result as AnalysisResult);
      setError(null);
    }

    setIsLoading(false);
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-12">
        <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">Unlock the Power of Your Conversations</h1>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              Paste or upload a conversation transcript, select the analyses you want to run, and let AI provide you with a comprehensive breakdown. Extract summaries, action items, different perspectives, and more to unlock the full value of your conversations.
            </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground/90">Input Transcript</h2>
            <TranscriptForm
              isLoading={isLoading}
              onAnalyze={handleAnalyze}
              selectedAnalyses={selectedAnalyses}
              setSelectedAnalyses={setSelectedAnalyses}
            />
          </div>
          <AnalysisResults
            results={results}
            isLoading={isLoading}
            error={error}
            selectedAnalyses={selectedAnalyses}
            transcript={transcript}
            provider={provider}
            apiKey={apiKey}
          />
        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            Built by{' '}
            <a
              href="https://linkedin.com/in/baditaflorin"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Florin Badita
            </a>
            {' '}and{' '}
            <a
              href="https://scrapetheworld.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              scrapetheworld.org
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
