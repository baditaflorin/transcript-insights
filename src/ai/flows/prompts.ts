/**
 * @fileOverview This file contains all the prompt definitions for the various transcript analyses.
 * By centralizing them, they can be easily used by the dynamic analysis flow.
 */
import type { Genkit } from 'genkit';
import {z} from 'zod';

// Enum for Analysis Types
export const AnalysisType = {
  SUMMARY: 'summary',
  PERSPECTIVES: 'perspectives',
  ACTION_ITEMS: 'actionItems',
  OPEN_QUESTIONS: 'openQuestions',
  TIMELINE: 'timeline',
  RISKS: 'risks',
  OPPORTUNITIES: 'opportunities',
  SENTIMENT: 'sentiment',
  DECISIONS: 'decisions',
  STAKEHOLDERS: 'stakeholders',
  KNOWLEDGE_GAPS: 'knowledgeGaps',
  COMMUNICATION_PATTERNS: 'communicationPatterns',
} as const;

export type AnalysisType = (typeof AnalysisType)[keyof typeof AnalysisType];


// Schemas for Inputs
const TranscriptInputSchema = z.object({
  transcript: z.string(),
});

// Schemas for Outputs
export const SummarizeTranscriptOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the conversation. Format the output as Markdown.'
    ),
});
export type SummarizeTranscriptOutput = z.infer<typeof SummarizeTranscriptOutputSchema>;

export const AnalyzeConversationPerspectivesOutputSchema = z.object({
  analysis: z
    .string()
    .describe(
      'An explanation of the conversation from each speaker’s point of view, identifying their goals and contributions. Format the output as Markdown.'
    ),
});
export type AnalyzeConversationPerspectivesOutput = z.infer<typeof AnalyzeConversationPerspectivesOutputSchema>;

const ActionItemSchema = z.object({
  speaker: z.string().describe('The speaker assigned the action item.'),
  task: z.string().describe('The specific action item or task.'),
});

export const ExtractActionItemsOutputSchema = z.object({
  actionItems: z
    .array(ActionItemSchema)
    .describe('A list of action items for each speaker.'),
});
export type ExtractActionItemsOutput = z.infer<typeof ExtractActionItemsOutputSchema>;


export const IdentifyOpenQuestionsOutputSchema = z.object({
  openQuestions: z
    .string()
    .describe(
      'A list of unanswered questions, unclear points, or topics that require follow-up from this conversation, phrased as clear questions or reminders that can be used in the next meeting. Format the output as Markdown.'
    ),
});
export type IdentifyOpenQuestionsOutput = z.infer<typeof IdentifyOpenQuestionsOutputSchema>;

export const TimelineOfKeyMomentsOutputSchema = z.object({
  timeline: z
    .string()
    .describe(
      'A chronological timeline of the main discussion points and decisions from the transcript. Include timestamps if available. Use concise bullet points with who said what. Format as Markdown.'
    ),
});
export type TimelineOfKeyMomentsOutput = z.infer<typeof TimelineOfKeyMomentsOutputSchema>;

export const RisksAndConcernsOutputSchema = z.object({
  risksAndConcerns: z
    .string()
    .describe(
      'A list of any risks, concerns, or objections raised explicitly or implicitly. For each, explain which speaker raised it and why it matters. Format as Markdown.'
    ),
});
export type RisksAndConcernsOutput = z.infer<typeof RisksAndConcernsOutputSchema>;

export const OpportunitiesAndIdeasOutputSchema = z.object({
  opportunitiesAndIdeas: z
    .string()
    .describe(
      'A list of all opportunities, ideas, or suggestions that came up in the conversation. Highlight which person suggested each idea and any next steps attached to it. Format as Markdown.'
    ),
});
export type OpportunitiesAndIdeasOutput = z.infer<typeof OpportunitiesAndIdeasOutputSchema>;

export const ToneAndSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'An analysis of the overall tone and sentiment of the conversation. Describe how each speaker felt during the conversation (positive, neutral, concerned, skeptical, enthusiastic, etc.) and support with evidence from their words. Format as Markdown.'
    ),
});
export type ToneAndSentimentOutput = z.infer<typeof ToneAndSentimentOutputSchema>;

export const KeyDecisionsOutputSchema = z.object({
  decisions: z
    .string()
    .describe(
      'A list of specific decisions made, commitments given, and agreed-upon next steps with ownership. Format as Markdown.'
    ),
});
export type KeyDecisionsOutput = z.infer<typeof KeyDecisionsOutputSchema>;

export const StakeholderMappingOutputSchema = z.object({
  stakeholders: z
    .string()
    .describe(
      'A map of all people, teams, or organizations mentioned, their roles, influence, and relationships. Format as Markdown.'
    ),
});
export type StakeholderMappingOutput = z.infer<typeof StakeholderMappingOutputSchema>;

export const KnowledgeGapsOutputSchema = z.object({
  knowledgeGaps: z
    .string()
    .describe(
      'A list of acknowledged uncertainties, assumptions made, or missing information. Format as Markdown.'
    ),
});
export type KnowledgeGapsOutput = z.infer<typeof KnowledgeGapsOutputSchema>;

