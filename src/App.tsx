import { useState, useEffect, useCallback } from 'react';
import './index.css';
import { DEFAULT_FLOW_JSON } from './types';
import type { FlowItem, FlowValidationError } from './types';
import {
  createFlow,
  listFlows,
  fetchFlowJsonByFlowId,
  uploadFlowJson,
  publishFlow,
} from './api';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/ToastContainer';
import { SettingsPanel } from './components/SettingsPanel';
import { FlowSetupForm } from './components/FlowSetupForm';
import { FlowListPanel } from './components/FlowListPanel';
import { JsonEditor } from './components/JsonEditor';
import { FlowPreview } from './components/FlowPreview';
import { ApiResponsePanel } from './components/ApiResponsePanel';
import { StartingPage } from './components/StartingPage';
import {
  MessageSquare,
  Layers,
  PlusCircle,
  ListFilter,
  Check,
  Copy,
  ChevronRight,
  Key,
} from 'lucide-react';

const LS_KEYS = {
  wabaId: 'wf_waba_id',
  apiKey: 'wf_api_key',
  flowName: 'wf_flow_name',
  categories: 'wf_categories',
  json: 'wf_json',
  targetFlowId: 'wf_target_flow_id',
  isStarted: 'wf_is_started',
};

function App() {
  const [isStarted, setIsStarted] = useState<boolean>(() => {
    return sessionStorage.getItem(LS_KEYS.isStarted) === 'true';
  });
  const [wabaId, setWabaId] = useState(() => localStorage.getItem(LS_KEYS.wabaId) || '1681961039192373');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(LS_KEYS.apiKey) || 'f1d082de-0c89-11f1-abfb-02c8a5e042bd');
  const [flowName, setFlowName] = useState(() => localStorage.getItem(LS_KEYS.flowName) || 'Flow_domicile_1');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEYS.categories) || '["OTHER"]'); } catch { return ['OTHER']; }
  });
  const [jsonStr, setJsonStr] = useState(() =>
    localStorage.getItem(LS_KEYS.json) || JSON.stringify(DEFAULT_FLOW_JSON, null, 2)
  );
  const [targetFlowId, setTargetFlowId] = useState<string>(() =>
    localStorage.getItem(LS_KEYS.targetFlowId) || '1374140127383500'
  );

  // Sidebar Tab: 'create' | 'flows'
  const [activeSidebarTab, setActiveSidebarTab] = useState<'flows' | 'create'>('flows');

  // Flows list state
  const [flows, setFlows] = useState<FlowItem[]>([]);
  const [isLoadingFlows, setIsLoadingFlows] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState<FlowItem | null>(null);
  const [isLoadingJsonId, setIsLoadingJsonId] = useState<string | null>(null);
  const [copiedFlowId, setCopiedFlowId] = useState(false);

  // Flow JSON Upload / Update / Fetch state
  const [isUploadingJson, setIsUploadingJson] = useState(false);
  const [isFetchingJson, setIsFetchingJson] = useState(false);
  const [activeDownloadUrl, setActiveDownloadUrl] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<FlowValidationError[] | null>(null);

  // Publish state
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublishingFlowId, setIsPublishingFlowId] = useState<string | null>(null);

  // Creation state
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<object | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const { toasts, addToast, removeToast } = useToast();

  // Persist settings
  useEffect(() => { localStorage.setItem(LS_KEYS.wabaId, wabaId); }, [wabaId]);
  useEffect(() => { localStorage.setItem(LS_KEYS.apiKey, apiKey); }, [apiKey]);
  useEffect(() => { localStorage.setItem(LS_KEYS.flowName, flowName); }, [flowName]);
  useEffect(() => { localStorage.setItem(LS_KEYS.categories, JSON.stringify(selectedCategories)); }, [selectedCategories]);
  useEffect(() => { localStorage.setItem(LS_KEYS.json, jsonStr); }, [jsonStr]);
  useEffect(() => { localStorage.setItem(LS_KEYS.targetFlowId, targetFlowId); }, [targetFlowId]);
  useEffect(() => { sessionStorage.setItem(LS_KEYS.isStarted, isStarted ? 'true' : 'false'); }, [isStarted]);

  // Fetch flows list
  const handleFetchFlows = useCallback(async (quiet = false, overrideWaba?: string, overrideKey?: string) => {
    const activeWaba = (overrideWaba ?? wabaId).trim();
    const activeKey = (overrideKey ?? apiKey).trim();

    if (!activeWaba || !activeKey) {
      if (!quiet) addToast('Please provide WABA ID and API key to fetch flows', 'warning');
      return;
    }

    setIsLoadingFlows(true);
    try {
      const res = await listFlows(activeWaba, activeKey);
      setFlows(res.data || []);
      if (!quiet) addToast(`Loaded ${res.data?.length || 0} flows from Pinbot API`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (!quiet) addToast(`Failed to load flows: ${msg}`, 'error');
    } finally {
      setIsLoadingFlows(false);
    }
  }, [wabaId, apiKey, addToast]);

  // Load flows when studio is active and credentials present
  useEffect(() => {
    if (isStarted && wabaId && apiKey) {
      handleFetchFlows(true);
    }
  }, [handleFetchFlows, isStarted, wabaId, apiKey]);

  const handleConnect = (newWabaId: string, newApiKey: string) => {
    setWabaId(newWabaId);
    setApiKey(newApiKey);
    setIsStarted(true);
    addToast('Connected to WhatsApp Flow Studio!', 'success');
    handleFetchFlows(false, newWabaId, newApiKey);
  };

  const handleReset = () => {
    setWabaId('');
    setApiKey('');
    setFlowName('');
    setSelectedCategories(['OTHER']);
    setJsonStr(JSON.stringify(DEFAULT_FLOW_JSON, null, 2));
    setSelectedFlow(null);
    setFlows([]);
    setApiResponse(null);
    setApiError(null);
    setUploadErrors(null);
    setIsStarted(false);
    addToast('All configuration reset', 'info');
  };

  const handleSelectFlow = (flow: FlowItem) => {
    setSelectedFlow(flow);
    setTargetFlowId(flow.id);
    setFlowName(flow.name);
    if (flow.categories?.length) {
      setSelectedCategories(flow.categories);
    }
  };

  const handleLoadFlowJson = async (flow: FlowItem) => {
    setSelectedFlow(flow);
    setTargetFlowId(flow.id);
    setFlowName(flow.name);
    if (flow.categories?.length) {
      setSelectedCategories(flow.categories);
    }

    setIsLoadingJsonId(flow.id);
    try {
      const { json, downloadUrl } = await fetchFlowJsonByFlowId(flow.id, apiKey.trim());
      setJsonStr(JSON.stringify(json, null, 2));
      setActiveDownloadUrl(downloadUrl);
      addToast(`Flow JSON for "${flow.name}" loaded into editor!`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to download flow JSON';
      addToast(msg, 'error');
    } finally {
      setIsLoadingJsonId(null);
    }
  };

  // Fetch flow JSON directly from WhatsApp by targetFlowId
  const handleFetchFlowJsonFromTargetId = async () => {
    const id = targetFlowId.trim();
    if (!id) {
      addToast('Please enter a Flow ID to fetch its JSON', 'warning');
      return;
    }
    if (!apiKey.trim()) {
      addToast('Please enter your API key', 'warning');
      return;
    }

    setIsFetchingJson(true);
    try {
      const { json, downloadUrl } = await fetchFlowJsonByFlowId(id, apiKey.trim());
      setJsonStr(JSON.stringify(json, null, 2));
      setActiveDownloadUrl(downloadUrl);
      addToast(`Live Flow JSON for Flow ID ${id} loaded into editor!`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch flow JSON';
      addToast(msg, 'error');
    } finally {
      setIsFetchingJson(false);
    }
  };

  // Upload / update flow JSON asset
  const handleUploadFlowJson = async () => {
    if (!targetFlowId.trim()) {
      addToast('Please specify a Target Flow ID to update', 'warning');
      return;
    }
    if (!apiKey.trim()) {
      addToast('Please enter your API key', 'warning');
      return;
    }

    try {
      JSON.parse(jsonStr);
    } catch {
      addToast('Cannot upload invalid JSON. Please fix syntax errors first.', 'error');
      return;
    }

    setIsUploadingJson(true);
    setUploadErrors(null);

    try {
      const result = await uploadFlowJson(targetFlowId.trim(), apiKey.trim(), jsonStr);
      if (result.validation_errors && result.validation_errors.length > 0) {
        setUploadErrors(result.validation_errors);
        addToast(`Flow JSON updated with ${result.validation_errors.length} validation warning(s)`, 'warning');
      } else {
        addToast(`Flow JSON updated successfully for Flow ID ${targetFlowId}!`, 'success');
      }
      // Refresh list to update status/validation flags
      handleFetchFlows(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      addToast(`Upload failed: ${msg}`, 'error');
    } finally {
      setIsUploadingJson(false);
    }
  };

  // Publish flow (POST /publish)
  const handlePublishFlow = async (flowIdToPublish?: string) => {
    const targetId = (flowIdToPublish || targetFlowId).trim();
    if (!targetId) {
      addToast('Please specify a Flow ID to publish', 'warning');
      return;
    }
    if (!apiKey.trim()) {
      addToast('Please enter your API key', 'warning');
      return;
    }

    setIsPublishing(true);
    setIsPublishingFlowId(targetId);

    try {
      await publishFlow(targetId, apiKey.trim());
      addToast(`Flow ID ${targetId} successfully published to WhatsApp!`, 'success');
      // Refresh list to update status badge from DRAFT to PUBLISHED
      handleFetchFlows(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Publish failed';
      addToast(`Publish failed: ${msg}`, 'error');
    } finally {
      setIsPublishing(false);
      setIsPublishingFlowId(null);
    }
  };

  const handleCreateFlow = async () => {
    if (!wabaId.trim()) { addToast('Please enter your WABA ID', 'warning'); return; }
    if (!apiKey.trim()) { addToast('Please enter your API key', 'warning'); return; }
    if (!flowName.trim()) { addToast('Please enter a flow name', 'warning'); return; }
    if (selectedCategories.length === 0) { addToast('Please select at least one category', 'warning'); return; }

    setIsLoading(true);
    setApiResponse(null);
    setApiError(null);

    try {
      const result = await createFlow(wabaId.trim(), apiKey.trim(), {
        name: flowName.trim(),
        categories: selectedCategories,
      });
      setApiResponse(result);
      if (result.id) {
        setTargetFlowId(result.id);
      }
      addToast(`Flow "${flowName}" created successfully!`, 'success');
      // Refresh list to show newly created flow
      handleFetchFlows(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error occurred';
      setApiError(msg);
      addToast(`Failed to create flow: ${msg}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySelectedId = async () => {
    const idToCopy = selectedFlow?.id || targetFlowId;
    if (!idToCopy) return;
    await navigator.clipboard.writeText(idToCopy);
    setCopiedFlowId(true);
    setTimeout(() => setCopiedFlowId(false), 2000);
  };

  const currentDisplayFlowName = selectedFlow?.id === targetFlowId ? selectedFlow.name : undefined;

  if (!isStarted) {
    return (
      <>
        <StartingPage
          initialWabaId={wabaId}
          initialApiKey={apiKey}
          onConnect={handleConnect}
        />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: 56,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        flexShrink: 0,
        boxShadow: '0 1px 20px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Logo */}
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, #25d366, #1aad4f)',
            borderRadius: 9,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37,211,102,0.35)',
          }}>
            <MessageSquare size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              WhatsApp Flow JSON Editor
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              Pinbot Partner API • WABA: {wabaId ? `${wabaId.slice(0, 6)}...` : 'Not set'}
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 10px',
            background: 'rgba(37,211,102,0.1)',
            border: '1px solid rgba(37,211,102,0.25)',
            borderRadius: 20,
            marginLeft: 4,
          }}>
            <div style={{ width: 6, height: 6, background: 'var(--accent-green)', borderRadius: '50%', animation: 'pulse-glow 2s infinite' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent-green)' }}>CONNECTED</span>
          </div>

          <button
            onClick={() => setIsStarted(false)}
            title="Change API Key or WABA ID"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 9px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'var(--transition)',
              marginLeft: 4,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'var(--accent-blue)';
              e.currentTarget.style.background = 'rgba(79, 142, 247, 0.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <Key size={11} />
            <span>Switch Account</span>
          </button>
        </div>

        {/* Selected flow info badge in header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {targetFlowId && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 10px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Target Flow:</span>
              {currentDisplayFlowName && (
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {currentDisplayFlowName}
                </span>
              )}
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: 'var(--accent-blue)',
                padding: '1px 5px',
                background: 'rgba(79, 142, 247, 0.1)',
                borderRadius: 3,
              }}>
                ID: {targetFlowId}
              </span>
              <button
                onClick={handleCopySelectedId}
                title="Copy Flow ID"
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedFlowId ? 'var(--accent-green)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 2,
                }}
              >
                {copiedFlowId ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 11 }}>
            <Layers size={12} />
            <span>v7.0 Schema</span>
            <ChevronRight size={10} />
            <span style={{ color: 'var(--text-secondary)' }}>Meta WhatsApp Flows</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '340px 1fr 310px',
        gap: 0,
        overflow: 'hidden',
      }}>
        {/* Left Sidebar */}
        <aside style={{
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-color)',
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {/* API Credentials */}
          <SettingsPanel
            wabaId={wabaId}
            apiKey={apiKey}
            onWabaIdChange={setWabaId}
            onApiKeyChange={setApiKey}
            onReset={handleReset}
            onSwitchAccount={() => setIsStarted(false)}
          />

          {/* Navigation Tab Switcher */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-input)',
            padding: 3,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}>
            <button
              onClick={() => setActiveSidebarTab('flows')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '7px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeSidebarTab === 'flows' ? 'var(--bg-card)' : 'transparent',
                color: activeSidebarTab === 'flows' ? 'var(--accent-green)' : 'var(--text-secondary)',
                fontWeight: activeSidebarTab === 'flows' ? 600 : 500,
                fontSize: 11,
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <ListFilter size={13} />
              <span>Flows ({flows.length})</span>
            </button>

            <button
              onClick={() => setActiveSidebarTab('create')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '7px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: activeSidebarTab === 'create' ? 'var(--bg-card)' : 'transparent',
                color: activeSidebarTab === 'create' ? 'var(--accent-green)' : 'var(--text-secondary)',
                fontWeight: activeSidebarTab === 'create' ? 600 : 500,
                fontSize: 11,
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <PlusCircle size={13} />
              <span>Create New</span>
            </button>
          </div>

          {/* Tab Content */}
          {activeSidebarTab === 'flows' ? (
            <FlowListPanel
              flows={flows}
              selectedFlowId={targetFlowId}
              isLoading={isLoadingFlows}
              onRefresh={() => handleFetchFlows(false)}
              onSelectFlow={handleSelectFlow}
              onLoadFlowJson={handleLoadFlowJson}
              isLoadingJsonId={isLoadingJsonId}
              onPublishFlow={(flow) => handlePublishFlow(flow.id)}
              isPublishingFlowId={isPublishingFlowId}
            />
          ) : (
            <>
              <FlowSetupForm
                flowName={flowName}
                selectedCategories={selectedCategories}
                isLoading={isLoading}
                onFlowNameChange={setFlowName}
                onCategoriesChange={setSelectedCategories}
                onSubmit={handleCreateFlow}
              />

              <ApiResponsePanel
                response={apiResponse}
                error={apiError}
                isLoading={isLoading}
              />
            </>
          )}

          {/* Quick Guide Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.06em' }}>
              HOW TO UPDATE & PUBLISH
            </div>
            {[
              ['1', 'Select a Flow or enter its ID in "Target Flow ID"'],
              ['2', 'Import your file (e.g. registor.json) or edit directly'],
              ['3', 'Check the live phone preview on the right'],
              ['4', 'Click "Update Flow JSON" to push via POST /assets'],
              ['5', 'Click "Publish Flow" to make it live (POST /publish)'],
            ].map(([num, text]) => (
              <div key={num} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                <div style={{
                  width: 16, height: 16, background: 'var(--accent-green-glow)', border: '1px solid rgba(37,211,102,0.3)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, color: 'var(--accent-green)', flexShrink: 0,
                }}>
                  {num}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Center — JSON Editor */}
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: '14px',
          gap: 14,
          background: 'var(--bg-primary)',
        }}>
          <JsonEditor
            value={jsonStr}
            onChange={setJsonStr}
            targetFlowId={targetFlowId}
            targetFlowName={currentDisplayFlowName}
            onTargetFlowIdChange={setTargetFlowId}
            onUpload={handleUploadFlowJson}
            isUploading={isUploadingJson}
            uploadErrors={uploadErrors}
            onPublish={() => handlePublishFlow(targetFlowId)}
            isPublishing={isPublishing}
            onFetchJsonFromFlowId={handleFetchFlowJsonFromTargetId}
            isFetchingJson={isFetchingJson}
            downloadUrl={activeDownloadUrl}
          />
        </main>

        {/* Right — Flow Preview */}
        <aside style={{
          background: 'var(--bg-sidebar)',
          borderLeft: '1px solid var(--border-color)',
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          <FlowPreview jsonStr={jsonStr} />
        </aside>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
