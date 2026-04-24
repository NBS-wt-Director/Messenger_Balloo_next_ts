import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Account, AuthUser } from '@/types';

interface AccountsState {
  accounts: Account[];
  currentAccountId: string | null;
  
  // Действия
  addAccount: (user: AuthUser) => void;
  removeAccount: (accountId: string) => void;
  setCurrentAccount: (accountId: string) => void;
  updateAccount: (accountId: string, updates: Partial<Account>) => void;
  getCurrentAccount: () => Account | null;
  getOtherAccounts: () => Account[];
}

export const useAccountsStore = create<AccountsState>()(
  persist(
    (set, get) => ({
      accounts: [],
      currentAccountId: null,

      addAccount: (user: AuthUser) => set((state) => {
        // Проверяем, есть ли уже такой аккаунт
        const existingIndex = state.accounts.findIndex(a => a.email === user.email);
        
        if (existingIndex >= 0) {
          // Обновляем существующий и делаем активным
          const newAccounts = [...state.accounts];
          newAccounts[existingIndex] = {
            ...newAccounts[existingIndex],
            userId: user.id,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            provider: user.provider,
            isActive: true,
            lastUsed: Date.now(),
          };
          return {
            accounts: newAccounts.map(a => ({ ...a, isActive: false })),
            currentAccountId: newAccounts[existingIndex].id,
          };
        }
        
        // Новый аккаунт
        const newAccount: Account = {
          id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: user.id,
          email: user.email,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          provider: user.provider,
          isActive: true,
          lastUsed: Date.now(),
        };
        
        return {
          accounts: [...state.accounts.map(a => ({ ...a, isActive: false })), newAccount],
          currentAccountId: newAccount.id,
        };
      }),

      removeAccount: (accountId: string) => set((state) => {
        const newAccounts = state.accounts.filter(a => a.id !== accountId);
        const wasCurrent = state.currentAccountId === accountId;
        
        return {
          accounts: newAccounts,
          currentAccountId: wasCurrent 
            ? (newAccounts[0]?.id || null) 
            : state.currentAccountId,
        };
      }),

      setCurrentAccount: (accountId: string) => set((state) => ({
        accounts: state.accounts.map(a => ({
          ...a,
          isActive: a.id === accountId,
          lastUsed: a.id === accountId ? Date.now() : a.lastUsed,
        })),
        currentAccountId: accountId,
      })),

      updateAccount: (accountId: string, updates: Partial<Account>) => set((state) => ({
        accounts: state.accounts.map(a =>
          a.id === accountId ? { ...a, ...updates } : a
        ),
      })),

      getCurrentAccount: () => {
        const { accounts, currentAccountId } = get();
        return accounts.find(a => a.id === currentAccountId) || null;
      },

      getOtherAccounts: () => {
        const { accounts, currentAccountId } = get();
        return accounts.filter(a => a.id !== currentAccountId);
      },
    }),
    {
      name: 'messenger-accounts',
    }
  )
);
