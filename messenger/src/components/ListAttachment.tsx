'use client';

import React, { useState } from 'react';
import { ListAttachment, ListItem } from '@/types/attachments';
import './ListAttachment.css';

interface ListAttachmentProps {
  list: ListAttachment;
  onItemComplete: (itemId: string, completed: boolean) => void;
  isDisabled?: boolean;
}

const ListAttachment: React.FC<ListAttachmentProps> = ({
  list,
  onItemComplete,
  isDisabled = false
}) => {
  const [items, setItems] = useState<ListItem[]>(list.items);

  const completedCount = items.filter(item => item.completed).length;
  const progress = list.items.length > 0 
    ? Math.round((completedCount / list.items.length) * 100) 
    : 0;

  const handleToggleComplete = (itemId: string) => {
    if (isDisabled) return;

    const item = items.find(i => i.id === itemId);
    if (!item || item.completedBy?.length > 0) return;

    const updated = items.map(i => 
      i.id === itemId 
        ? { 
            ...i, 
            completed: !i.completed,
            completedBy: !i.completed ? [list.settings.notifyOnComplete ? 'user' : undefined].filter(Boolean) as string[] : [],
            completedAt: !i.completed ? Date.now() : undefined
          }
        : i
    );

    setItems(updated);
    onItemComplete(itemId, !item.completed);
  };

  const sortedItems = [...items].sort((a, b) => {
    if (a.completed === b.completed) return a.order - b.order;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="list-attachment">
      <div className="list-header">
        <div className="list-title">
          <span className="list-icon">📋</span>
          <h3>{list.title}</h3>
        </div>

        {list.description && (
          <p className="list-description">{list.description}</p>
        )}

        <div className="list-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">{completedCount} из {list.items.length}</span>
        </div>
      </div>

      <div className="list-items">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            className={`list-item ${item.completed ? 'completed' : ''}`}
          >
            <div 
              className="list-item-checkbox"
              onClick={() => handleToggleComplete(item.id)}
            >
              <input
                type="checkbox"
                checked={item.completed}
                readOnly
                disabled={isDisabled || (!!item.completedBy && item.completedBy.length > 0)}
              />
            </div>
            <div className="list-item-content">
              <span className={`list-item-text ${item.completed ? 'completed' : ''}`}>
                {item.text}
              </span>
              {item.description && (
                <p className="list-item-description">{item.description}</p>
              )}
              {item.completedBy && item.completedBy.length > 0 && (
                <span className="list-item-completed-by">
                  ✅ Выполнено
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="list-footer">
        <span className="list-stats">
          {progress}% выполнено
        </span>
      </div>
    </div>
  );
};

export default ListAttachment;
