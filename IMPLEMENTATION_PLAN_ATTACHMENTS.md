# 📎 РЕАЛИЗАЦИЯ ВЛОЖЕНИЙ В СООБЩЕНИЯХ

**Статус:** 🟡 В разработке  
**Приоритет:** 🔴 Высокий  
**Оценка:** 24 часа (3 рабочих дня)

---

## 📋 СОДЕРЖАТЕЛЬНОСТЬ

1. [Требования](#1-требования)
2. [Типы вложений](#2-типы-вложений)
3. [Бэкенд (API)](#3-бэкенд-api)
4. [Фронтенд (Компоненты)](#4-фронтенд-компоненты)
5. [База данных](#5-база-данных)
6. [Интеграция с сообщениями](#6-интеграция-с-сообщениями)
7. [Тестирование](#7-тестирование)

---

## 1. ТРЕБОВАНИЯ

### 1.1 Типы вложений

1. **Голосования (Polls)**
   - Несколько вариантов ответа
   - Возможность текстового ответа
   - Множественный выбор
   - Срок действия
   - Анонимное/имя голосующего

2. **Списки (Lists)**
   - Чек-листы
   - Совместное выполнение
   - Отслеживание прогресса
   - Назначение участников

3. **Опросы (Surveys)**
   - Несколько вопросов
   - Разные типы вопросов (текст, выбор, рейтинг)
   - Обязательные/необязательные вопросы
   - Сохранение ответов

4. **Тесты (Quizzes)**
   - Несколько связанных вопросов
   - Правильные/неправильные ответы
   - Объяснения ответов
   - Подсчёт результатов
   - Ограничение попыток

---

## 2. ТИПЫ ВЛОЖЕНИЙ

```typescript
// messenger/src/types/attachments.ts

/**
 * Типы вложений сообщений
 */
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
  allowTextResponse: boolean; // Разрешить текстовый ответ
  multipleChoice: boolean; // Несколько вариантов
  allowMultipleVotes: boolean; // Alias для совместимости
  expiresAt?: number; // Срок действия
  isAnonymous: boolean; // Анонимное голосование
  maxVotes?: number; // Максимум выборов (для multipleChoice)
}

export interface PollResults {
  totalVotes: number;
  uniqueVoters: string[]; // userId[]
  completedAt?: number;
}

export interface UserPollResponse {
  optionIds: string[]; // Выбранные варианты
  textResponse?: string; // Текстовый ответ
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
  completedBy?: string[]; // userId[]
  completedAt?: number;
  assignedTo?: string; // Назначенный пользователь
  order: number;
}

export interface ListSettings {
  allowMultipleCompletion: boolean; // Можно выполнять несколько раз
  requireAllItems: boolean; // Все items обязательны
  allowReordering: boolean; // Можно менять порядок
  notifyOnComplete: boolean; // Уведомлять о завершении
}

export interface ListProgress {
  totalItems: number;
  completedItems: number;
  progress: number; // 0-100
  completedBy: Record<string, number>; // userId -> completed count
  lastCompletedAt?: number;
}

// ============================================
// ОПРОС (SURVEY)
// ============================================

export interface SurveyAttachment {
  type: 'survey';
  surveyId: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  settings: SurveySettings;
  results: SurveyResults;
  userSubmission?: UserSurveySubmission;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
}

export type SurveyQuestionType = 
  | 'text' 
  | 'textarea' 
  | 'single-choice' 
  | 'multiple-choice' 
  | 'rating' 
  | 'scale'
  | 'date'
  | 'email';

export interface SurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  question: string;
  description?: string;
  options?: SurveyOption[]; // Для choice типов
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
  pattern?: string; // Regex
  min?: number; // Для number/rating
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
  averageRating?: number; // Для rating/scale
  optionBreakdown?: Record<string, number>; // Для choice типов
}

export interface UserSurveySubmission {
  answers: SurveyAnswer[];
  submittedAt: number;
  duration?: number; // Время заполнения в ms
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
  correctOptions: string[]; // IDs правильных ответов
  explanation?: string; // Объяснение после ответа
  points?: number; // Баллы за вопрос
  order: number;
}

export interface QuizOption {
  id: string;
  text: string;
  image?: string; // Опциональное изображение
}

export interface QuizSettings {
  passingScore: number; // Процент для прохождения (0-100)
  maxAttempts: number; // Максимум попыток (0 = без лимита)
  showCorrectAnswers: boolean; // Показывать правильные ответы
  showExplanation: boolean; // Показывать объяснения
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  timer?: number; // Таймер в секундах
  randomizeCorrectAnswers: boolean; // Случайные правильные ответы
}

export interface QuizResults {
  totalAttempts: number;
  uniqueTakers: string[];
  averageScore: number;
  passRate: number; // Процент прошедших
  completedAt?: number;
}

export interface UserQuizAttempt {
  answers: QuizAnswer[];
  score: number;
  correctCount: number;
  totalCount: number;
  passed: boolean;
  attemptedAt: number;
  duration?: number; // Время прохождения в ms
  attemptNumber: number;
}

export interface QuizAnswer {
  questionId: string;
  optionIds: string[];
  isCorrect: boolean;
  points?: number;
}

// ============================================
// ОБЩИЕ ТИПЫ
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
```

---

## 3. БЭКЕНД (API)

### 3.1 Схема БД

```sql
-- api/src/schema/attachments.sql

-- Голосования
CREATE TABLE IF NOT EXISTS polls (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  message_id TEXT REFERENCES messages(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSON NOT NULL,
  settings JSON NOT NULL,
  total_votes INTEGER DEFAULT 0,
  is_anonymous BOOLEAN DEFAULT TRUE,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_polls_chat ON polls(chat_id);
CREATE INDEX idx_polls_message ON polls(message_id);

-- Ответы на голосования
CREATE TABLE IF NOT EXISTS poll_responses (
  id TEXT PRIMARY KEY,
  poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  option_ids JSON,
  text_response TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE(poll_id, user_id)
);

CREATE INDEX idx_poll_responses_poll ON poll_responses(poll_id);
CREATE INDEX idx_poll_responses_user ON poll_responses(user_id);

-- Списки
CREATE TABLE IF NOT EXISTS lists (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  message_id TEXT REFERENCES messages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  items JSON NOT NULL,
  settings JSON NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_lists_chat ON lists(chat_id);

-- Совместное выполнение списков
CREATE TABLE IF NOT EXISTS list_items_completion (
  id TEXT PRIMARY KEY,
  list_id TEXT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  completed_at INTEGER NOT NULL,
  UNIQUE(list_id, item_id, user_id)
);

CREATE INDEX idx_list_completion_list ON list_items_completion(list_id);

-- Опросы
CREATE TABLE IF NOT EXISTS surveys (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  message_id TEXT REFERENCES messages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  questions JSON NOT NULL,
  settings JSON NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_surveys_chat ON surveys(chat_id);

-- Ответы на опросы
CREATE TABLE IF NOT EXISTS survey_submissions (
  id TEXT PRIMARY KEY,
  survey_id TEXT NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  answers JSON NOT NULL,
  duration INTEGER,
  created_at INTEGER NOT NULL,
  UNIQUE(survey_id, user_id)
);

CREATE INDEX idx_survey_submissions_survey ON survey_submissions(survey_id);

-- Тесты
CREATE TABLE IF NOT EXISTS quizzes (
  id TEXT PRIMARY KEY,
  chat_id TEXT NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  message_id TEXT REFERENCES messages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  questions JSON NOT NULL,
  settings JSON NOT NULL,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_quizzes_chat ON quizzes(chat_id);

-- Результаты тестов
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  answers JSON NOT NULL,
  score INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  total_count INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  duration INTEGER,
  attempt_number INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(quiz_id, user_id, attempt_number)
);

CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
```

### 3.2 Контроллеры

```javascript
// api/src/controllers/polls.controller.js

const db = require('../config/database');

const pollsController = {
  // Создать голосование
  createPoll: async (req, res) => {
    try {
      const { chatId, messageId, question, options, settings } = req.body;
      const userId = req.user.id;
      
      const pollId = `poll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Date.now();
      
      db.prepare(`
        INSERT INTO polls (
          id, chat_id, message_id, question, options, settings,
          created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        pollId,
        chatId,
        messageId || null,
        question,
        JSON.stringify(options),
        JSON.stringify(settings || {}),
        userId,
        now,
        now
      );
      
      res.json({
        success: true,
        data: {
          pollId,
          question,
          options,
          settings: settings || {},
          createdAt: now
        }
      });
    } catch (error) {
      console.error('[Polls] Create error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create poll'
      });
    }
  },
  
  // Получить голосование с результатами
  getPoll: async (req, res) => {
    try {
      const { pollId } = req.params;
      const userId = req.user.id;
      
      const poll = db.prepare(`
        SELECT * FROM polls WHERE id = ?
      `).get(pollId);
      
      if (!poll) {
        return res.status(404).json({
          success: false,
          error: 'Poll not found'
        });
      }
      
      // Получить ответы пользователя
      const userResponse = db.prepare(`
        SELECT * FROM poll_responses
        WHERE poll_id = ? AND user_id = ?
      `).get(pollId, userId);
      
      // Получить варианты с голосами
      const options = JSON.parse(poll.options).map(option => {
        const votes = db.prepare(`
          SELECT COUNT(*) as count
          FROM poll_responses
          WHERE poll_id = ? AND ? IN (SELECT value FROM json_each(option_ids))
        `).get(pollId, option.id);
        
        return {
          ...option,
          votes: votes.count,
          percentage: 0 // Вычисляется позже
        };
      });
      
      // Вычислить проценты
      const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);
      options.forEach(opt => {
        opt.percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
        opt.userVoted = userResponse?.option_ids?.includes(opt.id);
      });
      
      res.json({
        success: true,
        data: {
          pollId: poll.id,
          question: poll.question,
          options,
          settings: JSON.parse(poll.settings),
          totalVotes,
          userResponse: userResponse ? {
            optionIds: userResponse.option_ids,
            textResponse: userResponse.text_response,
            votedAt: userResponse.created_at
          } : undefined
        }
      });
    } catch (error) {
      console.error('[Polls] Get error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch poll'
      });
    }
  },
  
  // Проголосовать
  vote: async (req, res) => {
    try {
      const { pollId } = req.params;
      const { optionIds, textResponse } = req.body;
      const userId = req.user.id;
      
      const poll = db.prepare('SELECT * FROM polls WHERE id = ?').get(pollId);
      if (!poll) {
        return res.status(404).json({
          success: false,
          error: 'Poll not found'
        });
      }
      
      const settings = JSON.parse(poll.settings);
      
      // Проверить срок действия
      if (settings.expiresAt && Date.now() > settings.expiresAt) {
        return res.status(400).json({
          success: false,
          error: 'Poll has expired'
        });
      }
      
      // Проверить множественный выбор
      if (!settings.multipleChoice && optionIds.length > 1) {
        return res.status(400).json({
          success: false,
          error: 'Only one option allowed'
        });
      }
      
      // Проверить макс. выбор
      if (settings.multipleChoice && settings.maxVotes && optionIds.length > settings.maxVotes) {
        return res.status(400).json({
          success: false,
          error: `Maximum ${settings.maxVotes} options allowed`
        });
      }
      
      // Проверить уже голосовал
      const existing = db.prepare(`
        SELECT * FROM poll_responses WHERE poll_id = ? AND user_id = ?
      `).get(pollId, userId);
      
      if (existing && !settings.allowMultipleSubmissions) {
        return res.status(400).json({
          success: false,
          error: 'Already voted'
        });
      }
      
      const now = Date.now();
      
      if (existing) {
        // Обновить ответ
        db.prepare(`
          UPDATE poll_responses
          SET option_ids = ?, text_response = ?, created_at = ?
          WHERE poll_id = ? AND user_id = ?
        `).run(
          JSON.stringify(optionIds),
          textResponse || null,
          now,
          pollId,
          userId
        );
      } else {
        // Создать ответ
        const responseId = `resp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        db.prepare(`
          INSERT INTO poll_responses (id, poll_id, user_id, option_ids, text_response, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          responseId,
          pollId,
          userId,
          JSON.stringify(optionIds),
          textResponse || null,
          now
        );
        
        // Обновить total_votes
        db.prepare(`
          UPDATE polls SET total_votes = total_votes + 1 WHERE id = ?
        `).run(pollId);
      }
      
      res.json({
        success: true,
        message: 'Vote recorded'
      });
    } catch (error) {
      console.error('[Polls] Vote error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to vote'
      });
    }
  }
};

module.exports = pollsController;
```

---

## 4. ФРОНТЕНД (КОМПОНЕНТЫ)

### 4.1 PollAttachment компонент

```typescript
// messenger/src/components/attachments/PollAttachment.tsx

'use client';

import { useState, useEffect } from 'react';
import { PollAttachment as PollType } from '@/types/attachments';
import { useAuthStore } from '@/stores/auth-store';
import { getTranslations } from '@/i18n';
import { useSettingsStore } from '@/stores/settings-store';
import './PollAttachment.css';

interface PollAttachmentProps {
  poll: PollType;
  messageId: string;
  onUpdate: (updatedPoll: PollType) => void;
}

export function PollAttachment({ poll, messageId, onUpdate }: PollAttachmentProps) {
  const { user } = useAuthStore();
  const translations = getTranslations(useSettingsStore(state => state.language));
  
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isVoting, setIsVoting] = useState(false);
  const [showResults, setShowResults] = useState(!!poll.userResponse);

  useEffect(() => {
    if (poll.userResponse) {
      setSelectedOptions(poll.userResponse.optionIds);
      setTextInput(poll.userResponse.textResponse || '');
      setShowResults(true);
    }
  }, [poll.userResponse]);

  const handleOptionToggle = (optionId: string) => {
    if (showResults) return;
    
    if (poll.settings.multipleChoice) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmitVote = async () => {
    if (selectedOptions.length === 0) return;
    
    setIsVoting(true);
    try {
      const response = await fetch(`/api/v1/polls/${poll.pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          optionIds: selectedOptions,
          textResponse: poll.settings.allowTextResponse ? textInput : undefined
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Обновляем polling
        const updatedPoll: PollType = {
          ...poll,
          userResponse: {
            optionIds: selectedOptions,
            textResponse: poll.settings.allowTextResponse ? textInput : undefined,
            votedAt: Date.now()
          }
        };
        onUpdate(updatedPoll);
        setShowResults(true);
      }
    } catch (error) {
      console.error('[Poll] Vote error:', error);
      alert(translations.errorNetwork);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="poll-attachment">
      <h4 className="poll-question">{poll.question}</h4>
      
      <div className="poll-options">
        {poll.options.map(option => (
          <div 
            key={option.id} 
            className={`poll-option ${option.userVoted ? 'voted' : ''}`}
          >
            <div 
              className="poll-option-bar" 
              style={{ width: `${showResults ? option.percentage : 0}%` }} 
            />
            <div className="poll-option-content">
              {!showResults ? (
                <>
                  {poll.settings.multipleChoice ? (
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => handleOptionToggle(option.id)}
                    />
                  ) : (
                    <input
                      type="radio"
                      name={`poll-${poll.pollId}`}
                      checked={selectedOptions.includes(option.id)}
                      onChange={() => handleOptionToggle(option.id)}
                    />
                  )}
                  <span>{option.text}</span>
                </>
              ) : (
                <>
                  <span>{option.text}</span>
                  <span className="poll-option-votes">
                    {option.votes} ({option.percentage}%)
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {poll.settings.allowTextResponse && !showResults && (
        <div className="poll-text-response">
          <input
            type="text"
            placeholder={translations.pollTextResponsePlaceholder}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        </div>
      )}
      
      {!showResults && (
        <button 
          className="poll-vote-button"
          onClick={handleSubmitVote}
          disabled={selectedOptions.length === 0 || isVoting}
        >
          {isVoting ? translations.voting : translations.vote}
        </button>
      )}
      
      {showResults && (
        <div className="poll-footer">
          <span>{translations.totalVotes}: {poll.results.totalVotes}</span>
          {poll.settings.expiresAt && (
            <span className="poll-expires">
              {translations.expires}: {new Date(poll.settings.expiresAt).toLocaleDateString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
```

### 4.2 QuizAttachment компонент

```typescript
// messenger/src/components/attachments/QuizAttachment.tsx

'use client';

import { useState, useEffect } from 'react';
import { QuizAttachment as QuizType, QuizAnswer } from '@/types/attachments';
import { useAuthStore } from '@/stores/auth-store';
import { getTranslations } from '@/i18n';
import { useSettingsStore } from '@/stores/settings-store';
import './QuizAttachment.css';

interface QuizAttachmentProps {
  quiz: QuizType;
  messageId: string;
  onSubmit: (answers: QuizAnswer[]) => Promise<void>;
}

export function QuizAttachment({ quiz, messageId, onSubmit }: QuizAttachmentProps) {
  const { user } = useAuthStore();
  const translations = getTranslations(useSettingsStore(state => state.language));
  
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(quiz.settings.timer);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (quiz.userAttempt) {
      setShowResults(true);
    }
    
    if (quiz.settings.timer && !quiz.userAttempt && !startTime) {
      setStartTime(Date.now());
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, []);

  const handleAnswer = (questionId: string, optionIds: string[]) => {
    if (showResults) return;
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIds
    }));
  };

  const calculateResults = (): { score: number; correctCount: number; answers: QuizAnswer[] } => {
    const quizAnswers: QuizAnswer[] = [];
    let correctCount = 0;
    
    quiz.questions.forEach(q => {
      const userAnswer = answers[q.id] || [];
      const isCorrect = 
        q.correctOptions.length === userAnswer.length &&
        q.correctOptions.every(opt => userAnswer.includes(opt));
      
      if (isCorrect) correctCount++;
      
      quizAnswers.push({
        questionId: q.id,
        optionIds: userAnswer,
        isCorrect,
        points: q.points
      });
    });
    
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    return { score, correctCount, answers: quizAnswers };
  };

  const handleSubmit = async () => {
    const allAnswered = quiz.questions.every(q => answers[q.id]);
    if (!allAnswered) {
      alert(translations.quizIncomplete);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const results = calculateResults();
      const passed = results.score >= quiz.settings.passingScore;
      
      await onSubmit(results.answers);
      
      setShowResults(true);
    } catch (error) {
      console.error('[Quiz] Submit error:', error);
      alert(translations.errorNetwork);
    } finally {
      setIsSubmitting(false);
    }
  };

  const results = showResults ? calculateResults() : null;
  const passed = results?.score !== undefined && results.score >= quiz.settings.passingScore;

  return (
    <div className="quiz-attachment">
      <div className="quiz-header">
        <h4>{quiz.title}</h4>
        {quiz.description && <p>{quiz.description}</p>}
        {quiz.settings.timer && !showResults && (
          <div className={`quiz-timer ${timer <= 30 ? 'warning' : ''}`}>
            ⏱️ {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </div>
        )}
        {quiz.userAttempt && (
          <p className="quiz-attempt-info">
            {translations.attempt} {quiz.userAttempt.attemptNumber} / {quiz.settings.maxAttempts || '∞'}
          </p>
        )}
      </div>
      
      <div className="quiz-questions">
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="quiz-question">
            <div className="question-header">
              <p className="question-number">{translations.question} {index + 1}</p>
              {question.points && (
                <span className="question-points">{question.points} {translations.points}</span>
              )}
            </div>
            <p className="question-text">{question.question}</p>
            
            <div className="question-options">
              {question.options.map(option => {
                const isSelected = answers[question.id]?.includes(option.id);
                const isCorrect = question.correctOptions.includes(option.id);
                const showCorrectness = showResults;
                
                return (
                  <label 
                    key={option.id}
                    className={`option ${isSelected ? 'selected' : ''} ${showCorrectness && isCorrect ? 'correct' : ''} ${showCorrectness && isSelected && !isCorrect ? 'incorrect' : ''}`}
                  >
                    <input
                      type={question.type === 'multiple-choice' ? 'checkbox' : 'radio'}
                      name={`question-${question.id}`}
                      checked={isSelected}
                      onChange={(e) => {
                        if (question.type === 'multiple-choice') {
                          const current = answers[question.id] || [];
                          const updated = e.target.checked
                            ? [...current, option.id]
                            : current.filter(id => id !== option.id);
                          handleAnswer(question.id, updated);
                        } else {
                          handleAnswer(question.id, [option.id]);
                        }
                      }}
                      disabled={showResults}
                    />
                    <span>{option.text}</span>
                    {showCorrectness && isCorrect && (
                      <span className="correct-indicator">✓</span>
                    )}
                    {showCorrectness && isSelected && !isCorrect && (
                      <span className="incorrect-indicator">✗</span>
                    )}
                  </label>
                );
              })}
            </div>
            
            {showResults && question.explanation && (
              <div className="question-explanation">
                <p><strong>{translations.explanation}:</strong> {question.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {!showResults && quiz.userAttempt?.attemptNumber! < quiz.settings.maxAttempts && (
        <button
          className="submit-quiz-button"
          onClick={handleSubmit}
          disabled={isSubmitting || Object.keys(answers).length !== quiz.questions.length}
        >
          {isSubmitting ? translations.submitting : translations.submitQuiz}
        </button>
      )}
      
      {showResults && results && (
        <div className="quiz-results">
          <div className={`result-score ${passed ? 'passed' : 'failed'}`}>
            <h3>{passed ? translations.quizPassed : translations.quizFailed}</h3>
            <div className="score-circle">
              <span className="score-value">{results.score}%</span>
              <span className="score-label">{translations.correct}</span>
            </div>
            <p>{results.correctCount} / {quiz.questions.length} {translations.correctAnswers}</p>
            <p>{translations.attempt} {quiz.userAttempt?.attemptNumber} / {quiz.settings.maxAttempts}</p>
            
            {!passed && quiz.userAttempt?.attemptNumber! < quiz.settings.maxAttempts && (
              <button onClick={() => setShowResults(false)}>
                {translations.tryAgain}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 5. БАЗА ДАННЫХ

Скрипт миграции создаётся в `api/scripts/migrate-attachments.js` (см. раздел 3.1)

---

## 6. ИНТЕГРАЦИЯ С СООБЩЕНИЯМИ

### 6.1 Обновление типа сообщения

```typescript
// messenger/src/types/index.ts

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: 'text' | 'image' | 'video' | 'file' | 'audio' | 'poll' | 'list' | 'survey' | 'quiz';
  content: string;
  attachment?: MessageAttachment; // Новое поле
  // ... остальные поля
}
```

### 6.2 Отправка сообщения с вложением

```typescript
// messenger/src/api/attachments.ts

export const attachmentsApi = {
  createPoll: async (chatId: string, pollData: PollAttachment) => {
    const response = await apiClient.post('/polls', {
      chatId,
      question: pollData.question,
      options: pollData.options,
      settings: pollData.settings
    });
    return response.data;
  },
  
  vote: async (pollId: string, optionIds: string[], textResponse?: string) => {
    const response = await apiClient.post(`/polls/${pollId}/vote`, {
      optionIds,
      textResponse
    });
    return response.data;
  },
  
  submitQuiz: async (quizId: string, answers: QuizAnswer[]) => {
    const response = await apiClient.post(`/quizzes/${quizId}/submit`, {
      answers
    });
    return response.data;
  }
};
```

---

## 7. ТЕСТИРОВАНИЕ

### 7.1 Unit тесты

```javascript
// api/__tests__/polls.test.js

const request = require('supertest');
const app = require('../src/index');

describe('Polls API', () => {
  let authToken;
  let pollId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'poll-test@balloo.ru',
        password: 'Test1234!',
        displayName: 'Poll Test'
      });
    
    authToken = res.body.data.accessToken;
  });

  test('create poll', async () => {
    const res = await request(app)
      .post('/api/v1/polls')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        chatId: 'test-chat-id',
        question: 'Test question?',
        options: [
          { id: 'opt1', text: 'Option 1' },
          { id: 'opt2', text: 'Option 2' }
        ],
        settings: {
          multipleChoice: false,
          allowTextResponse: false,
          isAnonymous: true
        }
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('pollId');
    pollId = res.body.data.pollId;
  });

  test('vote on poll', async () => {
    const res = await request(app)
      .post(`/api/v1/polls/${pollId}/vote`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        optionIds: ['opt1']
      });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('get poll with results', async () => {
    const res = await request(app)
      .get(`/api/v1/polls/${pollId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('options');
    expect(res.body.data.options[0]).toHaveProperty('votes');
    expect(res.body.data.options[0]).toHaveProperty('percentage');
  });
});
```

---

**Конец документации**

*Документ создан Koda (NLP-Core-Team)*  
*Дата: 2026-06-07*
