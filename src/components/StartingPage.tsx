import React, { useState } from 'react';
import {
  MessageSquare,
  Key,
  Hash,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Smartphone,
  Code2,
  CheckCircle2,
  HelpCircle,
  Zap,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { listFlows } from '../api';

interface StartingPageProps {
  initialWabaId: string;
  initialApiKey: string;
  onConnect: (wabaId: string, apiKey: string) => void;
}

const DEMO_WABA_ID = '1681961039192373';
const DEMO_API_KEY = 'f1d082de-0c89-11f1-abfb-02c8a5e042bd';

export function StartingPage({
  initialWabaId,
  initialApiKey,
  onConnect,
}: StartingPageProps) {
  const [wabaId, setWabaId] = useState(initialWabaId || '');
  const [apiKey, setApiKey] = useState(initialApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    flowCount?: number;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleUseDemo = () => {
    setWabaId(DEMO_WABA_ID);
    setApiKey(DEMO_API_KEY);
    setFormError(null);
    setTestResult(null);
  };

  const handleClear = () => {
    setWabaId('');
    setApiKey('');
    setFormError(null);
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    const cleanWaba = wabaId.trim();
    const cleanKey = apiKey.trim();

    if (!cleanWaba) {
      setFormError('Please enter a WABA ID to test connection');
      return;
    }
    if (!cleanKey) {
      setFormError('Please enter an API Key to test connection');
      return;
    }

    setFormError(null);
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await listFlows(cleanWaba, cleanKey);
      const flows = res.data || [];
      setTestResult({
        success: true,
        message: `Connected successfully! Found ${flows.length} existing flow(s).`,
        flowCount: flows.length,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection test failed';
      setTestResult({
        success: false,
        message: msg,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWaba = wabaId.trim();
    const cleanKey = apiKey.trim();

    if (!cleanWaba) {
      setFormError('WhatsApp Business Account ID (WABA ID) is required.');
      return;
    }
    if (!cleanKey) {
      setFormError('Partner API Key is required.');
      return;
    }

    setFormError(null);
    onConnect(cleanWaba, cleanKey);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(ellipse at 50% 0%, #112035 0%, #0a0e1a 70%)',
      color: 'var(--text-primary)',
      overflowY: 'auto',
      position: 'relative',
    }}>
      {/* Decorative background glow circles */}
      <div style={{
        position: 'absolute',
        top: -120,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 600,
        height: 350,
        background: 'radial-gradient(circle, rgba(37,211,102,0.15) 0%, rgba(37,211,102,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Top minimal header */}
      <header style={{
        height: 64,
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #25d366, #1aad4f)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
          }}>
            <MessageSquare size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>
              WhatsApp Flow Studio
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              Meta WhatsApp Flows Builder & Publisher
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 12px',
          background: 'rgba(37,211,102,0.08)',
          border: '1px solid rgba(37,211,102,0.2)',
          borderRadius: 20,
          fontSize: 11,
          color: 'var(--accent-green)',
          fontWeight: 600,
        }}>
          <Sparkles size={12} />
          <span>v7.0 Flow Engine Ready</span>
        </div>
      </header>

      {/* Center main content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        zIndex: 1,
      }}>
        <div style={{
          width: '100%',
          maxWidth: 540,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>

          {/* Hero text */}
          <div style={{ textAlign: 'center', marginBottom: 4 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(79, 142, 247, 0.1)',
              border: '1px solid rgba(79, 142, 247, 0.25)',
              borderRadius: 30,
              padding: '4px 14px',
              fontSize: 12,
              color: 'var(--accent-blue)',
              fontWeight: 600,
              marginBottom: 14,
            }}>
              <Zap size={13} />
              <span>Connect Pinbot / Meta Cloud API</span>
            </div>

            <h1 style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              marginBottom: 8,
              background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Connect Your WhatsApp Account
            </h1>

            <p style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              maxWidth: 440,
              margin: '0 auto',
            }}>
              Enter your WhatsApp Business Account (WABA) ID and Partner API Key to edit, preview, and deploy interactive Flows.
            </p>
          </div>

          {/* Credentials Card */}
          <div style={{
            background: 'rgba(20, 28, 46, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px 26px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(37,211,102,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* WABA ID Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <Hash size={13} color="var(--accent-green)" />
                    <span>WhatsApp Business Account ID (WABA ID)</span>
                  </label>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Required</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={wabaId}
                    onChange={(e) => {
                      setWabaId(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="e.g. 1681961039192373"
                    autoFocus
                    style={{
                      width: '100%',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 14px',
                      color: 'var(--text-primary)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      outline: 'none',
                      transition: 'var(--transition)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-green)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                  />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  The 15-16 digit account ID assigned to your WhatsApp Business Account.
                </div>
              </div>

              {/* API Key Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}>
                    <Key size={13} color="var(--accent-blue)" />
                    <span>Partner API Key</span>
                  </label>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Required</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="e.g. f1d082de-0c89-11f1-abfb-02c8a5e042bd"
                    style={{
                      width: '100%',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 46px 12px 14px',
                      color: 'var(--text-primary)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      outline: 'none',
                      transition: 'var(--transition)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-green)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    title={showApiKey ? 'Hide API Key' : 'Show API Key'}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 4,
                      borderRadius: 4,
                    }}
                  >
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  Used for authenticating requests with Pinbot API proxy.
                </div>
              </div>

              {/* Validation / Error banner */}
              {formError && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 12,
                  color: 'var(--accent-red)',
                }}>
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Connection Test Result */}
              {testResult && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  padding: '10px 14px',
                  background: testResult.success ? 'rgba(37, 211, 102, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${testResult.success ? 'rgba(37, 211, 102, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 12,
                  color: testResult.success ? 'var(--accent-green)' : 'var(--accent-red)',
                }}>
                  {testResult.success ? (
                    <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  ) : (
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  )}
                  <div>{testResult.message}</div>
                </div>
              )}

              {/* Quick Preset helper buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 4,
                paddingBottom: 4,
              }}>
                <button
                  type="button"
                  onClick={handleUseDemo}
                  style={{
                    background: 'rgba(37,211,102,0.1)',
                    border: '1px dashed rgba(37,211,102,0.35)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 12px',
                    color: 'var(--accent-green)',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(37,211,102,0.18)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(37,211,102,0.1)';
                  }}
                >
                  <Sparkles size={12} />
                  <span>Use Demo Credentials</span>
                </button>

                <div style={{ display: 'flex', gap: 8 }}>
                  {(wabaId || apiKey) && (
                    <button
                      type="button"
                      onClick={handleClear}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: 11,
                        cursor: 'pointer',
                        padding: '4px 8px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      Clear
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 12px',
                      color: 'var(--text-secondary)',
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: isTesting ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isTesting) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <RefreshCw size={11} className={isTesting ? 'animate-spin' : ''} style={{ animation: isTesting ? 'spin 1s linear infinite' : 'none' }} />
                    <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #25d366 0%, #1aad4f 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '13px 20px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: '0 6px 20px rgba(37,211,102,0.35)',
                  transition: 'var(--transition)',
                  marginTop: 6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,211,102,0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,211,102,0.35)';
                }}
              >
                <span>Enter Flow Studio</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Privacy & Storage Guarantee */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <ShieldCheck size={14} color="var(--accent-green)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Credentials are saved only in your local browser storage and used strictly for WhatsApp API requests.
              </span>
            </div>
          </div>

          {/* 3 feature badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}>
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: 'rgba(79, 142, 247, 0.15)',
                color: 'var(--accent-blue)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Code2 size={15} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                Monaco Editor
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Edit v7.0 Flow JSON with schema and error validation.
              </div>
            </div>

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: 'rgba(37, 211, 102, 0.15)',
                color: 'var(--accent-green)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Smartphone size={15} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                Live Phone Preview
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Instant interactive simulation of your screens and forms.
              </div>
            </div>

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: 'rgba(139, 92, 246, 0.15)',
                color: 'var(--accent-purple)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={15} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                1-Click Publish
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Sync flow assets and publish live to WhatsApp in seconds.
              </div>
            </div>
          </div>

          {/* Help note */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            color: 'var(--text-muted)',
            fontSize: 11,
            textAlign: 'center',
          }}>
            <HelpCircle size={13} />
            <span>Need credentials? Copy them from your Pinbot or Meta Business Manager account settings.</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: 11,
        color: 'var(--text-muted)',
        zIndex: 1,
      }}>
        WhatsApp Flow JSON Studio • Compatible with Meta Cloud API & Pinbot
      </footer>
    </div>
  );
}
