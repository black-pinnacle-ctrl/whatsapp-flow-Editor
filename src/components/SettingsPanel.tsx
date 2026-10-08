import React from 'react';
import { Key, Hash, Save, RotateCcw, LogOut } from 'lucide-react';

interface SettingsPanelProps {
  wabaId: string;
  apiKey: string;
  onWabaIdChange: (val: string) => void;
  onApiKeyChange: (val: string) => void;
  onReset: () => void;
  onSwitchAccount?: () => void;
}

export function SettingsPanel({
  wabaId,
  apiKey,
  onWabaIdChange,
  onApiKeyChange,
  onReset,
  onSwitchAccount,
}: SettingsPanelProps) {
  const [showKey, setShowKey] = React.useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 12px',
    color: 'var(--text-primary)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    outline: 'none',
    transition: 'var(--transition)',
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          API Configuration
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {onSwitchAccount && (
            <button
              onClick={onSwitchAccount}
              title="Return to starting page to change credentials"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                transition: 'var(--transition)',
                padding: '4px 6px',
                borderRadius: 'var(--radius-sm)',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-blue)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <LogOut size={11} />
              Switch
            </button>
          )}
          <button
            onClick={onReset}
            title="Reset all settings"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              transition: 'var(--transition)',
              padding: '4px 6px',
              borderRadius: 'var(--radius-sm)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-red)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <RotateCcw size={11} />
            Reset
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <Hash size={11} /> WABA ID
        </label>
        <input
          style={inputStyle}
          value={wabaId}
          onChange={e => onWabaIdChange(e.target.value)}
          placeholder="e.g. 1681961039192373"
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-green)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <Key size={11} /> API Key
        </label>
        <div style={{ position: 'relative' }}>
          <input
            style={{ ...inputStyle, paddingRight: 56 }}
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={e => onApiKeyChange(e.target.value)}
            placeholder="Enter your API key"
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-green)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
          />
          <button
            onClick={() => setShowKey(v => !v)}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            {showKey ? 'HIDE' : 'SHOW'}
          </button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 10px',
        background: 'var(--accent-green-glow)',
        border: '1px solid rgba(37,211,102,0.2)',
        borderRadius: 'var(--radius-sm)',
      }}>
        <Save size={11} color="var(--accent-green)" />
        <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Settings are auto-saved to your browser</span>
      </div>
    </div>
  );
}
