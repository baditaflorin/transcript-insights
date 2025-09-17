"use client";

import { AlertTriangle, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AnalysisResult, generateFilename } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnalysisType } from '@/ai/flows/prompts';
import { useMemo } from 'react';
import { analysisConfig } from '@/lib/analysis-config';
import { ResultCard } from './result-card';

interface AnalysisResultsProps {
  results: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  selectedAnalyses: (typeof AnalysisType)[keyof typeof AnalysisType][];
  transcript: string;
  provider: 'google' | 'openai';
  apiKey: string;
}

const downloadFile = (content: string, filename: string) => {
  if (!content) return;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


export default function AnalysisResults({ results, isLoading, error, selectedAnalyses, transcript, provider, apiKey }: AnalysisResultsProps) {
  if (error) {
    return (
        <Alert variant="destructive" className="shadow-lg">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Analysis Error</AlertTitle>
            <AlertDescription>
                <p>An unexpected error occurred. You can copy the details below for debugging.</p>
                <pre className="mt-4 whitespace-pre-wrap font-code text-xs bg-destructive/20 p-4 rounded-lg">
                    {error}
                </pre>
            </AlertDescription>
        </Alert>
    );
  }

  const showPlaceholder = !results && !isLoading;

  const visibleTabs = useMemo(() => {
    return (Object.keys(analysisConfig) as (typeof AnalysisType)[keyof typeof AnalysisType][]).filter(key => selectedAnalyses.includes(key));
  }, [selectedAnalyses]);

  const handleDownloadAll = async () => {
    if (!results) return;

    const allContent = visibleTabs.map(type => {
      const config = analysisConfig[type];
      const content = config.dataKey(results);
      if (content) {
        return `## ${config.title}\n\n${content}`;
      }
      return null;
    }).filter(Boolean).join('\n\n---\n\n');

    if (allContent) {
      const filenameResult = await generateFilename(transcript, provider, apiKey);
      const filename = 'error' in filenameResult ? 'analysis-bundle.md' : filenameResult.filename;
      downloadFile(allContent, filename);
    }
  };

  if (showPlaceholder) {
    return (
      <div className="flex flex-col gap-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground/90">Analysis Output</h2>
        <div className="flex items-center justify-center h-full min-h-[400px] border-2 border-dashed rounded-lg bg-card shadow-lg">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">Your insights are waiting</p>
            <p className="text-sm">Submit a transcript and select analyses to begin.</p>
          </div>
        </div>
      </div>
    );
  }

  const defaultTab = visibleTabs.length > 0 ? visibleTabs[0] : '';
  
  if (visibleTabs.length === 0 && (isLoading || !error)) {
     return (
        <div className="flex flex-col gap-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground/90">Analysis Output</h2>
          <div className="flex items-center justify-center h-full min-h-[400px] border-2 border-dashed rounded-lg bg-card shadow-lg">
            <div className="text-center text-muted-foreground">
              {isLoading ? (
                <p className="text-lg font-medium">Analyzing...</p>
              ) : (
                <>
                  <p className="text-lg font-medium">No analysis selected</p>
                  <p className="text-sm">Please select at least one analysis type to begin.</p>
                </>
              )}
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground/90">Analysis Output</h2>
        {results && !isLoading && (
          <Button variant="outline" onClick={handleDownloadAll}>
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        )}
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto flex-wrap justify-start">
          {visibleTabs.map(type => (
            <TabsTrigger key={type} value={type} className="capitalize">{analysisConfig[type].title.replace(/ & | /g, ' ').split(' ')[0]}</TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-4">
          {visibleTabs.map(type => {
              const config = analysisConfig[type];
              const isTabLoading = isLoading && (!results || !results[config.contentKey]);
              const content = results ? config.dataKey(results) : null;
              const tabError = results ? config.errorKey(results) : null;
              
              return (
                  <TabsContent key={type} value={type} className="m-0">
                      <ResultCard
                          title={config.title}
                          description={config.description}
                          icon={config.icon}
                          content={content || null}
                          filename={config.filename}
                          isLoading={isTabLoading}
                          error={tabError || null}
                          onDownload={downloadFile}
                      />
                  </TabsContent>
              );
          })}
        </div>
      </Tabs>
    </div>
  );
}
