import { useState } from 'react';
import type { FlowItem } from '../types';
import {
  RefreshCw,
  Search,
  Copy,
  Check,
  AlertTriangle,
  FolderGit2,
  FileCode,
  Tag,
  Loader2,
  Send,
} from 'lucide-react';

interface FlowListPanelProps {
  flows: FlowItem[];
  selectedFlowId: string | null;
  isLoading: boolean;
  onRefresh: () => void;
  onSelectFlow: (flow: FlowItem) => void;
  onLoadFlowJson: (flow: FlowItem) => void;
  isLoadingJsonId: string | null;
  onPublishFlow?: (flow: FlowItem) => void;
  isPublishingFlowId?: string | null;
}

export function FlowListPanel({
  flows,
  selectedFlowId,
  isLoading,
  onRefresh,
  onSelectFlow,
  onLoadFlowJson,
  isLoadingJsonId,
  onPublishFlow,
  isPublishingFlowId,
}: FlowListPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedErrorId, setExpandedErrorId] = useState<string | null>(null);

  const handleCopyId = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFlows = flows.filter(flow => {
    const q = searchTerm.toLowerCase();
    return (
      flow.name.toLowerCase().includes(q) ||
      flow.id.toLowerCase().includes(q) ||
      flow.categories?.some(c => c.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: string) => {
    let bg = 'rgba(122, 144, 176, 0.15)';
    let color = 'var(--text-secondary)';
    let border = 'rgba(122, 144, 176, 0.3)';

    if (status === 'PUBLISHED') {
      bg = 'rgba(37, 211, 102, 0.15)';
      color = 'var(--accent-green)';
      border = 'rgba(37, 211, 102, 0.3)';
    } else if (status === 'DRAFT') {
      bg = 'rgba(79, 142, 247, 0.15)';
      color = 'var(--accent-blue)';
      border = 'rgba(79, 142, 247, 0.3)';
    } else if (status === 'BLOCKED' || status === 'DEPRECATED') {
      bg = 'rgba(239, 68, 68, 0.15)';
      color = 'var(--accent-red)';
      border = 'rgba(239, 68, 68, 0.3)';
    }

    return (
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          padding: '2px 7px',
          borderRadius: 4,
          background: bg,
          color,
          border: `1px solid ${border}`,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '480px',
        overflow: 'hidden',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <FolderGit2 size={15} color="var(--accent-green)" />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
            }}
          >
            EXISTING FLOWS
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: 10,
              background: 'rgba(37, 211, 102, 0.15)',
              color: 'var(--accent-green)',
            }}
          >
            {flows.length}
          </span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh flows list"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            fontSize: 11,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'var(--transition)',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-green)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
        >
          <RefreshCw size={11} className={isLoading ? 'spin-icon' : ''} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
          <span>{isLoading ? 'Fetching...' : 'Sync'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-primary)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 10px',
          }}
        >
          <Search size={12} color="var(--text-muted)" />
          <input
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: 11,
              fontFamily: "'Inter', sans-serif",
            }}
            placeholder="Search by name, ID or category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Flow Cards List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {isLoading && flows.length === 0 ? (
          <div
            style={{
              padding: '24px 12px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 12,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-green)' }} />
            Loading flows from Pinbot API...
          </div>
        ) : filteredFlows.length === 0 ? (
          <div
            style={{
              padding: '24px 12px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 12,
            }}
          >
            {flows.length === 0
              ? 'No flows found. Click "Sync" to load flows.'
              : 'No flows match your search.'}
          </div>
        ) : (
          filteredFlows.map(flow => {
            const isSelected = selectedFlowId === flow.id;
            const hasErrors = (flow.validation_errors?.length || 0) > 0;
            const isDownloading = isLoadingJsonId === flow.id;

            return (
              <div
                key={flow.id}
                onClick={() => onSelectFlow(flow)}
                style={{
                  background: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-secondary)',
                  border: `1px solid ${isSelected ? 'var(--accent-green)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.borderColor = '#2a3d5f';
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-color)';
                }}
              >
                {/* Title + Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={flow.name}
                  >
                    {flow.name}
                  </div>
                  {getStatusBadge(flow.status)}
                </div>

                {/* Flow ID & Copy */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-input)',
                    padding: '4px 8px',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: 'var(--accent-blue)',
                      userSelect: 'all',
                    }}
                  >
                    {flow.id}
                  </span>
                  <button
                    onClick={e => handleCopyId(flow.id, e)}
                    title="Copy Flow ID"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiedId === flow.id ? 'var(--accent-green)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      fontSize: 10,
                      padding: 2,
                    }}
                  >
                    {copiedId === flow.id ? <Check size={11} /> : <Copy size={11} />}
                    {copiedId === flow.id ? 'Copied' : 'Copy'}
                  </button>
                </div>

                {/* Categories & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    {flow.categories?.map(c => (
                      <span
                        key={c}
                        style={{
                          fontSize: 9,
                          fontWeight: 500,
                          padding: '1px 5px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: 3,
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Tag size={8} /> {c}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onLoadFlowJson(flow);
                    }}
                    disabled={isDownloading}
                    title="Load Flow JSON into editor"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '3px 8px',
                      background: 'rgba(37, 211, 102, 0.1)',
                      border: '1px solid rgba(37, 211, 102, 0.25)',
                      borderRadius: 4,
                      color: 'var(--accent-green)',
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: isDownloading ? 'wait' : 'pointer',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(37, 211, 102, 0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(37, 211, 102, 0.1)';
                    }}
                  >
                    {isDownloading ? (
                      <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <FileCode size={10} />
                    )}
                    <span>{isDownloading ? 'Loading...' : 'Load JSON'}</span>
                  </button>

                  {onPublishFlow && flow.status !== 'PUBLISHED' && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onPublishFlow(flow);
                      }}
                      disabled={isPublishingFlowId === flow.id}
                      title="Publish this flow to WhatsApp via POST /publish"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 8px',
                        background: 'rgba(79, 142, 247, 0.1)',
                        border: '1px solid rgba(79, 142, 247, 0.3)',
                        borderRadius: 4,
                        color: 'var(--accent-blue)',
                        fontSize: 10,
                        fontWeight: 600,
                        cursor: isPublishingFlowId === flow.id ? 'wait' : 'pointer',
                        transition: 'var(--transition)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(79, 142, 247, 0.2)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(79, 142, 247, 0.1)';
                      }}
                    >
                      {isPublishingFlowId === flow.id ? (
                        <Loader2 size={10} style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <Send size={10} />
                      )}
                      <span>{isPublishingFlowId === flow.id ? 'Publishing...' : 'Publish'}</span>
                    </button>
                  )}
                </div>

                {/* Validation errors flag if present */}
                {hasErrors && (
                  <div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setExpandedErrorId(expandedErrorId === flow.id ? null : flow.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 10,
                        color: 'var(--accent-orange)',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <AlertTriangle size={10} />
                      <span>{flow.validation_errors?.length} validation warning(s)</span>
                      <span style={{ fontSize: 8 }}>{expandedErrorId === flow.id ? '▲' : '▼'}</span>
                    </button>

                    {expandedErrorId === flow.id && (
                      <div
                        style={{
                          marginTop: 4,
                          padding: 6,
                          background: 'rgba(245, 158, 11, 0.08)',
                          border: '1px solid rgba(245, 158, 11, 0.2)',
                          borderRadius: 4,
                          maxHeight: 100,
                          overflowY: 'auto',
                          fontSize: 9,
                          color: '#fcd34d',
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {flow.validation_errors?.map((err, ei) => (
                          <div key={ei} style={{ marginBottom: 4 }}>
                            • {err.message || err.error}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
