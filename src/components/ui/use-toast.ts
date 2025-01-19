'use client';

import { useState, useCallback } from 'react';

interface ToastOptions {
  description: string;
  variant?: 'success' | 'error' | 'default';
  duration?: number;
}

export function useToast() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<'success' | 'error' | 'default'>('default');

  const toast = useCallback(({ description, variant = 'default', duration = 2000 }: ToastOptions) => {
    setMessage(description);
    setVariant(variant);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, duration);
  }, []);

  return {
    toast,
    toastState: {
      open,
      message,
      variant,
      onClose: () => setOpen(false),
    },
  };
}
