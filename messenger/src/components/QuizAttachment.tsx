'use client';

import React, { useState, useEffect } from 'react';
import { QuizAttachment, QuizQuestion, QuizOption, QuizAnswer } from '@/types/attachments';
import './QuizAttachment.css';

interface QuizAttachmentProps {
  quiz: QuizAttachment;
  onSubmit: (answers: QuizAnswer[]) => void;
  isDisabled?: boolean;
}

const QuizAttachment: React.FC<QuizAttachmentProps> = ({
  quiz,
  onSubmit,
  isDisabled = false
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    correctCount: number;
    totalCount: number;
    passed: boolean;
  } | null>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  useEffect(() => {
    // Сортировка вопросов при монтировании
    const sortedQuestions = [...quiz.questions].sort((a, b) => a.order - b.order);
    if (quiz.settings.shuffleQuestions) {
      // Простая перемешка (в реальности нужен более надёжный алгоритм)
      for (let i = sortedQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sortedQuestions[i], sortedQuestions[j]] = [sortedQuestions[j], sortedQuestions[i]];
      }
    }
  }, [quiz.questions, quiz.settings.shuffleQuestions]);

  const handleAnswer = (optionIds: string[]) => {
    if (isDisabled) return;

    const currentAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      optionIds,
      isCorrect: checkCorrectness(currentQuestion, optionIds)
    };

    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQuestion.id);
      return [...filtered, currentAnswer];
    });
  };

  const checkCorrectness = (question: QuizQuestion, selectedIds: string[]): boolean => {
    const correctSet = new Set(question.correctOptions);
    const selectedSet = new Set(selectedIds);
    
    if (selectedSet.size !== correctSet.size) return false;
    
    for (const id of selectedSet) {
      if (!correctSet.has(id)) return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalCount = quiz.questions.length;
    const score = Math.round((correctCount / totalCount) * 100);
    const passed = score >= quiz.settings.passingScore;

    const resultData = {
      score,
      correctCount,
      totalCount,
      passed
    };

    setResult(resultData);
    setShowResults(true);
    onSubmit(answers);
  };

  const getSelectedOptions = (questionId: string): string[] => {
    const answer = answers.find(a => a.questionId === questionId);
    return answer?.optionIds || [];
  };

  const isOptionSelected = (questionId: string, optionId: string): boolean => {
    return getSelectedOptions(questionId).includes(optionId);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults && result) {
    return (
      <div className="quiz-attachment quiz-results">
        <div className="quiz-results-header">
          <div className={`quiz-results-icon ${result.passed ? 'passed' : 'failed'}`}>
            {result.passed ? '✅' : '❌'}
          </div>
          <h3>{result.passed ? 'Тест пройден!' : 'Тест не пройден'}</h3>
        </div>

        <div className="quiz-results-score">
          <div className="score-circle">
            <span className="score-value">{result.score}%</span>
            <span className="score-label">Результат</span>
          </div>
        </div>

        <div className="quiz-results-stats">
          <div className="stat-item">
            <span className="stat-label">Правильных ответов</span>
            <span className="stat-value">{result.correctCount} из {result.totalCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Порог прохождения</span>
            <span className="stat-value">{quiz.settings.passingScore}%</span>
          </div>
        </div>

        {quiz.settings.showCorrectAnswers && (
          <button
            className="quiz-review-btn"
            onClick={() => setShowResults(false)}
          >
            Просмотреть ответы
          </button>
        )}

        <button
          className="quiz-retry-btn"
          onClick={() => {
            setShowResults(false);
            setResult(null);
            setAnswers([]);
            setCurrentQuestionIndex(0);
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-attachment">
      <div className="quiz-header">
        <div className="quiz-title">
          <span className="quiz-icon">📝</span>
          <h3>{quiz.title}</h3>
        </div>
        
        {quiz.description && (
          <p className="quiz-description">{quiz.description}</p>
        )}

        <div className="quiz-progress">
          <span>Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}</span>
          <div className="quiz-progress-bar">
            <div 
              className="quiz-progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {quiz.settings.timer && (
          <div className="quiz-timer">
            ⏱️ <span id="quiz-timer-value">{formatTime(quiz.settings.timer)}</span>
          </div>
        )}
      </div>

      <div className="quiz-question">
        <h4 className="question-text">{currentQuestion.question}</h4>
        
        {currentQuestion.description && (
          <p className="question-description">{currentQuestion.description}</p>
        )}

        <div className="question-options">
          {currentQuestion.options.map((option) => {
            const isSelected = isOptionSelected(currentQuestion.id, option.id);
            
            return (
              <div
                key={option.id}
                className={`question-option ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  if (currentQuestion.type === 'single-choice') {
                    handleAnswer([option.id]);
                  } else {
                    const current = getSelectedOptions(currentQuestion.id);
                    if (current.includes(option.id)) {
                      handleAnswer(current.filter(id => id !== option.id));
                    } else {
                      handleAnswer([...current, option.id]);
                    }
                  }
                }}
              >
                <div className="option-checkbox">
                  {currentQuestion.type === 'single-choice' ? (
                    <input type="radio" checked={isSelected} readOnly />
                  ) : (
                    <input type="checkbox" checked={isSelected} readOnly />
                  )}
                </div>
                <span className="option-text">{option.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="quiz-footer">
        <button
          className="quiz-next-btn"
          onClick={handleNext}
          disabled={getSelectedOptions(currentQuestion.id).length === 0}
        >
          {isLastQuestion ? 'Завершить тест' : 'Следующий вопрос'}
        </button>
      </div>
    </div>
  );
};

export default QuizAttachment;
