/**
 * @fileOverview This file serves as a barrel, exporting all prompt-related
 * modules for easy importing into other parts of the application. It also
 * centralizes the definition of the AnalysisType enum.
 */

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


export * from './summary';
export * from './perspectives';
export * from './action-items';
export * from './open-questions';
export * from './timeline';
export * from './risks';
export * from './opportunities';
export * from './sentiment';
export * from './decisions';
export * from './stakeholders';
export * from './knowledge-gaps';
export * from './communication-patterns';
