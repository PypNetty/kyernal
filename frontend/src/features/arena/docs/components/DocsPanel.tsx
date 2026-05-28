import React, { useContext, useMemo, useState } from 'react';
import { LayoutCtx } from '../../layout/components/Layout';
import DocsMarkdown from './DocsMarkdown';
import { DOCS, FOLDERS } from '../data/docsData';

const IconFolder = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const IconFile = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);
const IconChevron = ({ open }: { open: boolean }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconSearch = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconLink = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export default function DocsPanel() {
  const { dark } = useContext(LayoutCtx);
  const [selectedId, setSelectedId] = useState<string>('apache');
  const [search, setSearch] = useState('');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    services: true,
    reseau: false,
    securite: false,
    systeme: false,
  });

  const border = dark ? '#1f1f1f' : '#e8e8e5';
  const bg = dark ? '#111215' : '#f7f7f9';
  const bgContent = dark ? '#09090b' : '#ffffff';
  const textMain = dark ? '#e4e4e7' : '#111113';
  const textMuted = dark ? '#9ca3af' : '#7b7b7b';
  const hoverBg = dark ? '#ffffff08' : '#00000007';
  const activeBg = dark ? '#ffffff12' : '#00000012';
  const inputBg = dark ? '#17181a' : '#f0f0ee';
  const treeBorder = dark ? '#27272a' : '#e4e4e4';

  const selectedDoc = useMemo(
    () => DOCS.find((doc) => doc.id === selectedId) ?? DOCS[0],
    [selectedId],
  );

  const filteredDocs = search
    ? DOCS.filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.content.toLowerCase().includes(search.toLowerCase()),
      )
    : null;

  const toggleFolder = (id: string) => {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif', background: bg }}>
      <div style={{ width: '220px', flexShrink: 0, borderRight: `1px solid ${border}`, display: 'flex', flexDirection: 'column', background: bg }}>
        <div style={{ padding: '12px 12px 8px', borderBottom: `1px solid ${border}` }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: textMain, marginBottom: '8px' }}>Docs</div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '8px', color: textMuted, pointerEvents: 'none' }}>
              <IconSearch />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              style={{ width: '100%', paddingLeft: '26px', paddingRight: '8px', height: '26px', borderRadius: '5px', border: `1px solid ${treeBorder}`, background: inputBg, color: textMain, fontSize: '11px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
          {search && filteredDocs ? (
            filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedId(doc.id);
                    setSearch('');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '5px 12px', cursor: 'pointer', background: doc.id === selectedId ? activeBg : 'transparent', color: textMuted, fontSize: '12px' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = doc.id === selectedId ? activeBg : 'transparent';
                  }}
                >
                  <span style={{ color: textMuted, opacity: 0.6 }}>
                    <IconFile />
                  </span>
                  {doc.title}
                </div>
              ))
            ) : (
              <div style={{ padding: '12px', fontSize: '12px', color: textMuted, textAlign: 'center' }}>Aucun résultat</div>
            )
          ) : (
            FOLDERS.map((folder) => {
              const pages = DOCS.filter((d) => d.folder === folder.id);
              const isOpen = openFolders[folder.id];
              return (
                <div key={folder.id}>
                  <div
                    onClick={() => toggleFolder(folder.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', cursor: 'pointer', color: textMuted, fontSize: '12px', fontWeight: 500, userSelect: 'none' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <IconChevron open={isOpen} />
                    <span style={{ color: textMuted, opacity: 0.7 }}>
                      <IconFolder />
                    </span>
                    {folder.label}
                    <span style={{ marginLeft: 'auto', fontSize: '10px', opacity: 0.5 }}>{pages.length}</span>
                  </div>
                  {isOpen &&
                    pages.map((page) => (
                      <div
                        key={page.id}
                        onClick={() => setSelectedId(page.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '4px 10px 4px 28px', cursor: 'pointer', background: page.id === selectedId ? activeBg : 'transparent', color: page.id === selectedId ? textMain : textMuted, fontSize: '12px', borderLeft: `1px solid ${treeBorder}`, marginLeft: '16px', transition: 'background 0.1s' }}
                        onMouseEnter={(e) => {
                          if (page.id !== selectedId) e.currentTarget.style.background = hoverBg;
                        }}
                        onMouseLeave={(e) => {
                          if (page.id !== selectedId) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span style={{ opacity: 0.5 }}>
                          <IconFile />
                        </span>
                        {page.title}
                      </div>
                    ))}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: bgContent, minWidth: 0 }}>
        <div style={{ height: '48px', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: `1px solid ${border}`, flexShrink: 0, gap: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>{selectedDoc.title}</span>
          {selectedDoc.related && selectedDoc.related.length > 0 && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: textMuted }}>Voir aussi :</span>
              {selectedDoc.related.map((relId) => {
                const rel = DOCS.find((d) => d.id === relId);
                if (!rel) return null;
                return (
                  <button
                    key={relId}
                    onClick={() => setSelectedId(relId)}
                    style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', border: `1px solid ${border}`, background: 'transparent', color: '#4d8fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <IconLink />
                    {rel.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 36px', maxWidth: '760px' }}>
          <DocsMarkdown content={selectedDoc.content} dark={dark} border={border} textMain={textMain} textMuted={textMuted} onNavigate={setSelectedId} />
        </div>
      </div>
    </div>
  );
}
