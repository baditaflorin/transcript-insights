"use client";

import { CheckSquare, Download, MessageCircleQuestion, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { AnalysisResult } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AnalysisResultsProps {
  results: AnalysisResult | null;
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

const formatActionItems = (actionItems: Record<string, string>): string => {
  return Object.entries(actionItems)
    .map(([speaker, tasks]) => `## ${speaker}\n\n${tasks.replace(/- /g, '* ')}`)
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
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : (
        <pre className="whitespace-pre-wrap font-body text-sm text-foreground/90 bg-muted/50 p-4 rounded-lg min-h-[100px]">
          {content || 'No content generated.'}
        </pre>
      )}
    </CardContent>
  </Card>
);

export default function AnalysisResults({ results, isLoading, error }: AnalysisResultsProps) {
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

  if (!results && !isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] border-2 border-dashed rounded-lg bg-card">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Your insights are waiting</p>
          <p className="text-sm">Submit a transcript to begin the analysis.</p>
        </div>
      </div>
    );
  }

  const actionItemsContent = results?.actionItems ? formatActionItems(results.actionItems.actionItems) : '';

  return (
    <Tabs defaultValue="perspectives" className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-12">
        <TabsTrigger value="perspectives">Perspectives</TabsTrigger>
        <TabsTrigger value="actions">Action Items</TabsTrigger>
        <TabsTrigger value="questions">Open Questions</TabsTrigger>
      </TabsList>
      <div className="mt-4">
        <TabsContent value="perspectives" className="m-0">
          <ResultCard
            title="Conversation Perspectives"
            description="Each speaker's point of view, goals, and contributions."
            icon={Users}
            content={results?.perspectives.analysis || ''}
            filename="conversation_perspectives.txt"
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="actions" className="m-0">
          <ResultCard
            title="Action Checklist"
            description="A checklist of tasks assigned to each speaker."
            icon={CheckSquare}
            content={actionItemsContent}
            filename="action_checklist.txt"
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="questions" className="m-0">
          <ResultCard
            title="Open Questions"
            description="Unanswered questions and topics for follow-up."
            icon={MessageCircleQuestion}
            content={results?.openQuestions.openQuestions || ''}
            filename="followups.txt"
            isLoading={isLoading}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
