'use client';

import React, { useState } from 'react';
import { SurveyAttachment, SurveyQuestion, SurveyAnswer } from '@/types/attachments';
import './SurveyAttachment.css';

interface SurveyAttachmentProps {
  survey: SurveyAttachment;
  onSubmit: (answers: SurveyAnswer[]) => void;
  isDisabled?: boolean;
}

const SurveyAttachment: React.FC<SurveyAttachmentProps> = ({
  survey,
  onSubmit,
  isDisabled = false
}) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const currentSection = survey.sections[currentSectionIndex];
  const isLastSection = currentSectionIndex === survey.sections.length - 1;

  const handleAnswer = (questionId: string, value: string | string[] | number) => {
    if (isDisabled || submitted) return;

    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== questionId);
      return [...filtered, { questionId, value }];
    });
  };

  const handleSubmit = () => {
    if (answers.length === 0) return;
    
    onSubmit(answers);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (isLastSection) {
      handleSubmit();
    } else {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const renderQuestionInput = (question: SurveyQuestion) => {
    const currentAnswer = answers.find(a => a.questionId === question.id);
    const value = currentAnswer?.value;

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            placeholder={question.placeholder || 'Ваш ответ'}
            value={(value as string) || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            disabled={isDisabled || submitted}
            maxLength={question.validation?.maxLength}
            className="survey-input"
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={question.placeholder || 'Ваш ответ'}
            value={(value as string) || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            disabled={isDisabled || submitted}
            maxLength={question.validation?.maxLength}
            rows={4}
            className="survey-textarea"
          />
        );

      case 'select':
        return (
          <select
            value={(value as string) || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            disabled={isDisabled || submitted}
            className="survey-select"
          >
            <option value="">Выберите вариант</option>
            {question.options?.map((opt, idx) => (
              <option key={idx} value={opt.value || opt.text}>
                {opt.text}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="survey-options">
            {question.options?.map((opt, idx) => (
              <label key={idx} className="survey-option">
                <input
                  type="radio"
                  name={question.id}
                  value={opt.value || opt.text}
                  checked={value === (opt.value || opt.text)}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  disabled={isDisabled || submitted}
                />
                <span>{opt.text}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="survey-options">
            {question.options?.map((opt, idx) => {
              const selectedValues = (value as string[]) || [];
              return (
                <label key={idx} className="survey-option">
                  <input
                    type="checkbox"
                    value={opt.value || opt.text}
                    checked={selectedValues.includes(opt.value || opt.text)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const current = selectedValues || [];
                      const updated = checked
                        ? [...current, opt.value || opt.text]
                        : current.filter((v: string) => v !== (opt.value || opt.text));
                      handleAnswer(question.id, updated);
                    }}
                    disabled={isDisabled || submitted}
                  />
                  <span>{opt.text}</span>
                </label>
              );
            })}
          </div>
        );

      case 'rating':
        return (
          <div className="survey-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`rating-star ${((value as number) || 0) >= star ? 'selected' : ''}`}
                onClick={() => handleAnswer(question.id, star)}
                disabled={isDisabled || submitted}
              >
                {star}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const allQuestionsAnswered = () => {
    const requiredQuestions = currentSection.questions.filter(q => q.required);
    return requiredQuestions.every(q => {
      const answer = answers.find(a => a.questionId === q.id);
      if (!answer) return false;
      if (Array.isArray(answer.value)) return answer.value.length > 0;
      return answer.value !== '';
    });
  };

  if (submitted) {
    return (
      <div className="survey-attachment survey-submitted">
        <div className="survey-submitted-icon">✅</div>
        <h3>Спасибо за ваш ответ!</h3>
        <p>Ваш ответ успешно отправлен.</p>
      </div>
    );
  }

  return (
    <div className="survey-attachment">
      <div className="survey-header">
        <div className="survey-title">
          <span className="survey-icon">📝</span>
          <h3>{survey.title}</h3>
        </div>

        {survey.description && (
          <p className="survey-description">{survey.description}</p>
        )}

        <div className="survey-progress">
          <span>Раздел {currentSectionIndex + 1} из {survey.sections.length}</span>
          <div className="survey-progress-bar">
            <div 
              className="survey-progress-fill" 
              style={{ width: `${((currentSectionIndex + 1) / survey.sections.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="survey-section">
        <h4 className="section-title">{currentSection.title}</h4>
        
        {currentSection.description && (
          <p className="section-description">{currentSection.description}</p>
        )}

        <div className="survey-questions">
          {currentSection.questions.map((question) => (
            <div key={question.id} className="survey-question">
              <label className="question-label">
                {question.question}
                {question.required && <span className="required">*</span>}
              </label>
              
              {question.description && (
                <p className="question-description">{question.description}</p>
              )}

              <div className="question-input">
                {renderQuestionInput(question)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="survey-footer">
        <button
          className="survey-submit-btn"
          onClick={handleNext}
          disabled={!allQuestionsAnswered()}
        >
          {isLastSection ? 'Отправить ответы' : 'Следующий раздел'}
        </button>
      </div>

      {survey.settings.expiresAt && (
        <div className="survey-expiration">
          ⏰ Опрос завершится: {new Date(survey.settings.expiresAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default SurveyAttachment;
