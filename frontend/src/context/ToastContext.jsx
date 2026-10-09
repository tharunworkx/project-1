import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ title, message, type = 'success', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastSuccess = useCallback((message, title = 'Success') => {
    return showToast({ type: 'success', title, message });
  }, [showToast]);

  const toastError = useCallback((message, title = 'Error') => {
    return showToast({ type: 'error', title, message });
  }, [showToast]);

  const toastWarning = useCallback((message, title = 'Warning') => {
    return showToast({ type: 'warning', title, message });
  }, [showToast]);

  const toastInfo = useCallback((message, title = 'Notice') => {
    return showToast({ type: 'info', title, message });
  }, [showToast]);

  return (
    <ToastContext.Provider
      value={{
        showToast,
        removeToast,
        toastSuccess,
        toastError,
        toastWarning,
        toastInfo,
      }}
    >
      {children}
      {/* Toast container in top-right */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => {
          let bg = 'bg-card border-border text-foreground';
          let icon = <Info className="size-4.5 text-blue-500 shrink-0" />;

          if (t.type === 'success') {
            bg = 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100';
            icon = <CheckCircle2 className="size-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
          } else if (t.type === 'error') {
            bg = 'bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-100';
            icon = <AlertCircle className="size-4.5 text-rose-600 dark:text-rose-400 shrink-0" />;
          } else if (t.type === 'warning') {
            bg = 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100';
            icon = <AlertTriangle className="size-4.5 text-amber-600 dark:text-amber-400 shrink-0" />;
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto p-3.5 rounded-xl border shadow-lg flex items-start gap-3 transition-all duration-200 animate-jitter-toast-in ${bg}`}
            >
              {icon}
              <div className="flex-1 min-w-0">
                {t.title && (
                  <h4 className="text-xs font-semibold leading-tight mb-0.5">
                    {t.title}
                  </h4>
                )}
                <p className="text-xs opacity-90 leading-relaxed break-words">
                  {t.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors cursor-pointer shrink-0"
              >
                <X className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: () => {},
      removeToast: () => {},
      toastSuccess: (msg) => console.log('Toast success:', msg),
      toastError: (msg) => console.error('Toast error:', msg),
      toastWarning: (msg) => console.warn('Toast warning:', msg),
      toastInfo: (msg) => console.info('Toast info:', msg),
    };
  }
  return context;
};

export default ToastContext;

