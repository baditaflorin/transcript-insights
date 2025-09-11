"use client";

import { useState } from 'react';
import Header from '@/components/app/header';
import TranscriptForm from '@/components/app/transcript-form';
import AnalysisResults from '@/components/app/analysis-results';
import type { AnalysisResult } from '@/app/actions';

export default function Home() {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground/90">Input Transcript</h2>
            <TranscriptForm setResults={setResults} setIsLoading={setIsLoading} isLoading={isLoading} />
          </div>
          <div className="flex flex-col gap-6">
             <h2 className="text-2xl font-semibold tracking-tight text-foreground/90">Analysis Output</h2>
            <AnalysisResults results={results} isLoading={isLoading} />
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
