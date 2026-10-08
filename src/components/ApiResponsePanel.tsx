import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ApiResponsePanelProps {
  response: object | null;
  error: string | null;
  isLoading: boolean;
}

export function ApiResponsePanel({ response, error, isLoading }: ApiResponsePanelProps) {
  if (!response && !error && !isLoading) return null;

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${error ? 'rgba(239,68,68,0.3)' : 'rgba(37,211,102,0.3)'}`,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        background: error ? 'rgba(239,68,68,0.08)' : isLoading ? 'rgba(79,142,247,0.08)' : 'rgba(37,211,102,0.08)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        {isLoading ? (
          <><Clock size={12} color="var(--accent-blue)" />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-blue)' }}>Sending Request...</span></>
        ) : error ? (
          <><AlertCircle size={12} color="#ef4444" />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444' }}>API Error</span></>
        ) : (
          <><CheckCircle size={12} color="var(--accent-green)" />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-green)' }}>Flow Created Successfully</span></>
        )}
      </div>

      <div style={{ padding: '12px 14px' }}>
        {error ? (
          <div style={{ fontSize: 12, color: '#ef4444', fontFamily: "'JetBrains Mono', monospace" }}>{error}</div>
        ) : response ? (
          <pre style={{
            fontSize: 11,
            color: 'var(--text-secondary)',
            fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            margin: 0,
          }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        ) : null}
      </div>
    </div>
  );
}
