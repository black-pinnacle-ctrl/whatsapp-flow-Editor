import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  Copy,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  Code2,
  UploadCloud,
  Hash,
  AlertTriangle,
  Loader2,
  Send,
  X,
  ArrowDownToLine,
  ExternalLink,
} from 'lucide-react';
import { DEFAULT_FLOW_JSON } from '../types';
import type { FlowValidationError } from '../types';

interface JsonEditorProps {
  value: string;
  onChange: (val: string) => void;
  targetFlowId: string;
  targetFlowName?: string;
  onTargetFlowIdChange: (id: string) => void;
  onUpload: () => void;
  isUploading: boolean;
  uploadErrors?: FlowValidationError[] | null;
  onPublish: () => void;
  isPublishing: boolean;
  onFetchJsonFromFlowId?: () => void;
  isFetchingJson?: boolean;
  downloadUrl?: string | null;
}

export function JsonEditor({
  value,
  onChange,
  targetFlowId,
  targetFlowName,
  onTargetFlowIdChange,
  onUpload,
  isUploading,
  uploadErrors,
  onPublish,
  isPublishing,
  onFetchJsonFromFlowId,
  isFetchingJson,
  downloadUrl,
}: JsonEditorProps) {
  const [copied, setCopied] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${targetFlowName || 'whatsapp-flow'}.json`;
    const blob = new Blob([value], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      try {
        const parsed = JSON.parse(text);
        onChange(JSON.stringify(parsed, null, 2));
        setJsonError(null);
      } catch {
        setJsonError('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    onChange(JSON.stringify(DEFAULT_FLOW_JSON, null, 2));
    setJsonError(null);
  };

  const handleEditorChange = (val: string | undefined) => {
    const newVal = val ?? '';
    onChange(newVal);
    try {
      JSON.parse(newVal);
      setJsonError(null);
    } catch {
      setJsonError('Invalid JSON syntax');
    }
  };

  const toolbarBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '6px 10px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-secondary)',
    fontSize: 11,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'var(--transition)',
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Top Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          flexShrink: 0,
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Code2 size={15} color="var(--accent-blue)" />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
              FLOW JSON
            </span>
          </div>

          {jsonError ? (
            <span
              style={{
                fontSize: 10,
                padding: '2px 8px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 4,
                color: '#ef4444',
                fontWeight: 600,
              }}
            >
              ⚠ {jsonError}
            </span>
          ) : (
            <span
              style={{
                fontSize: 10,
                padding: '2px 8px',
                background: 'rgba(37,211,102,0.1)',
                border: '1px solid rgba(37,211,102,0.25)',
                borderRadius: 4,
                color: 'var(--accent-green)',
                fontWeight: 600,
              }}
            >
              ✓ Valid JSON
            </span>
          )}

          {/* Target Flow ID selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '3px 8px',
            }}
          >
            <Hash size={11} color="var(--text-muted)" />
            <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>Target Flow ID:</span>
            <input
              type="text"
              value={targetFlowId}
              onChange={e => onTargetFlowIdChange(e.target.value)}
              placeholder="e.g. 1374140127383500"
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--accent-blue)',
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                width: 140,
              }}
            />
            {targetFlowName && (
              <span
                style={{
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  borderLeft: '1px solid var(--border-color)',
                  paddingLeft: 6,
                }}
              >
                {targetFlowName}
              </span>
            )}

            {onFetchJsonFromFlowId && (
              <button
                onClick={onFetchJsonFromFlowId}
                disabled={isFetchingJson || !targetFlowId.trim()}
                title="Fetch Flow JSON from WhatsApp (GET /v3/flows/{flowId}/assets)"
                style={{
                  background: 'rgba(79, 142, 247, 0.15)',
                  border: '1px solid rgba(79, 142, 247, 0.35)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '3px 8px',
                  color: 'var(--accent-blue)',
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: isFetchingJson || !targetFlowId.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'var(--transition)',
                }}
              >
                {isFetchingJson ? (
                  <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <ArrowDownToLine size={10} />
                )}
                <span>{isFetchingJson ? 'Fetching...' : 'Fetch Live JSON'}</span>
              </button>
            )}

            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noreferrer"
                title="Open WhatsApp MMG asset URL in new tab"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  padding: '2px 5px',
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <ExternalLink size={9} />
                <span>Asset URL</span>
              </a>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            style={toolbarBtnStyle}
            onClick={handleCopy}
            title="Copy JSON to clipboard"
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-blue)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
          >
            {copied ? <CheckCircle size={12} color="var(--accent-green)" /> : <Copy size={12} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            style={toolbarBtnStyle}
            onClick={handleDownload}
            title="Download JSON to file"
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-purple)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
          >
            <Download size={12} />
            <span>Export</span>
          </button>

          <button
            style={toolbarBtnStyle}
            onClick={() => fileInputRef.current?.click()}
            title="Import JSON from your disk (e.g. registor.json)"
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-orange)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
          >
            <Upload size={12} />
            <span>Import</span>
          </button>

          <button
            style={toolbarBtnStyle}
            onClick={handleReset}
            title="Reset to default template"
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-red)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
          >
            <RefreshCw size={12} />
            <span>Reset</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleUpload}
          />

          {/* Primary Upload / Update Flow JSON button */}
          <button
            id="btn-upload-flow-json"
            onClick={onUpload}
            disabled={isUploading || !!jsonError || !targetFlowId.trim()}
            title="Update flow JSON on WhatsApp/Pinbot via POST /v3/flows/{flowId}/assets"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background:
                isUploading || !!jsonError || !targetFlowId.trim()
                  ? 'rgba(37,211,102,0.2)'
                  : 'linear-gradient(135deg, #25d366, #1aad4f)',
              color: isUploading || !!jsonError || !targetFlowId.trim() ? 'var(--text-muted)' : '#fff',
              fontSize: 11,
              fontWeight: 700,
              cursor: isUploading || !!jsonError || !targetFlowId.trim() ? 'not-allowed' : 'pointer',
              transition: 'var(--transition)',
              boxShadow:
                !isUploading && !jsonError && targetFlowId.trim()
                  ? '0 2px 12px rgba(37,211,102,0.35)'
                  : 'none',
            }}
          >
            {isUploading ? (
              <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <UploadCloud size={13} />
            )}
            <span>{isUploading ? 'Updating Flow...' : 'Update Flow JSON'}</span>
          </button>

          {/* Publish Flow Button */}
          <button
            id="btn-publish-flow"
            onClick={() => setShowPublishConfirm(true)}
            disabled={isPublishing || !targetFlowId.trim()}
            title="Publish flow to WhatsApp via POST /v3/flows/{flowId}/publish"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background:
                isPublishing || !targetFlowId.trim()
                  ? 'rgba(79, 142, 247, 0.2)'
                  : 'linear-gradient(135deg, #4f8ef7, #3b82f6)',
              color: isPublishing || !targetFlowId.trim() ? 'var(--text-muted)' : '#fff',
              fontSize: 11,
              fontWeight: 700,
              cursor: isPublishing || !targetFlowId.trim() ? 'not-allowed' : 'pointer',
              transition: 'var(--transition)',
              boxShadow:
                !isPublishing && targetFlowId.trim()
                  ? '0 2px 12px rgba(79, 142, 247, 0.35)'
                  : 'none',
            }}
          >
            {isPublishing ? (
              <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Send size={13} />
            )}
            <span>{isPublishing ? 'Publishing...' : 'Publish Flow'}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Publish */}
      {showPublishConfirm && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10, 14, 26, 0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: 440,
              width: '100%',
              padding: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Send size={16} color="var(--accent-blue)" />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Publish Flow to WhatsApp
                </span>
              </div>
              <button
                onClick={() => setShowPublishConfirm(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Are you sure you want to publish flow <strong style={{ color: 'var(--accent-blue)' }}>{targetFlowId}</strong>
              {targetFlowName ? ` (${targetFlowName})` : ''}?
            </p>

            <div
              style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
                fontSize: 11,
                color: '#fcd34d',
                lineHeight: 1.5,
              }}
            >
              ⚠️ <strong>Note:</strong> Meta WhatsApp rules state that once a flow is published, it becomes active and cannot be set back to Draft mode.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
              <button
                onClick={() => setShowPublishConfirm(false)}
                style={{
                  padding: '7px 14px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-secondary)',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPublishConfirm(false);
                  onPublish();
                }}
                style={{
                  padding: '7px 16px',
                  background: 'linear-gradient(135deg, #4f8ef7, #3b82f6)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 2px 10px rgba(79, 142, 247, 0.4)',
                }}
              >
                <Send size={12} />
                Confirm & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Warnings Banner if any */}
      {uploadErrors && uploadErrors.length > 0 && (
        <div
          style={{
            background: 'rgba(239,68,68,0.1)',
            borderBottom: '1px solid rgba(239,68,68,0.3)',
            padding: '8px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            maxHeight: 120,
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444', fontSize: 11, fontWeight: 700 }}>
            <AlertTriangle size={13} />
            <span>Meta WhatsApp Validation Error(s):</span>
          </div>
          {uploadErrors.map((err, i) => (
            <div
              key={i}
              style={{
                fontSize: 10,
                color: '#fca5a5',
                fontFamily: "'JetBrains Mono', monospace",
                paddingLeft: 18,
              }}
            >
              • {err.message || err.error}
              {err.line_start ? ` (Line ${err.line_start})` : ''}
            </div>
          ))}
        </div>
      )}

      {/* Monaco Editor */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          language="json"
          value={value}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Cascadia Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            bracketPairColorization: { enabled: true },
            renderLineHighlight: 'line',
            smoothScrolling: true,
            cursorSmoothCaretAnimation: 'on',
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
}