export const CommunicationPatternsOutputSchema = z.object({
  communicationPatterns: z
    .string()
    .describe(
      'An analysis of speaking time, interruption patterns, and agreement/disagreement frequencies. Format as Markdown.'
    ),
});
export type CommunicationPatternsOutput = z.infer<typeof CommunicationPatternsOutputSchema>;


// Prompt Definitions
export const defineSummaryPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'summarizeTranscriptPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: SummarizeTranscriptOutputSchema},
  prompt: `Summarize the following conversation. Format your response as Markdown.\n\nTranscript:\n{{transcript}}`,
});

export const definePerspectivesPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'analyzeConversationPerspectivesPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: AnalyzeConversationPerspectivesOutputSchema},
  prompt: `Explain the conversation from both speakers’ point of view. Focus on what each person wanted, asked, and contributed. Format your response as Markdown.\n\nTranscript:\n{{transcript}}`,
});

export const defineActionItemsPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'extractActionItemsPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: ExtractActionItemsOutputSchema},
  prompt: `Create a checklist of action items for each speaker based on the transcript. Make it specific, task-oriented, and assign clearly who is responsible. If no tasks exist for a person, you can omit them from the output.\n\nTranscript:\n{{transcript}}`,
});

export const defineOpenQuestionsPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'identifyOpenQuestionsPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: IdentifyOpenQuestionsOutputSchema},
  prompt: `Identify any unanswered questions, unclear points, or topics that require follow-up from this conversation. Phrase them as clear questions or reminders that can be used in the next meeting. Format your response as Markdown.\n\nTranscript:\n{{transcript}}`,
});

export const defineTimelinePrompt = (ai: Genkit) => ai.definePrompt({
  name: 'timelineOfKeyMomentsPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: TimelineOfKeyMomentsOutputSchema},
  prompt: `Create a chronological timeline of the main discussion points and decisions from the transcript. Include timestamps if available. Use concise bullet points with who said what. Format your response as Markdown.\n\nTranscript:\n{{transcript}}`,
});

export const defineRisksPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'risksAndConcernsPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: RisksAndConcernsOutputSchema},
  prompt: `From the transcript, identify any risks, concerns, or objections raised explicitly or implicitly. For each, explain which speaker raised it and why it matters. Format your response as Markdown.\n\nTranscript:\n{{transcript}}`,
});

export const defineOpportunitiesPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'opportunitiesAndIdeasPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: OpportunitiesAndIdeasOutputSchema},
  prompt: `List all opportunities, ideas, or suggestions that came up in the conversation. Highlight which person suggested each idea and any next steps attached to it. Format your response as Markdown.\n\nTranscript:\n{{transcript}}`,
});

export const defineSentimentPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'toneAndSentimentPrompt',
  input: {schema: TranscriptInputSchema},
  output: {schema: ToneAndSentimentOutputSchema},
  prompt: `Analyze the overall tone and sentiment of the conversation. Describe how each speaker felt during the conversation (positive, neutral, concerned, skeptical, enthusiastic, etc.) and support with evidence from their words. Format your response as Markdown.\n\nTranscript:\n{{transcript}}`,
});

export const defineDecisionsPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'keyDecisionsPrompt',
  input: { schema: TranscriptInputSchema },
  output: { schema: KeyDecisionsOutputSchema },
  prompt: `Extract specific decisions made, commitments given by participants, and any agreed-upon next steps with ownership from the transcript. This differs from action items by focusing on binding agreements and strategic choices. Format as Markdown.\n\nTranscript:\n{{transcript}}`,
});

export const defineStakeholdersPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'stakeholderMappingPrompt',
  input: { schema: TranscriptInputSchema },
  output: { schema: StakeholderMappingOutputSchema },
  prompt: `Identify all people, teams, or organizations mentioned in the call, their roles, influence levels, and relationships to the discussed topics. This helps understand the broader ecosystem and potential impact areas. Format as Markdown.\n\nTranscript:\n{{transcript}}`,
});

export const defineKnowledgeGapsPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'knowledgeGapsPrompt',
  input: { schema: TranscriptInputSchema },
  output: { schema: KnowledgeGapsOutputSchema },
  prompt: `Highlight areas from the transcript where participants acknowledged uncertainty, made assumptions, or identified missing information that could affect outcomes. This is distinct from open questions by focusing on what's unknown or unverified. Format as Markdown.\n\nTranscript:\n{{transcript}}`,
});

export const defineCommunicationPatternsPrompt = (ai: Genkit) => ai.definePrompt({
  name: 'communicationPatternsPrompt',
  input: { schema: TranscriptInputSchema },
  output: { schema: CommunicationPatternsOutputSchema },
  prompt: `Analyze speaking time distribution, interruption patterns, agreement/disagreement frequencies, and influence dynamics between participants from the transcript. This provides insights into team dynamics and communication effectiveness. Format as Markdown.\n\nTranscript:\n{{transcript}}`,
});
