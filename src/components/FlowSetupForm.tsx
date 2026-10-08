import React, { useState } from 'react';
import { FLOW_CATEGORIES } from '../types';
import { Workflow, ChevronDown, Check, Send } from 'lucide-react';

interface FlowSetupFormProps {
  flowName: string;
  selectedCategories: string[];
  isLoading: boolean;
  onFlowNameChange: (name: string) => void;
  onCategoriesChange: (cats: string[]) => void;
  onSubmit: () => void;
}

export function FlowSetupForm({
  flowName,
  selectedCategories,
  isLoading,
  onFlowNameChange,
  onCategoriesChange,
  onSubmit,
}: FlowSetupFormProps) {
  const [catOpen, setCatOpen] = useState(false);

  const toggleCategory = (val: string) => {
    if (selectedCategories.includes(val)) {
      onCategoriesChange(selectedCategories.filter(c => c !== val));
    } else {
      onCategoriesChange([...selectedCategories, val]);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 14px',
    color: 'var(--text-primary)',
    fontFamily: "'Inter', sans-serif",
    fontSize: 13,
    outline: 'none',
    transition: 'var(--transition)',
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28,
          background: 'var(--accent-green-glow)',
          border: '1px solid rgba(37,211,102,0.3)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Workflow size={14} color="var(--accent-green)" />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Flow Details
        </span>
      </div>

      {/* Flow Name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
          Flow Name <span style={{ color: 'var(--accent-red)' }}>*</span>
        </label>
        <input
          style={inputStyle}
          value={flowName}
          onChange={e => onFlowNameChange(e.target.value)}
          placeholder="e.g. Flow_domicile_1"
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-green)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
        />
        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Use underscores instead of spaces</span>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
          Categories <span style={{ color: 'var(--accent-red)' }}>*</span>
        </label>
        <button
          onClick={() => setCatOpen(v => !v)}
          style={{
            width: '100%',
            background: 'var(--bg-input)',
            border: `1px solid ${catOpen ? 'var(--accent-green)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            color: selectedCategories.length ? 'var(--text-primary)' : 'var(--text-muted)',
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'var(--transition)',
          }}
        >
          <span>
            {selectedCategories.length > 0
              ? selectedCategories.map(c => FLOW_CATEGORIES.find(fc => fc.value === c)?.label || c).join(', ')
              : 'Select categories...'}
          </span>
          <ChevronDown size={14} style={{ transform: catOpen ? 'rotate(180deg)' : 'none', transition: 'var(--transition)' }} />
        </button>

        {catOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 4,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            zIndex: 100,
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease',
          }}>
            {FLOW_CATEGORIES.map(cat => {
              const selected = selectedCategories.includes(cat.value);
              return (
                <button
                  key={cat.value}
                  onClick={() => toggleCategory(cat.value)}
                  style={{
                    width: '100%',
                    background: selected ? 'rgba(37,211,102,0.08)' : 'none',
                    border: 'none',
                    borderBottom: '1px solid var(--border-color)',
                    padding: '10px 14px',
                    color: selected ? 'var(--accent-green)' : 'var(--text-primary)',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'var(--transition)',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = selected ? 'rgba(37,211,102,0.08)' : 'none'; }}
                >
                  {cat.label}
                  {selected && <Check size={14} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        id="btn-create-flow"
        disabled={isLoading || !flowName.trim() || selectedCategories.length === 0}
        onClick={onSubmit}
        style={{
          width: '100%',
          background: isLoading || !flowName.trim() || selectedCategories.length === 0
            ? 'rgba(37,211,102,0.2)'
            : 'linear-gradient(135deg, #25d366, #1aad4f)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          padding: '11px 16px',
          color: isLoading || !flowName.trim() || selectedCategories.length === 0
            ? 'var(--text-muted)'
            : '#fff',
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          fontWeight: 600,
          cursor: isLoading || !flowName.trim() || selectedCategories.length === 0 ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'var(--transition)',
          boxShadow: !isLoading && flowName.trim() && selectedCategories.length > 0
            ? '0 4px 20px rgba(37,211,102,0.3)'
            : 'none',
        }}
      >
        {isLoading ? (
          <>
            <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
            Creating Flow...
          </>
        ) : (
          <>
            <Send size={14} />
            Create Flow via API
          </>
        )}
      </button>
    </div>
  );
}
