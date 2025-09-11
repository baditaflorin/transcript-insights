"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Upload, KeyRound, BrainCircuit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { analyzeTranscript, type AnalysisResult } from '@/app/actions';
import { Card, CardContent } from '@/components/ui/card';
import { analysisTypes } from '@/app/page';
import type { AnalysisType } from '@/ai/flows/prompts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useState } from 'react';

const formSchema = z.object({
  transcript: z.string().optional(),
  file: z.any().optional(),
  apiKey: z.string(),
  provider: z.enum(['google', 'openai']).default('google'),
});

type FormValues = z.infer<typeof formSchema>;

interface TranscriptFormProps {
  setResults: (results: AnalysisResult | null) => void;
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
    decisions: 'Key Decisions',
    stakeholders: 'Stakeholder Map',
    knowledgeGaps: 'Knowledge Gaps',
    communicationPatterns: 'Comm. Patterns',
};


export default function TranscriptForm({ setResults, setIsLoading, isLoading, setError, onReset, selectedAnalyses, setSelectedAnalyses }: TranscriptFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('paste');
  const [fileName, setFileName] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: 'google',
    }
  });

  const provider = form.watch('provider');
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue('file', file);
    }
  };
  
  const handleAnalysisToggle = (analysis: AnalysisType) => {
    const newSelection = selectedAnalyses.includes(analysis)
      ? selectedAnalyses.filter(item => item !== analysis)
      : [...selectedAnalyses, analysis];
    setSelectedAnalyses(newSelection);
  };

  const onSubmit = async (data: FormValues) => {
    onReset();
    setIsLoading(true);

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
      return;
    }
    
    if (!data.apiKey) {
      const errorMessage = `Please enter your ${provider === 'google' ? 'Google AI' : 'OpenAI'} API key.`;
      toast({
        variant: 'destructive',
        title: 'API Key Required',
        description: errorMessage,
      });
      setError(errorMessage);
      setIsLoading(false);
      return;
    }


    const result = await analyzeTranscript(transcriptText, selectedAnalyses, data.provider, data.apiKey);

    if (result && 'error' in result) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'An unexpected error occurred. See details below.',
      });
      setError(result.error);
      setResults(null);
    } else {
      setResults(result as AnalysisResult);
      setError(null);
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-0">
        <form onSubmit={form.handleSubmit(onSubmit)}>
           <div className="p-6 space-y-4 border-b">
              <h3 className="text-base font-semibold text-foreground/80">AI Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">
                    <BrainCircuit className="inline-block mr-2 h-4 w-4" />
                    AI Provider
                  </Label>
                  <Select
                    value={form.watch('provider')}
                    onValueChange={(value) => form.setValue('provider', value as 'google' | 'openai')}
                  >
                    <SelectTrigger id="provider">
                      <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google AI</SelectItem>
                      <SelectItem value="openai">OpenAI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                   <Label htmlFor="apiKey">
                    <KeyRound className="inline-block mr-2 h-4 w-4" />
                     API Key (Required)
                   </Label>
                   <Input
                     id="apiKey"
                     type="password"
                     placeholder={provider === 'google' ? "Enter your Google AI API Key" : "Enter your OpenAI API Key"}
                     {...form.register('apiKey')}
                   />
                 </div>
              </div>
           </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none h-12">
              <TabsTrigger value="paste" >Paste Text</TabsTrigger>
              <TabsTrigger value="upload" >Upload File</TabsTrigger>
            </TabsList>
            <div className="p-6">
              <TabsContent value="paste" className="m-0">
                <Textarea
                  placeholder="Paste your meeting or conversation transcript here..."
                  className="min-h-[200px] text-base"
                  {...form.register('transcript')}
                />
              </TabsContent>
              <TabsContent value="upload" className="m-0">
                <div className="flex flex-col items-center justify-center w-full gap-4">
                  <Label
                    htmlFor="file-upload"
                    className={'flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg bg-card cursor-pointer hover:bg-muted'}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">TXT, MD or any text file</p>
                    </div>
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".txt,.md,text/plain" />
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
                      />
                      <label
                        htmlFor={analysis}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {analysisLabels[analysis as AnalysisType]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

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
            </div>
          </Tabs>
        </form>
      </CardContent>
    </Card>
  );
}
