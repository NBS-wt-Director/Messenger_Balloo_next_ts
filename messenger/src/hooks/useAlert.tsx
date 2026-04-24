'use client';

import { useState, useCallback, ReactNode } from 'react';
import { Alert, AlertType } from '../components/ui/Alert';
import { Confirm, ConfirmType } from '../components/ui/Confirm';

interface AlertState {
  visible: boolean;
  message: string;
  type: AlertType;
}

interface ConfirmState {
  visible: boolean;
  message: string;
  type: ConfirmType;
  onConfirm: () => void;
  onCancel: () => void;
}

export function useAlert() {
  const [alertState, setAlertState] = useState<AlertState | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const showAlert = useCallback((messageOrObj: string | { message: string; type: AlertType }, type: AlertType = 'info', duration = 3000) => {
    const message = typeof messageOrObj === 'string' ? messageOrObj : messageOrObj.message;
    const alertType = typeof messageOrObj === 'object' ? messageOrObj.type : type;
    
    setAlertState({ visible: true, message, type: alertType });
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setAlertState(null);
        resolve();
      }, duration + 400);
    });
  }, []);

  const showConfirm = useCallback((
    message: string,
    type: ConfirmType = 'warning',
    confirmText = 'Подтвердить',
    cancelText = 'Отмена'
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({
        visible: true,
        message,
        type,
        onConfirm: () => {
          setConfirmState(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmState(null);
          resolve(false);
        }
      });
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState(null);
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState(null);
  }, []);

  const AlertComponent: ReactNode = alertState ? (
    <Alert
      message={alertState.message}
      type={alertState.type}
      onClose={closeAlert}
    />
  ) : null;

  const ConfirmComponent: ReactNode = confirmState ? (
    <Confirm
      message={confirmState.message}
      type={confirmState.type}
      onConfirm={confirmState.onConfirm}
      onCancel={confirmState.onCancel}
    />
  ) : null;

  return {
    alert: showAlert,
    confirm: showConfirm,
    closeAlert,
    closeConfirm,
    AlertComponent,
    ConfirmComponent
  };
}
