'use client';

import * as React from 'react';
import { Tooltip } from '@nextui-org/react';

export interface ToastProps {
  open: boolean;
  onClose: () => void;
  message: string;
  variant?: 'success' | 'error' | 'default';
}

export function Toast({ open, onClose, message, variant = 'default' }: ToastProps) {
  const color = variant === 'success' ? 'success' : variant === 'error' ? 'danger' : 'default';

  if (!open) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Tooltip
        isOpen={true}
        onClose={onClose}
        content={message}
        color={color}
        placement="bottom"
        showArrow={true}
        className="text-sm"
      >
        <div className="w-1 h-1 opacity-0" />
      </Tooltip>
    </div>
  );
}
