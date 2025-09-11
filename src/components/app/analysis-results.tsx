"use client";

import { CheckSquare, Download, MessageCircleQuestion, Users, AlertTriangle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { AnalysisResult } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { StreamingAnalysisResult } from '@/app/page';
import Markdown from 'react-markdown';

interface AnalysisResultsProps {
  results: AnalysisResult | null;
  streamingResults: StreamingAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const downloadFile = (content: string, filename: string) => {
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

const ResultCard = ({ title, description, icon: Icon, content, filename, isLoading }: { title: string, description: string, icon: React.ElementType, content: string, filename: string, isLoading: boolean }) => (
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
      {isLoading && !content ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <div className="prose prose-sm max-w-none text-foreground/90 bg-muted/50 p-4 rounded-lg min-h-[100px]">
          {content ? <Markdown>{content}</Markdown> : 'No content generated.'}
        </div>
      )}
    </CardContent>
  </Card>
);

export default function AnalysisResults({ results, streamingResults, isLoading, error }: AnalysisResultsProps) {
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

  const displayResults = results || streamingResults;
  const showPlaceholder = !displayResults && !isLoading;

  if (showPlaceholder) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] border-2 border-dashed rounded-lg bg-card">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Your insights are waiting</p>
          <p className="text-sm">Submit a transcript to begin the analysis.</p>
        </div>
      </div>
    );
  }

  const actionItemsContent = displayResults?.actionItems ? formatActionItems(displayResults.actionItems.actionItems) : '';
  const perspectivesContent = displayResults?.perspectives?.analysis || '';
  const openQuestionsContent = displayResults?.openQuestions?.openQuestions || '';
  const summaryContent = displayResults?.summary?.summary || '';

  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-12">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="perspectives">Perspectives</TabsTrigger>
        <TabsTrigger value="actions">Action Items</TabsTrigger>
        <TabsTrigger value="questions">Open Questions</TabsTrigger>
      </TabsList>
      <div className="mt-4">
        <TabsContent value="summary" className="m-0">
          <ResultCard
            title="Summary"
            description="A concise overview of the conversation."
            icon={FileText}
            content={summaryContent}
            filename="summary.md"
            isLoading={isLoading && !summaryContent}
          />
        </TabsContent>
        <TabsContent value="perspectives" className="m-0">
          <ResultCard
            title="Conversation Perspectives"
            description="Each speaker's point of view, goals, and contributions."
            icon={Users}
            content={perspectivesContent}
            filename="conversation_perspectives.md"
            isLoading={isLoading && !perspectivesContent}
          />
        </TabsContent>
        <TabsContent value="actions" className="m-0">
          <ResultCard
            title="Action Checklist"
            description="A checklist of tasks assigned to each speaker."
            icon={CheckSquare}
            content={actionItemsContent}
            filename="action_checklist.md"
            isLoading={isLoading && !actionItemsContent}
          />
        </TabsContent>
        <TabsContent value="questions" className="m-0">
          <ResultCard
            title="Open Questions"
            description="Unanswered questions and topics for follow-up."
            icon={MessageCircleQuestion}
            content={openQuestionsContent}
            filename="followups.md"
            isLoading={isLoading && !openQuestionsContent}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
