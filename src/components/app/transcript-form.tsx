"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Upload, RotateCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { analyzeTranscript, type AnalysisResult } from '@/app/actions';
import { Card, CardContent } from '@/components/ui/card';
import { StreamingAnalysisResult, analysisTypes, AnalysisType } from '@/app/page';

const formSchema = z.object({
  transcript: z.string().optional(),
  file: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TranscriptFormProps {
  setResults: (results: AnalysisResult | null) => void;
  setStreamingResults: (results: StreamingAnalysisResult | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  setError: (error: string | null) => void;
  onReset: () => void;
  selectedAnalyses: AnalysisType[];
  setSelectedAnalyses: (analyses: AnalysisType[]) => void;
}

const analysisLabels: Record<AnalysisType, string> = {
    summary: 'Summary',
    perspectives: 'Perspectives',
    actionItems: 'Action Items',
    openQuestions: 'Open Questions',
    timeline: 'Timeline',
    risks: 'Risks & Concerns',
    opportunities: 'Opportunities',
    sentiment: 'Sentiment',
};


export default function TranscriptForm({ setResults, setIsLoading, isLoading, setError, setStreamingResults, onReset, selectedAnalyses, setSelectedAnalyses }: TranscriptFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('paste');
  const [fileName, setFileName] = useState('');
  const [analysisStarted, setAnalysisStarted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue('file', file);
    }
  };
  
  const resetForm = () => {
    form.reset();
    setFileName('');
    setAnalysisStarted(false);
    onReset();
  };
  
  const handleAnalysisToggle = (analysis: AnalysisType) => {
    const newSelection = selectedAnalyses.includes(analysis)
      ? selectedAnalyses.filter(item => item !== analysis)
      : [...selectedAnalyses, analysis];
    setSelectedAnalyses(newSelection);
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResults(null);
    setStreamingResults(null);
    setError(null);
    setAnalysisStarted(true);

    let transcriptText = '';

    if (activeTab === 'paste') {
      transcriptText = data.transcript || '';
    } else if (activeTab === 'upload' && data.file) {
      try {
        transcriptText = await data.file.text();
      } catch (error) {
        const errorMessage = 'Could not read the uploaded file. Please ensure it is a valid text file.';
        toast({
          variant: 'destructive',
          title: 'Error reading file',
          description: errorMessage,
        });
        setError(errorMessage);
        setIsLoading(false);
        setAnalysisStarted(false);
        return;
      }
    }

    if (!transcriptText.trim()) {
      const errorMessage = 'Please paste a transcript or upload a file.';
      toast({
        variant: 'destructive',
        title: 'Input required',
        description: errorMessage,
      });
      setError(errorMessage);
      setIsLoading(false);
      setAnalysisStarted(false);
      return;
    }
    
    if (selectedAnalyses.length === 0) {
      const errorMessage = 'Please select at least one analysis type.';
       toast({
        variant: 'destructive',
        title: 'Analysis Required',
        description: errorMessage,
      });
      setError(errorMessage);
      setIsLoading(false);
      setAnalysisStarted(false);
      return;
    }


    const result = await analyzeTranscript(transcriptText, selectedAnalyses, (chunk) => {
      setStreamingResults(prev => {
        const newResults: StreamingAnalysisResult = prev ? {...prev} : {
            perspectives: null,
            actionItems: null,
            openQuestions: null,
            summary: null,
            timeline: null,
            risks: null,
            opportunities: null,
            sentiment: null,
        };
        (newResults as any)[chunk.type] = chunk.data;
        return newResults;
      });
    });

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'An unexpected error occurred. See details below.',
      });
      setError(result.error);
      setResults(null);
    } else {
      setResults(result);
      setError(null);
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-0">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none rounded-t-lg h-12">
              <TabsTrigger value="paste" disabled={analysisStarted}>Paste Text</TabsTrigger>
              <TabsTrigger value="upload" disabled={analysisStarted}>Upload File</TabsTrigger>
            </TabsList>
            <div className="p-6">
              <TabsContent value="paste" className="m-0">
                <Textarea
                  placeholder="Paste your meeting or conversation transcript here..."
                  className="min-h-[200px] text-base"
                  {...form.register('transcript')}
                  readOnly={analysisStarted}
                />
              </TabsContent>
              <TabsContent value="upload" className="m-0">
                <div className="flex flex-col items-center justify-center w-full gap-4">
                  <Label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg bg-card ${analysisStarted ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-muted'}`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">TXT, MD or any text file</p>
                    </div>
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".txt,.md,text/plain" disabled={analysisStarted} />
                  </Label>
                  {fileName && <p className="text-sm text-muted-foreground">File: {fileName}</p>}
                </div>
              </TabsContent>

              <div className="mt-6 space-y-4">
                <h3 className="text-base font-semibold text-foreground/80">Select Analyses</h3>
                <div className="grid grid-cols-2 gap-4">
                  {analysisTypes.map((analysis) => (
                    <div key={analysis} className="flex items-center space-x-2">
                       <Checkbox
                        id={analysis}
                        checked={selectedAnalyses.includes(analysis)}
                        onCheckedChange={() => handleAnalysisToggle(analysis)}
                        disabled={analysisStarted}
                      />
                      <label
                        htmlFor={analysis}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {analysisLabels[analysis]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>


              {analysisStarted ? (
                 <Button type="button" onClick={resetForm} className="w-full mt-6 h-12 text-base font-semibold" variant="outline">
                  <RotateCw className="mr-2 h-5 w-5" />
                  Start Over
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading} className="w-full mt-6 h-12 text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Transcript'
                  )}
                </Button>
              )}
            </div>
          </Tabs>
        </form>
      </CardContent>
    </Card>
  );
}
