/**
 * Типы вложений сообщений
 * Polls, Lists, Surveys, Quizzes
 */

// ============================================
// ОБЩИЕ ТИПЫ
// ============================================

export type AttachmentType = 
  | 'image' 
  | 'video' 
  | 'audio' 
  | 'file' 
  | 'document'
  | 'poll' 
  | 'list' 
  | 'survey' 
  | 'quiz';

// ============================================
// ГОЛОСОВАНИЕ (POLL)
// ============================================

export interface PollAttachment {
  type: 'poll';
  pollId: string;
  question: string;
  options: PollOption[];
  settings: PollSettings;
  results: PollResults;
  userResponse?: UserPollResponse;
  createdAt: number;
  updatedAt: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
  userVoted?: boolean;
}

export interface PollSettings {
  allowTextResponse: boolean;
  multipleChoice: boolean;
  expiresAt?: number;
  isAnonymous: boolean;
  maxVotes?: number;
}

export interface PollResults {
  totalVotes: number;
  uniqueVoters: string[];
  completedAt?: number;
}

export interface UserPollResponse {
  optionIds: string[];
  textResponse?: string;
  votedAt: number;
}

// ============================================
// СПИСОК (LIST)
// ============================================

export interface ListAttachment {
  type: 'list';
  listId: string;
  title: string;
  description?: string;
  items: ListItem[];
  settings: ListSettings;
  progress: ListProgress;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export interface ListItem {
  id: string;
  text: string;
  completed: boolean;
  completedBy?: string[];
  completedAt?: number;
  assignedTo?: string;
  order: number;
}

export interface ListSettings {
  allowMultipleCompletion: boolean;
  requireAllItems: boolean;
  allowReordering: boolean;
  notifyOnComplete: boolean;
}

export interface ListProgress {
  totalItems: number;
  completedItems: number;
  progress: number;
  completedBy: Record<string, number>;
  lastCompletedAt?: number;
}

// ============================================
// ОПРОС (SURVEY)
// ============================================

export type SurveyQuestionType = 
  | 'text' 
  | 'textarea' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'rating';

export interface SurveySection {
  id: string;
  surveyId?: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  order: number;
}

export interface SurveyAttachment {
  type: 'survey';
  surveyId: string;
  title: string;
  description?: string;
  sections: SurveySection[];
  settings: SurveySettings;
  createdAt: number;
  updatedAt: number;
}

export interface SurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  question: string;
  description?: string;
  placeholder?: string;
  options?: SurveyOption[];
  required: boolean;
  order: number;
  validation?: QuestionValidation;
}

export interface SurveyOption {
  id: string;
  text: string;
  value?: string;
}

export interface QuestionValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface SurveySettings {
  allowMultipleSubmissions: boolean;
  showResultsAfterSubmit: boolean;
  requireAllQuestions: boolean;
  anonymous: boolean;
  expiresAt?: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
}

export interface SurveyResults {
  totalSubmissions: number;
  uniqueRespondents: string[];
  completedAt?: number;
  questionResults: QuestionResults[];
}

export interface QuestionResults {
  questionId: string;
  responses: number;
  averageRating?: number;
  optionBreakdown?: Record<string, number>;
}

export interface UserSurveySubmission {
  answers: SurveyAnswer[];
  submittedAt: number;
  duration?: number;
}

export interface SurveyAnswer {
  questionId: string;
  value: string | string[] | number;
}

// ============================================
// ТЕСТ (QUIZ)
// ============================================

export interface QuizAttachment {
  type: 'quiz';
  quizId: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  settings: QuizSettings;
  results: QuizResults;
  userAttempt?: UserQuizAttempt;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export interface QuizQuestion {
  id: string;
  type: 'single-choice' | 'multiple-choice' | 'true-false';
  question: string;
  description?: string;
  options: QuizOption[];
  correctOptions: string[];
  explanation?: string;
  points?: number;
  order: number;
}

export interface QuizOption {
  id: string;
  text: string;
  image?: string;
}

export interface QuizSettings {
  passingScore: number;
  maxAttempts: number;
  showCorrectAnswers: boolean;
  showExplanation: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  timer?: number;
  randomizeCorrectAnswers: boolean;
}

export interface QuizResults {
  totalAttempts: number;
  uniqueTakers: string[];
  averageScore: number;
  passRate: number;
  completedAt?: number;
}

export interface UserQuizAttempt {
  answers: QuizAnswer[];
  score: number;
  correctCount: number;
  totalCount: number;
  passed: boolean;
  attemptedAt: number;
  duration?: number;
  attemptNumber: number;
}

export interface QuizAnswer {
  questionId: string;
  optionIds: string[];
  isCorrect: boolean;
  points?: number;
}

// ============================================
// СПИСКИ (Lists)
// ============================================

export interface ListItem {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
  completedBy?: string[];
  completedAt?: number;
  assignedTo?: string;
  order: number;
}

export interface ListSettings {
  allowReordering: boolean;
  allowAssigning: boolean;
  showCompleted: boolean;
}

export interface ListAttachment {
  type: 'list';
  listId: string;
  title: string;
  description?: string;
  items: ListItem[];
  settings: ListSettings;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// ОБЩИЙ ТИП ВЛОЖЕНИЯ
// ============================================

export interface MessageAttachment {
  id: string;
  type: AttachmentType;
  data: PollAttachment | ListAttachment | SurveyAttachment | QuizAttachment;
  metadata?: {
    title?: string;
    subtitle?: string;
    icon?: string;
  };
}

export type AttachmentData = 
  | PollAttachment 
  | ListAttachment 
  | SurveyAttachment 
  | QuizAttachment;
