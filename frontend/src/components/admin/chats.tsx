'use client';

import { useState } from 'react';
import { adminApi, useAdminData, date } from './api';
import { AdminHeading, Notice, Pager } from './shared';
import { Trash2, MessageSquare, Bot, User, RefreshCw, X, ArrowLeft } from 'lucide-react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

type ChatSessionItem = {
  _id: string;
  sessionId: string;
  ip: string;
  os: string;
  browser: string;
  device: string;
  messageCount: number;
  lastMessage: string;
  lastActiveAt: string;
  createdAt: string;
};

type ChatSessionDetail = {
  _id: string;
  sessionId: string;
  ip: string;
  userAgent: string;
  os: string;
  browser: string;
  device: string;
  messages: ChatMessage[];
  lastActiveAt: string;
  createdAt: string;
};

export function ChatsManager() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sessionDetail, setSessionDetail] = useState<ChatSessionDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [message, setMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, error, reload, loading } = useAdminData<{
    sessions: ChatSessionItem[];
    total: number;
    pages: number;
  }>(`chats?page=${page}`);

  // Fetch full conversation transcript
  const openConversation = async (id: string) => {
    setSelectedId(id);
    setLoadingDetail(true);
    try {
      const res = await adminApi<{ ok: boolean; session: ChatSessionDetail }>(`chats/${id}`);
      if (res.ok) {
        setSessionDetail(res.session);
      }
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Delete conversation from database
  const deleteConversation = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this conversation from MongoDB?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await adminApi(`chats/${id}`, 'DELETE');
      setMessage('Conversation permanently deleted from database.');
      setSelectedId(null);
      setSessionDetail(null);
      reload();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <AdminHeading
        eyebrow="WEBSITE ASSISTANT"
        title="Conversations"
        text="Review questions asked by visitors and manage chatbot conversations stored in the database."
      />

      <div className="admin-toolbar">
        <button onClick={reload} className="flex items-center gap-1.5 cursor-pointer">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <Notice text={error} error />
      <Notice text={message} />

      {/* 1. TABLE VIEW: Only shown when NO conversation is selected */}
      {!selectedId && (
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <h2>Recent Conversations</h2>
            <span>{data?.total || 0} TOTAL SESSIONS</span>
          </div>

          {loading && !data && <p className="admin-empty">Loading conversations...</p>}

          {data && data.sessions.length === 0 && (
            <p className="admin-empty">No conversations recorded in the last 60 days.</p>
          )}

          {data && data.sessions.length > 0 && (
            <>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Visitor / IP</th>
                      <th>Device & OS</th>
                      <th>Last Message</th>
                      <th>Messages</th>
                      <th>Last Active</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sessions.map((item) => (
                      <tr
                        key={item._id}
                        className="cursor-pointer"
                        onClick={() => openConversation(item._id)}
                      >
                        <td>
                          <strong>{item.ip}</strong>
                          <small className="admin-mono text-[#617682]">{item.sessionId.slice(0, 10)}…</small>
                        </td>
                        <td>
                          <span className="admin-badge">{item.device}</span>
                          <small className="text-[#617682] block">{item.os} · {item.browser}</small>
                        </td>
                        <td style={{ maxWidth: '340px' }}>
                          <span className="truncate block text-xs text-[#163747]" title={item.lastMessage}>
                            {item.lastMessage ? `“${item.lastMessage}”` : '—'}
                          </span>
                        </td>
                        <td>
                          <span className="admin-badge">
                            {item.messageCount} {item.messageCount === 1 ? 'msg' : 'msgs'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap text-xs">
                          {date(item.lastActiveAt)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openConversation(item._id);
                              }}
                              className="admin-btn text-xs"
                              style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
                              title="Open transcript"
                            >
                              <MessageSquare size={13} />
                              View Thread
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(item._id);
                              }}
                              disabled={isDeleting}
                              title="Delete from database"
                              style={{
                                padding: '6px 8px',
                                background: '#fff2f0',
                                border: '1px solid #f8d0cc',
                                color: '#c53929',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pager
                page={page}
                total={data.total}
                size={10}
                onChange={(newPage) => {
                  setPage(newPage);
                  setSelectedId(null);
                  setSessionDetail(null);
                }}
              />
            </>
          )}
        </section>
      )}

      {/* 2. CONVERSATION THREAD VIEW: Shown when a conversation is selected (Table is completely hidden) */}
      {selectedId && (
        <section className="admin-panel" style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div className="admin-panel-heading" style={{ padding: '16px 24px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null);
                  setSessionDetail(null);
                }}
                className="admin-btn"
                style={{
                  padding: '7px 14px',
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 650,
                  cursor: 'pointer',
                  background: '#ffffff',
                }}
              >
                <ArrowLeft size={15} /> Back to all conversations
              </button>
              <div>
                <h2 style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={18} style={{ color: '#007e83' }} />
                  Conversation Thread
                </h2>
                <small className="text-[#617682] block text-xs mt-0.5">
                  {sessionDetail ? `${sessionDetail.device} · ${sessionDetail.os} · ${sessionDetail.browser}` : 'Loading...'}
                </small>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => deleteConversation(selectedId)}
                disabled={isDeleting}
                title="Delete from database"
                style={{
                  padding: '6px 12px',
                  background: '#fff2f0',
                  border: '1px solid #f8d0cc',
                  color: '#c53929',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Trash2 size={14} />
                <span>Delete Chat</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(null);
                  setSessionDetail(null);
                }}
                title="Close and return to table"
                style={{
                  padding: '6px 8px',
                  background: '#f1f5f7',
                  border: '1px solid #d8e2e6',
                  color: '#556975',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            {loadingDetail && (
              <p className="admin-empty" style={{ padding: '40px' }}>Loading message transcript...</p>
            )}

            {sessionDetail && (
              <>
                <div style={{
                  padding: '12px 18px',
                  background: '#f4faf9',
                  borderRadius: '8px',
                  border: '1px solid #d4eae7',
                  marginBottom: '22px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  fontSize: '13px'
                }}>
                  <div><strong style={{ color: '#092d49' }}>IP Address:</strong> {sessionDetail.ip || 'Unknown'}</div>
                  <div><strong style={{ color: '#092d49' }}>Session ID:</strong> <span className="admin-mono" style={{ fontSize: '11px' }}>{sessionDetail.sessionId}</span></div>
                  <div><strong style={{ color: '#092d49' }}>First Started:</strong> {date(sessionDetail.createdAt)}</div>
                  <div><strong style={{ color: '#092d49' }}>Environment:</strong> {sessionDetail.device} · {sessionDetail.os} · {sessionDetail.browser}</div>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  maxHeight: '560px',
                  overflowY: 'auto',
                  paddingRight: '8px',
                  marginBottom: '20px'
                }}>
                  {sessionDetail.messages.map((m, idx) => {
                    const isUser = m.role === 'user';
                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isUser ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '11px',
                          color: '#617682',
                          marginBottom: '4px'
                        }}>
                          {isUser ? (
                            <>
                              <span style={{ fontWeight: 600 }}>Visitor</span>
                              <User size={12} />
                            </>
                          ) : (
                            <>
                              <Bot size={13} style={{ color: '#007e83' }} />
                              <span style={{ fontWeight: 600 }}>Assistant</span>
                            </>
                          )}
                          <span>·</span>
                          <span>{date(m.timestamp)}</span>
                        </div>
                        <div
                          className={isUser ? 'admin-chat-bubble-user' : 'admin-chat-bubble-assistant'}
                          style={{
                            padding: '12px 18px',
                            borderRadius: '14px',
                            borderTopRightRadius: isUser ? '2px' : '14px',
                            borderTopLeftRadius: isUser ? '14px' : '2px',
                            background: isUser ? '#007e83' : '#ffffff',
                            color: isUser ? '#ffffff' : '#092d49',
                            border: isUser ? '1px solid #006c70' : '1px solid #dce5e9',
                            maxWidth: '82%',
                            boxShadow: '0 2px 8px rgba(9, 45, 73, 0.05)',
                          }}
                        >
                          <p
                            className="whitespace-pre-wrap"
                            style={{
                              margin: 0,
                              color: isUser ? '#ffffff' : '#092d49',
                              fontSize: '13.5px',
                              lineHeight: '1.65',
                              fontWeight: isUser ? 500 : 400
                            }}
                          >
                            {m.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{
                  paddingTop: '16px',
                  borderTop: '1px solid #e5ecef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '12px', color: '#617682' }}>
                    Total {sessionDetail.messages.length} messages in this conversation
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteConversation(selectedId)}
                    disabled={isDeleting}
                    style={{
                      background: '#fff2f0',
                      border: '1px solid #f8d0cc',
                      color: '#c53929',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Trash2 size={13} />
                    Delete Chat from Database
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
}
