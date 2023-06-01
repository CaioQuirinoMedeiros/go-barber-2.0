import React, { createContext, useCallback, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ToastContainer from '../components/ToastContainer';

export interface Toast {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(toast: Omit<Toast, 'id'>): void;
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider = ({ children }: React.PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(oldToasts => oldToasts.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const { title, description, type } = toast;

    setToasts(oldToasts => [
      ...oldToasts,
      { id: uuidv4(), title, description, type },
    ]);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <ToastContainer toasts={toasts} />
      {children}
    </ToastContext.Provider>
  );
};

const useToast = (): ToastContextData => {
  const toastContext = useContext(ToastContext);

  if (!toastContext) {
    throw new Error('useToast must be used within an ToastProvider');
  }

  return toastContext;
};

export { ToastProvider, useToast };
