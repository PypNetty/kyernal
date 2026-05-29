import React, { useEffect, useState } from 'react';
import {
  INBOX_FILTERS,
  MOCK_MESSAGES,
  tagColor,
  type InboxMessage,
  type MessageType,
} from '../data/inboxData';

const IconIncident = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>;
const IconFormateur = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const IconSystem = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const IconFilter = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const IconTag = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;

export default function InboxPanel({ dark }: { dark: boolean }) {
  const [selected, setSelected] = useState<string>('1');
  const [messages, setMessages] = useState<InboxMessage[]>(MOCK_MESSAGES);
  const [filter, setFilter] = useState<'all' | MessageType>('all');
  const border = dark ? '#27282b' : '#e8e8e5';
  const bg = dark ? '#0e0f11' : '#f7f7f9';
  const bgDetail = dark ? '#111113' : '#ffffff';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const hoverBg = dark ? '#ffffff0a' : '#00000008';
  const activeBg = dark ? '#ffffff12' : '#00000012';
  const filtered = messages.filter((m) => filter === 'all' || m.type === filter);
  const selectedMsg = messages.find((m) => m.id === selected) ?? null;
  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  const handleSelect = (id: string) => {
    setSelected(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'read' } : m)));
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  useEffect(() => {
    if (!selected || messages.some((m) => m.id === selected)) return;
    const visible = messages.filter(
      (m) => filter === 'all' || m.type === filter,
    );
    setSelected(visible[0]?.id ?? '');
  }, [messages, selected, filter]);
  const typeIcon = (type: MessageType) => (type === 'incident' ? <IconIncident /> : type === 'formateur' ? <IconFormateur /> : <IconSystem />);
  const renderBody = (body: string) =>
    body.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
        j % 2 === 1 ? <strong key={j} style={{ color: textMain, fontWeight: 600 }}>{part}</strong> : <span key={j}>{part}</span>,
      );
      const finalParts = parts.map((part, j) =>
        typeof part === 'string'
          ? part.split(/`(.*?)`/g).map((p, k) =>
              k % 2 === 1 ? (
                <code key={k} style={{ background: dark ? '#1e2030' : '#f0f0f5', color: dark ? '#7eb8ff' : '#0055e5', padding: '1px 5px', borderRadius: '3px', fontSize: '12px', fontFamily: 'monospace' }}>
                  {p}
                </code>
              ) : p,
            )
          : part,
      );
      return (
        <p key={i} style={{ margin: line === '' ? '0 0 8px 0' : '0 0 4px 0', lineHeight: 1.7, fontSize: '13px', color: line.startsWith('**') ? textMain : textMuted }}>
          {finalParts}
        </p>
      );
    });

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif', background: bg }}>
      <div style={{ width: '300px', flexShrink: 0, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', background: bg }}>
        <div style={{ height: '48px', display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: `1px solid ${border}`, gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: textMain, flex: 1 }}>Boîte de réception</span>
          {unreadCount > 0 && <span style={{ background: '#0055e5', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '10px' }}>{unreadCount}</span>}
          <button style={{ width: '26px', height: '26px', border: 'none', background: 'transparent', cursor: 'pointer', color: textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px' }} title="Filtrer"><IconFilter /></button>
        </div>
        <div style={{ display: 'flex', gap: '4px', padding: '8px 12px', borderBottom: `1px solid ${border}` }}>
          {INBOX_FILTERS.map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)} style={{ padding: '3px 8px', fontSize: '11px', fontWeight: 500, borderRadius: '5px', border: 'none', cursor: 'pointer', background: filter === val ? (dark ? '#ffffff18' : '#00000012') : 'transparent', color: filter === val ? textMain : textMuted, transition: 'background 0.1s' }}>{label}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.length === 0 && (
            <div
              style={{
                padding: '24px 16px',
                textAlign: 'center',
                fontSize: '12px',
                color: textMuted,
              }}
            >
              Aucun message
            </div>
          )}
          {filtered.map((msg) => {
            const isActive = msg.id === selected;
            const isUnread = msg.status === 'unread';
            return (
              <div key={msg.id} onClick={() => handleSelect(msg.id)} style={{ padding: '10px 14px', cursor: 'pointer', background: isActive ? activeBg : 'transparent', borderBottom: `1px solid ${border}`, transition: 'background 0.1s', position: 'relative' }} onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = hoverBg; }} onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                {isUnread && <div style={{ position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)', width: '5px', height: '5px', borderRadius: '50%', background: '#0055e5' }} />}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: msg.fromColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 700, flexShrink: 0, marginTop: '1px' }}>{msg.fromInitials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '12px', fontWeight: isUnread ? 600 : 500, color: textMain, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ color: msg.fromColor, opacity: 0.8 }}>{typeIcon(msg.type)}</span>{msg.from}
                      </span>
                      <span style={{ fontSize: '11px', color: textMuted, flexShrink: 0 }}>{msg.timestamp}</span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: isUnread ? 600 : 400, color: isUnread ? textMain : textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '3px' }}>{msg.subject}</div>
                    <div style={{ fontSize: '11px', color: textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: 0.7 }}>{msg.preview}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: bgDetail, minWidth: 0 }}>
        {selectedMsg ? (
          <>
            <div style={{ height: '48px', display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: `1px solid ${border}`, gap: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: textMain, flex: 1 }}>{selectedMsg.subject}</span>
              <button
                type="button"
                onClick={() => handleDelete(selectedMsg.id)}
                title="Supprimer ce message"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '28px',
                  padding: '0 10px',
                  border: `1px solid ${border}`,
                  borderRadius: '6px',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#ef4444',
                  fontSize: '11px',
                  fontWeight: 500,
                }}
              >
                <IconTrash />
                Supprimer
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: selectedMsg.fromColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{selectedMsg.fromInitials}</div>
                <div><div style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>{selectedMsg.from}</div><div style={{ fontSize: '11px', color: textMuted }}>{selectedMsg.timestamp}</div></div>
                {selectedMsg.tags && (
                  <div style={{ display: 'flex', gap: '5px', marginLeft: 'auto', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {selectedMsg.tags.map((tag) => {
                      const c = tagColor(tag);
                      return <span key={tag} style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: 500, background: c.bg, color: c.color, display: 'flex', alignItems: 'center', gap: '4px' }}><IconTag />{tag}</span>;
                    })}
                  </div>
                )}
              </div>
              <div style={{ height: '1px', background: border, marginBottom: '20px' }} />
              <div style={{ maxWidth: '640px' }}>{renderBody(selectedMsg.body)}</div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted, fontSize: '13px' }}>Sélectionne un message</div>
        )}
      </div>
    </div>
  );
}
