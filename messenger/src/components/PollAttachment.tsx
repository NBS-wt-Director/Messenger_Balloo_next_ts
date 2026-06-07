'use client';

import React, { useState } from 'react';
import { PollAttachment, PollOption } from '@/types/attachments';
import './PollAttachment.css';

interface PollAttachmentProps {
  poll: PollAttachment;
  onVote: (optionIds: string[], textResponse?: string) => void;
  onTextResponse: (text: string) => void;
  isDisabled?: boolean;
}

const PollAttachment: React.FC<PollAttachmentProps> = ({
  poll,
  onVote,
  onTextResponse,
  isDisabled = false
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textResponse, setTextResponse] = useState('');
  const [hasVoted, setHasVoted] = useState(!!poll.userResponse);

  const maxVotes = poll.settings.maxVotes || 1;
  const canSelectMultiple = poll.settings.multipleChoice || maxVotes > 1;

  const handleOptionClick = (optionId: string) => {
    if (isDisabled || hasVoted) return;

    if (canSelectMultiple) {
      setSelectedOptions(prev => {
        if (prev.includes(optionId)) {
          return prev.filter(id => id !== optionId);
        }
        if (prev.length >= maxVotes) {
          return prev;
        }
        return [...prev, optionId];
      });
    } else {
      setSelectedOptions(prev => 
        prev.includes(optionId) ? [] : [optionId]
      );
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0 || isDisabled) return;
    
    onVote(selectedOptions, textResponse || undefined);
    setHasVoted(true);
  };

  const handleTextResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setTextResponse(text);
    
    if (poll.settings.allowTextResponse && text.trim()) {
      onTextResponse(text);
    }
  };

  const getOptionClass = (option: PollOption) => {
    let classes = 'poll-option';
    
    if (selectedOptions.includes(option.id)) {
      classes += ' selected';
    }
    
    if (hasVoted && !poll.settings.isAnonymous) {
      classes += ' has-votes';
    }
    
    return classes;
  };

  return (
    <div className="poll-attachment">
      <div className="poll-question">
        <span className="poll-question-icon">📊</span>
        <h3>{poll.question}</h3>
      </div>

      <div className="poll-options">
        {poll.options.map((option) => {
          const isSelected = selectedOptions.includes(option.id);
          const hasVotedData = hasVoted && option.votes > 0;
          const percentage = poll.results.totalVotes > 0 
            ? Math.round((option.votes / poll.results.totalVotes) * 100) 
            : 0;

          return (
            <div
              key={option.id}
              className={getOptionClass(option)}
              onClick={() => handleOptionClick(option.id)}
            >
              <div className="poll-option-content">
                <div className="poll-option-checkbox">
                  {canSelectMultiple ? (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                    />
                  ) : (
                    <input
                      type="radio"
                      checked={isSelected}
                      readOnly
                    />
                  )}
                </div>
                <span className="poll-option-text">{option.text}</span>
                
                {hasVotedData && (
                  <div className="poll-option-stats">
                    <div className="poll-option-bar" style={{ width: `${percentage}%` }} />
                    <span className="poll-option-votes">{option.votes} ({percentage}%)</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {poll.settings.allowTextResponse && (
        <div className="poll-text-response">
          <textarea
            placeholder="Добавить свой комментарий..."
            value={textResponse}
            onChange={handleTextResponseChange}
            disabled={isDisabled || hasVoted}
            rows={3}
          />
        </div>
      )}

      <div className="poll-footer">
        <div className="poll-info">
          <span className="poll-votes-count">
            {poll.results.totalVotes} {getVotesLabel(poll.results.totalVotes)}
          </span>
          {!poll.settings.isAnonymous && (
            <span className="poll-info-hint">Результаты видны всем</span>
          )}
        </div>

        {!hasVoted && !isDisabled && (
          <button
            className="poll-submit-btn"
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0}
          >
            {poll.settings.multipleChoice ? 'Отправить ответы' : 'Голосовать'}
          </button>
        )}

        {hasVoted && (
          <span className="poll-voted-message">✅ Вы проголосовали</span>
        )}
      </div>

      {poll.settings.expiresAt && (
        <div className="poll-expiration">
          ⏰ Голосование завершится: {new Date(poll.settings.expiresAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

const getVotesLabel = (count: number): string => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return 'голос';
  }
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
    return 'голоса';
  }
  return 'голосов';
};

export default PollAttachment;
