import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '550px',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full bg-card text-card-foreground rounded-xl border border-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 text-sm text-foreground space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-3.5 border-t border-border bg-muted/30 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
