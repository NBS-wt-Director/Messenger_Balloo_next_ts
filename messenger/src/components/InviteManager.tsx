'use client';

import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/stores/settings-store';
import { getTranslations } from '@/i18n';
import { Invite, UserPoints } from '@/types';
import { Copy, Trash2, Plus, Gift, Clock, Users, Check, X } from 'lucide-react';
import './InviteManager.css';

// Демо данные инвайтов
const demoInvites: Invite[] = [
  {
    id: 'inv1',
    code: 'BALL00-XY7K-9M2P',
    createdBy: 'user1',
    createdAt: Date.now() - 86400000 * 5,
    expiresAt: Date.now() + 86400000 * 45,
    isPermanent: false,
    maxUses: null,
    usedCount: 2,
    usedBy: ['user2', 'user3'],
    groupIds: ['chat1'],
    pointsReward: 4,
  },
  {
    id: 'inv2',
    code: 'BALL00-PERM-ABCD',
    createdBy: 'user1',
    createdAt: Date.now() - 86400000 * 10,
    expiresAt: 0,
    isPermanent: true,
    maxUses: null,
    usedCount: 0,
    usedBy: [],
    groupIds: [],
    pointsReward: 0,
  },
];

const defaultPoints: UserPoints = {
  userId: 'user1',
  points: 12,
  totalEarned: 14,
  totalSpent: 2,
  inviteCount: 2,
  history: [
    { id: 't1', type: 'invite_bonus', amount: 4, description: 'За приглашение 2 пользователей', createdAt: Date.now() - 86400000 * 3 },
    { id: 't2', type: 'bonus', amount: 10, description: 'Бонус за регистрацию', createdAt: Date.now() - 86400000 * 7 },
  ],
};

interface InviteManagerProps {
  userId: string;
}

export function InviteManager({ userId }: InviteManagerProps) {
  const { language, theme } = useSettingsStore();
  const translations = getTranslations(language);
  
  const [invites, setInvites] = useState<Invite[]>(demoInvites);
  const [points, setPoints] = useState<UserPoints>(defaultPoints);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [newInvite, setNewInvite] = useState({
    days: 50,
    isPermanent: false,
    groupIds: [] as string[],
  });

  // Генерировать код приглашения
  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'BALL00-';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    code += '-';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };

  // Создать приглашение
  const createInvite = () => {
    const invite: Invite = {
      id: `inv${Date.now()}`,
      code: generateCode(),
      createdBy: userId,
      createdAt: Date.now(),
      expiresAt: newInvite.isPermanent ? 0 : Date.now() + newInvite.days * 86400000,
      isPermanent: newInvite.isPermanent,
      maxUses: null,
      usedCount: 0,
      usedBy: [],
      groupIds: newInvite.groupIds,
      pointsReward: newInvite.isPermanent ? 0 : 2,
    };
    
    setInvites([invite, ...invites]);
    setShowCreateModal(false);
    setNewInvite({ days: 50, isPermanent: false, groupIds: [] });
  };

  // Удалить приглашение
  const deleteInvite = (id: string) => {
    setInvites(invites.filter(inv => inv.id !== id));
  };

  // Копировать код
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Формат даты
  const formatDate = (timestamp: number) => {
    if (timestamp === 0) return translations.forever;
    return new Date(timestamp).toLocaleDateString();
  };

  // Формат относительного времени
  const formatRelativeTime = (timestamp: number) => {
    if (timestamp === 0) return '';
    const diff = timestamp - Date.now();
    const days = Math.floor(diff / 86400000);
    if (days <= 0) return translations.expired;
    return `${days} ${translations.daysLeft}`;
  };

  return (
    <div className="space-y-6">
      {/* Баланс баллов */}
      <div 
        className="p-4 rounded-xl"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'var(--primary)' }}
          >
            <Gift size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {translations.yourPoints}
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              {points.points} {translations.points}
            </p>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <div>
            <span style={{ color: 'var(--muted-foreground)' }}>{translations.invited}: </span>
            <span style={{ color: 'var(--foreground)' }}>{points.inviteCount}</span>
          </div>
          <div>
            <span style={{ color: 'var(--muted-foreground)' }}>{translations.totalEarned}: </span>
            <span style={{ color: 'var(--foreground)' }}>{points.totalEarned}</span>
          </div>
        </div>
      </div>

      {/* Кнопка создания */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium"
        style={{ background: 'var(--primary)', color: 'white' }}
      >
        <Plus size={20} />
        {translations.createInvite}
      </button>

      {/* Список инвайтов */}
      <div className="space-y-3">
        {invites.map((invite) => (
          <div
            key={invite.id}
            className="p-4 rounded-xl"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <code 
                  className="px-2 py-1 rounded font-mono text-sm cursor-pointer"
                  style={{ background: 'var(--background)', color: 'var(--foreground)' }}
                  onClick={() => copyCode(invite.code)}
                >
                  {invite.code}
                </code>
                {copiedCode === invite.code && (
                  <Check size={16} className="text-green-500" />
                )}
              </div>
              <button
                onClick={() => deleteInvite(invite.id)}
                className="p-1 rounded hover:bg-opacity-10 hover:bg-red-500"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {invite.isPermanent ? (
                  <span>{translations.permanent}</span>
                ) : (
                  <span>{formatDate(invite.expiresAt)} ({formatRelativeTime(invite.expiresAt)})</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{invite.usedCount} {translations.used}</span>
              </div>
              {!invite.isPermanent && (
                <div className="flex items-center gap-1" style={{ color: 'var(--primary)' }}>
                  <Gift size={14} />
                  <span>+{invite.pointsReward} {translations.points}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно создания */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCreateModal(false)}
          />
          <div 
            className="relative w-full max-w-md p-6 rounded-2xl"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              {translations.createInvite}
            </h3>
            
            {/* Срок действия */}
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newInvite.isPermanent}
                  onChange={(e) => setNewInvite({ ...newInvite, isPermanent: e.target.checked })}
                  className="w-5 h-5"
                />
                <span style={{ color: 'var(--foreground)' }}>{translations.permanentInvite}</span>
              </label>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                {translations.permanentInviteHint}
              </p>
            </div>

            {!newInvite.isPermanent && (
              <div className="mb-4">
                <label className="block text-sm mb-2" style={{ color: 'var(--foreground)' }}>
                  {translations.expiryDays}: {newInvite.days}
                </label>
                <input
                  type="range"
                  min="1"
                  max="365"
                  value={newInvite.days}
                  onChange={(e) => setNewInvite({ ...newInvite, days: parseInt(e.target.value) })}
                  className="w-full"
                />
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                  +2 {translations.points} за каждое приглашение
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-xl font-medium"
                style={{ background: 'var(--background)', color: 'var(--foreground)' }}
              >
                {translations.cancel}
              </button>
              <button
                onClick={createInvite}
                className="flex-1 py-3 rounded-xl font-medium"
                style={{ background: 'var(--primary)', color: 'white' }}
              >
                {translations.create}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
