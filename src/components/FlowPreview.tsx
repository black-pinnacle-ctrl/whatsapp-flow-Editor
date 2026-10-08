import React from 'react';
import { Monitor, Smartphone, ChevronRight, LayoutList } from 'lucide-react';

interface ScreenPreviewProps {
  jsonStr: string;
}

interface Screen {
  id: string;
  title?: string;
  terminal?: boolean;
  layout?: {
    children?: Component[];
  };
}

interface Component {
  type?: string;
  name?: string;
  text?: string;
  label?: string;
  children?: Component[];
  'input-type'?: string;
  required?: boolean;
  'on-click-action'?: {
    name?: string;
    next?: { type?: string; name?: string };
  };
}

function renderComponent(comp: Component, idx: number): React.ReactNode {
  const key = idx;
  switch (comp.type) {
    case 'Form':
      return (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(comp.children || []).map((child, i) => renderComponent(child, i))}
        </div>
      );
    case 'TextHeading':
      return (
        <h3 key={key} style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>
          {comp.text}
        </h3>
      );
    case 'TextSubheading':
      return (
        <h4 key={key} style={{ fontSize: 14, fontWeight: 600, color: '#333', margin: 0 }}>
          {comp.text}
        </h4>
      );
    case 'TextBody':
      return (
        <p key={key} style={{ fontSize: 12, color: '#555', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
          {comp.text}
        </p>
      );
    case 'TextCaption':
      return (
        <p key={key} style={{ fontSize: 10, color: '#888', margin: 0 }}>
          {comp.text}
        </p>
      );
    case 'TextInput':
      return (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#444' }}>
            {comp.label}{comp.required && <span style={{ color: '#e53935' }}> *</span>}
          </label>
          <div style={{
            border: '1.5px solid #ddd',
            borderRadius: 8,
            padding: '7px 10px',
            fontSize: 12,
            color: '#aaa',
            background: '#fafafa',
          }}>
            {comp['input-type'] === 'email' ? 'user@example.com' : `Enter ${comp.label?.toLowerCase() || 'value'}...`}
          </div>
        </div>
      );
    case 'TextArea':
      return (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#444' }}>{comp.label}</label>
          <div style={{
            border: '1.5px solid #ddd',
            borderRadius: 8,
            padding: '7px 10px',
            fontSize: 12,
            color: '#aaa',
            background: '#fafafa',
            height: 56,
          }}>
            {comp.label}...
          </div>
        </div>
      );
    case 'Dropdown':
      return (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#444' }}>{comp.label}</label>
          <div style={{
            border: '1.5px solid #ddd',
            borderRadius: 8,
            padding: '7px 10px',
            fontSize: 12,
            color: '#aaa',
            background: '#fafafa',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <span>Select...</span>
            <ChevronRight size={12} style={{ transform: 'rotate(90deg)' }} />
          </div>
        </div>
      );
    case 'DatePicker':
      return (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#444' }}>
            {comp.label}{comp.required && <span style={{ color: '#e53935' }}> *</span>}
          </label>
          <div style={{
            border: '1.5px solid #ddd',
            borderRadius: 8,
            padding: '7px 10px',
            fontSize: 12,
            color: '#888',
            background: '#fafafa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>YYYY-MM-DD</span>
            <span style={{ fontSize: 12 }}>📅</span>
          </div>
        </div>
      );
    case 'CheckboxGroup':
    case 'RadioButtonsGroup':
      return (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#444' }}>{comp.label}</label>
          {((comp as { options?: { id: string; title?: string }[] }).options || []).slice(0, 3).map((opt: { id: string; title?: string }, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#555' }}>
              <div style={{ width: 14, height: 14, border: '1.5px solid #ccc', borderRadius: comp.type === 'CheckboxGroup' ? 3 : '50%', flexShrink: 0 }} />
              {opt.title || opt.id}
            </div>
          ))}
        </div>
      );
    case 'Image':
      return (
        <div key={key} style={{
          width: '100%',
          height: 80,
          background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#66bb6a',
          fontSize: 10,
          fontWeight: 600,
        }}>
          📷 Image
        </div>
      );
    case 'Footer':
      return (
        <div key={key} style={{
          marginTop: 8,
          background: '#25d366',
          borderRadius: 8,
          padding: '10px 14px',
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 700,
          color: '#fff',
          cursor: 'pointer',
        }}>
          {comp.label || 'Continue'}
        </div>
      );
    default:
      return (
        <div key={key} style={{ fontSize: 10, color: '#999', fontStyle: 'italic' }}>
          [{comp.type || 'Unknown Component'}]
        </div>
      );
  }
}

export function FlowPreview({ jsonStr }: ScreenPreviewProps) {
  let screens: Screen[] = [];
  let parseError = false;

  try {
    const parsed = JSON.parse(jsonStr);
    screens = Array.isArray(parsed.screens) ? parsed.screens : [];
  } catch {
    parseError = true;
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Smartphone size={14} color="var(--accent-green)" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
            LIVE PREVIEW
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Monitor size={12} color="var(--text-muted)" />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
            {screens.length} screen{screens.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {parseError ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            height: '100%',
            color: 'var(--text-muted)',
          }}>
            <span style={{ fontSize: 28 }}>⚠️</span>
            <span style={{ fontSize: 12 }}>Fix JSON errors to see preview</span>
          </div>
        ) : screens.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            height: '100%',
            color: 'var(--text-muted)',
          }}>
            <LayoutList size={28} />
            <span style={{ fontSize: 12 }}>No screens defined yet</span>
          </div>
        ) : (
          screens.map((screen, si) => (
            <div key={si} style={{ animation: 'slideIn 0.2s ease' }}>
              {/* Screen label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 8,
              }}>
                <div style={{
                  width: 20, height: 20,
                  background: 'var(--accent-green-glow)',
                  border: '1px solid rgba(37,211,102,0.3)',
                  borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9,
                  fontWeight: 700,
                  color: 'var(--accent-green)',
                }}>
                  {si + 1}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {screen.title || screen.id}
                </span>
                {screen.terminal && (
                  <span style={{
                    fontSize: 9,
                    padding: '1px 6px',
                    background: 'rgba(79,142,247,0.15)',
                    border: '1px solid rgba(79,142,247,0.3)',
                    borderRadius: 3,
                    color: 'var(--accent-blue)',
                    fontWeight: 600,
                  }}>
                    TERMINAL
                  </span>
                )}
              </div>

              {/* Phone mockup */}
              <div style={{
                background: '#fff',
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                border: '2px solid #e5e5e5',
              }}>
                {/* WhatsApp top bar */}
                <div style={{
                  background: '#075e54',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <div style={{ width: 24, height: 24, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>←</div>
                  <div style={{ width: 28, height: 28, background: '#25d366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>💬</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{screen.title || screen.id}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>WhatsApp Flow</div>
                  </div>
                </div>

                {/* Screen content */}
                <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 120 }}>
                  {screen.layout?.children?.map((comp, i) => renderComponent(comp, i))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
