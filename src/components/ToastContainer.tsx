import React from 'react';
import type { Toast, ToastType } from '../hooks/useToast';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={18} />,
  error: <XCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
};

const colors: Record<ToastType, string> = {
  success: '#25d366',
  error: '#ef4444',
  info: '#4f8ef7',
  warning: '#f59e0b',
};

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            background: 'var(--bg-card)',
            border: `1px solid ${colors[toast.type]}33`,
            borderLeft: `3px solid ${colors[toast.type]}`,
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
            color: 'var(--text-primary)',
            fontSize: 13,
            fontWeight: 500,
            animation: 'toast-in 0.3s ease',
            maxWidth: 360,
            minWidth: 260,
          }}
        >
          <span style={{ color: colors[toast.type], flexShrink: 0 }}>{icons[toast.type]}</span>
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 2,
              display: 'flex',
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
