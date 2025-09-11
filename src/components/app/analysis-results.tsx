"use client";

import { CheckSquare, Download, MessageCircleQuestion, Users, AlertTriangle, FileText, Clock, ShieldAlert, Zap, Smile } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { AnalysisResult } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { AnalysisType } from '@/ai/flows/prompts';
import Markdown from 'react-markdown';
import { useMemo } from 'react';

interface AnalysisResultsProps {
  results: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  selectedAnalyses: AnalysisType[];
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

const formatActionItems = (actionItems: { speaker: string; task: string }[]): string => {
  if (!actionItems || actionItems.length === 0) return '';
  const groupedBySpeaker = actionItems.reduce((acc, item) => {
    if (!acc[item.speaker]) {
      acc[item.speaker] = [];
    }
    acc[item.speaker].push(`- [ ] ${item.task}`);
    return acc;
  }, {} as Record<string, string[]>);

  return Object.entries(groupedBySpeaker)
    .map(([speaker, tasks]) => `### ${speaker}\n\n${tasks.join('\n')}`)
    .join('\n\n');
};

const ResultCard = ({ title, description, icon: Icon, content, filename, isLoading, error }: { title: string, description: string, icon: React.ElementType, content: string | null, filename: string, isLoading: boolean, error: string | null }) => (
  <Card className="h-full shadow-md">
    <CardHeader>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Icon className="h-7 w-7 text-primary mt-1" />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        {!isLoading && content && (
          <Button variant="outline" size="icon" onClick={() => downloadFile(content, filename)} className="flex-shrink-0">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        )}
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>
                <pre className="mt-2 whitespace-pre-wrap font-code text-xs">
                  {error}
                </pre>
              </AlertDescription>
            </Alert>
          )}
          <div className="prose prose-sm max-w-none text-foreground/90 bg-muted/50 p-4 rounded-lg min-h-[100px]">
            {content ? <Markdown>{content}</Markdown> : <p>No content generated. This might be because the analysis was not selected, an error occurred, or the transcript did not contain relevant information for this category.</p>}
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

const analysisConfig: Record<AnalysisType, { title: string; description: string; icon: React.ElementType; filename: string; contentKey: keyof AnalysisResult, dataKey: (res: AnalysisResult) => string | undefined, errorKey: (res: AnalysisResult) => string | undefined }> = {
    summary: { title: "Summary", description: "A concise overview of the conversation.", icon: FileText, filename: "summary.md", contentKey: 'summary', dataKey: (res) => (res.summary && 'summary' in res.summary) ? res.summary.summary : undefined, errorKey: (res) => (res.summary && 'error' in res.summary) ? res.summary.error : undefined },
    perspectives: { title: "Conversation Perspectives", description: "Each speaker's point of view, goals, and contributions.", icon: Users, filename: "perspectives.md", contentKey: 'perspectives', dataKey: (res) => (res.perspectives && 'analysis' in res.perspectives) ? res.perspectives.analysis : undefined, errorKey: (res) => (res.perspectives && 'error' in res.perspectives) ? res.perspectives.error : undefined },
    actionItems: { title: "Action Checklist", description: "A checklist of tasks assigned to each speaker.", icon: CheckSquare, filename: "action_checklist.md", contentKey: 'actionItems', dataKey: (res) => (res.actionItems && 'actionItems' in res.actionItems && res.actionItems.actionItems) ? formatActionItems(res.actionItems.actionItems) : undefined, errorKey: (res) => (res.actionItems && 'error' in res.actionItems) ? res.actionItems.error : undefined },
    openQuestions: { title: "Open Questions", description: "Unanswered questions and topics for follow-up.", icon: MessageCircleQuestion, filename: "followups.md", contentKey: 'openQuestions', dataKey: (res) => (res.openQuestions && 'openQuestions' in res.openQuestions) ? res.openQuestions.openQuestions : undefined, errorKey: (res) => (res.openQuestions && 'error' in res.openQuestions) ? res.openQuestions.error : undefined },
    timeline: { title: "Timeline of Key Moments", description: "Chronological points and decisions from the transcript.", icon: Clock, filename: "timeline.md", contentKey: 'timeline', dataKey: (res) => (res.timeline && 'timeline' in res.timeline) ? res.timeline.timeline : undefined, errorKey: (res) => (res.timeline && 'error' in res.timeline) ? res.timeline.error : undefined },
    risks: { title: "Risks & Concerns", description: "Identified risks, concerns, or objections.", icon: ShieldAlert, filename: "risks_concerns.md", contentKey: 'risks', dataKey: (res) => (res.risks && 'risksAndConcerns' in res.risks) ? res.risks.risksAndConcerns : undefined, errorKey: (res) => (res.risks && 'error' in res.risks) ? res.risks.error : undefined },
    opportunities: { title: "Opportunities & Ideas", description: "Opportunities, ideas, or suggestions raised.", icon: Zap, filename: "opportunities.md", contentKey: 'opportunities', dataKey: (res) => (res.opportunities && 'opportunitiesAndIdeas' in res.opportunities) ? res.opportunities.opportunitiesAndIdeas : undefined, errorKey: (res) => (res.opportunities && 'error' in res.opportunities) ? res.opportunities.error : undefined },
    sentiment: { title: "Tone & Sentiment", description: "Analysis of the conversation's tone and sentiment.", icon: Smile, filename: "sentiment.md", contentKey: 'sentiment', dataKey: (res) => (res.sentiment && 'sentiment' in res.sentiment) ? res.sentiment.sentiment : undefined, errorKey: (res) => (res.sentiment && 'error' in res.sentiment) ? res.sentiment.error : undefined },
};

export default function AnalysisResults({ results, isLoading, error, selectedAnalyses }: AnalysisResultsProps) {
  if (error) {
    return (
        <Alert variant="destructive" className="shadow-md">
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
    return (Object.keys(analysisConfig) as AnalysisType[]).filter(key => selectedAnalyses.includes(key));
  }, [selectedAnalyses]);
  
  if (showPlaceholder) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] border-2 border-dashed rounded-lg bg-card">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Your insights are waiting</p>
          <p className="text-sm">Submit a transcript and select analyses to begin.</p>
        </div>
      </div>
    );
  }
  
  const defaultTab = visibleTabs.length > 0 ? visibleTabs[0] : '';
  
  if (visibleTabs.length === 0 && isLoading) {
     return (
      <div className="flex items-center justify-center h-full min-h-[400px] border-2 border-dashed rounded-lg bg-card">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Analyzing...</p>
        </div>
      </div>
    );
  }

  if (visibleTabs.length === 0 && !isLoading && !error) {
     return (
      <div className="flex items-center justify-center h-full min-h-[400px] border-2 border-dashed rounded-lg bg-card">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">No analysis selected</p>
          <p className="text-sm">Please select at least one analysis type to begin.</p>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-auto flex-wrap justify-start">
        {visibleTabs.map(type => (
          <TabsTrigger key={type} value={type} className="capitalize">{analysisConfig[type].title.split(' ')[0]}</TabsTrigger>
        ))}
      </TabsList>
      <div className="mt-4">
        {visibleTabs.map(type => {
            const config = analysisConfig[type];
            const resultData = results ? results[config.contentKey] : null;
            const content = results ? config.dataKey(results as AnalysisResult) : null;
            const tabError = results ? config.errorKey(results as AnalysisResult) : null;
            const isTabLoading = isLoading && !resultData;
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
                    />
                </TabsContent>
            );
        })}
      </div>
    </Tabs>
  );
}
