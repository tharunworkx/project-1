import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Info, CheckCircle2, XCircle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning', 'danger', 'info', 'success'
  requiresInput = false,
  inputLabel = 'Reason / Note',
  inputPlaceholder = 'Enter details...',
  defaultValue = '',
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(inputValue);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    if (type === 'danger') return <XCircle className="size-5 text-rose-600 dark:text-rose-400" />;
    if (type === 'warning') return <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />;
    if (type === 'success') return <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />;
    return <Info className="size-5 text-blue-600 dark:text-blue-400" />;
  };

  const getConfirmButtonVariant = () => {
    if (type === 'danger') return 'destructive';
    if (type === 'success') return 'default';
    return 'default';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="460px"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={getConfirmButtonVariant()}
            size="sm"
            onClick={handleConfirm}
            disabled={loading || (requiresInput && !inputValue.trim())}
            className={type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 p-2 rounded-full bg-muted/60">{getIcon()}</div>
        <div className="space-y-2 flex-1">
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>

          {requiresInput && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-foreground mb-1">
                {inputLabel}
              </label>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={inputPlaceholder}
                className="h-9 text-xs"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;

