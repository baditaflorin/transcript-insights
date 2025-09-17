import type { AnalysisResult } from '@/app/actions';
import { AnalysisType } from '@/ai/flows/prompts';
import { CheckSquare, MessageCircleQuestion, Users, FileText, Clock, ShieldAlert, Zap, Smile, Gavel, Network, Lightbulb, BarChartHorizontal } from 'lucide-react';


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

const formatOpenQuestions = (openQuestions: { speaker: string; question: string }[]): string => {
  if (!openQuestions || openQuestions.length === 0) return '';
  const groupedBySpeaker = openQuestions.reduce((acc, item) => {
    if (!acc[item.speaker]) {
      acc[item.speaker] = [];
    }
    acc[item.speaker].push(`- ${item.question}`);
    return acc;
  }, {} as Record<string, string[]>);

  return Object.entries(groupedBySpeaker)
    .map(([speaker, questions]) => `### ${speaker}\n\n${questions.join('\n')}`)
    .join('\n\n');
};

export const analysisConfig: Record<(typeof AnalysisType)[keyof typeof AnalysisType], { title: string; description: string; icon: React.ElementType; filename: string; contentKey: keyof AnalysisResult, dataKey: (res: AnalysisResult) => string | undefined, errorKey: (res: AnalysisResult) => string | undefined }> = {
    summary: { title: "Summary", description: "A concise overview of the conversation.", icon: FileText, filename: "summary.md", contentKey: 'summary', dataKey: (res) => (res.summary && 'summary' in res.summary) ? res.summary.summary : undefined, errorKey: (res) => (res.summary && 'error' in res.summary) ? res.summary.error : undefined },
    perspectives: { title: "Conversation Perspectives", description: "Each speaker's point of view, goals, and contributions.", icon: Users, filename: "perspectives.md", contentKey: 'perspectives', dataKey: (res) => (res.perspectives && 'analysis' in res.perspectives) ? res.perspectives.analysis : undefined, errorKey: (res) => (res.perspectives && 'error' in res.perspectives) ? res.perspectives.error : undefined },
    actionItems: { title: "Action Checklist", description: "A checklist of tasks assigned to each speaker.", icon: CheckSquare, filename: "action_checklist.md", contentKey: 'actionItems', dataKey: (res) => (res.actionItems && 'actionItems' in res.actionItems && res.actionItems.actionItems) ? formatActionItems(res.actionItems.actionItems) : undefined, errorKey: (res) => (res.actionItems && 'error' in res.actionItems) ? res.actionItems.error : undefined },
    openQuestions: { title: "Open Questions", description: "Unanswered questions and topics for follow-up.", icon: MessageCircleQuestion, filename: "followups.md", contentKey: 'openQuestions', dataKey: (res) => (res.openQuestions && 'openQuestions' in res.openQuestions && res.openQuestions.openQuestions) ? formatOpenQuestions(res.openQuestions.openQuestions) : undefined, errorKey: (res) => (res.openQuestions && 'error' in res.openQuestions) ? res.openQuestions.error : undefined },
    timeline: { title: "Timeline of Key Moments", description: "Chronological points and decisions from the transcript.", icon: Clock, filename: "timeline.md", contentKey: 'timeline', dataKey: (res) => (res.timeline && 'timeline' in res.timeline) ? res.timeline.timeline : undefined, errorKey: (res) => (res.timeline && 'error' in res.timeline) ? res.timeline.error : undefined },
    risks: { title: "Risks & Concerns", description: "Identified risks, concerns, or objections.", icon: ShieldAlert, filename: "risks_concerns.md", contentKey: 'risks', dataKey: (res) => (res.risks && 'risksAndConcerns' in res.risks) ? res.risks.risksAndConcerns : undefined, errorKey: (res) => (res.risks && 'error' in res.risks) ? res.risks.error : undefined },
    opportunities: { title: "Opportunities & Ideas", description: "Opportunities, ideas, or suggestions raised.", icon: Zap, filename: "opportunities.md", contentKey: 'opportunities', dataKey: (res) => (res.opportunities && 'opportunitiesAndIdeas' in res.opportunities) ? res.opportunities.opportunitiesAndIdeas : undefined, errorKey: (res) => (res.opportunities && 'error' in res.opportunities) ? res.opportunities.error : undefined },
    sentiment: { title: "Tone & Sentiment", description: "Analysis of the conversation's tone and sentiment.", icon: Smile, filename: "sentiment.md", contentKey: 'sentiment', dataKey: (res) => (res.sentiment && 'sentiment' in res.sentiment) ? res.sentiment.sentiment : undefined, errorKey: (res) => (res.sentiment && 'error' in res.sentiment) ? res.sentiment.error : undefined },
    decisions: { title: "Key Decisions", description: "Specific decisions and commitments made.", icon: Gavel, filename: "decisions.md", contentKey: 'decisions', dataKey: (res) => (res.decisions && 'decisions' in res.decisions) ? res.decisions.decisions : undefined, errorKey: (res) => (res.decisions && 'error' in res.decisions) ? res.decisions.error : undefined },
    stakeholders: { title: "Stakeholder Map", description: "People, roles, and relationships mentioned.", icon: Network, filename: "stakeholders.md", contentKey: 'stakeholders', dataKey: (res) => (res.stakeholders && 'stakeholders' in res.stakeholders) ? res.stakeholders.stakeholders : undefined, errorKey: (res) => (res.stakeholders && 'error' in res.stakeholders) ? res.stakeholders.error : undefined },
    knowledgeGaps: { title: "Knowledge Gaps", description: "Uncertainties and assumptions identified.", icon: Lightbulb, filename: "knowledge_gaps.md", contentKey: 'knowledgeGaps', dataKey: (res) => (res.knowledgeGaps && 'knowledgeGaps' in res.knowledgeGaps) ? res.knowledgeGaps.knowledgeGaps : undefined, errorKey: (res) => (res.knowledgeGaps && 'error' in res.knowledgeGaps) ? res.knowledgeGaps.error : undefined },
    communicationPatterns: { title: "Comm. Patterns", description: "Analysis of conversational dynamics.", icon: BarChartHorizontal, filename: "communication_patterns.md", contentKey: 'communicationPatterns', dataKey: (res) => (res.communicationPatterns && 'communicationPatterns' in res.communicationPatterns) ? res.communicationPatterns.communicationPatterns : undefined, errorKey: (res) => (res.communicationPatterns && 'error' in res.communicationPatterns) ? res.communicationPatterns.error : undefined },
};
