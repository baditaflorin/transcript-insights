"use client";

import { Download, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Markdown from 'react-markdown';


interface ResultCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    content: string | null;
    filename: string;
    isLoading: boolean;
    error: string | null;
    onDownload: (content: string, filename: string) => void;
}

export const ResultCard = ({ title, description, icon: Icon, content, filename, isLoading, error, onDownload }: ResultCardProps) => (
  <Card className="h-full shadow-lg">
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
          <Button variant="outline" size="icon" onClick={() => onDownload(content, filename)} className="flex-shrink-0">
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
