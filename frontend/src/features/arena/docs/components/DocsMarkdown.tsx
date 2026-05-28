import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DOCS } from '../data/docsData';

const IconCopy = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconLink = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

interface DocsMarkdownProps {
  content: string;
  dark: boolean;
  border: string;
  textMain: string;
  textMuted: string;
  onNavigate: (id: string) => void;
}

function CodeBlock({ code, language, dark }: { code: string; language?: string; dark: boolean }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ position: 'relative', marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', background: dark ? '#09090b' : '#1a1b1e', borderRadius: '6px 6px 0 0', borderBottom: `1px solid ${dark ? '#27272a' : '#2a2b2e'}` }}>
        <span style={{ fontSize: '10px', color: '#52525b', fontFamily: 'JetBrains Mono, monospace' }}>{language ?? 'bash'}</span>
        <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer', color: copied ? '#30a46c' : '#52525b', fontSize: '10px', transition: 'color 0.15s' }}>
          <IconCopy />
          {copied ? 'Copie !' : 'Copier'}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '14px 16px', background: dark ? '#09090b' : '#111113', borderRadius: '0 0 6px 6px', overflow: 'auto', fontSize: '12px', lineHeight: 1.6, fontFamily: 'JetBrains Mono, Fira Code, monospace', color: '#e4e4e7' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function DocsMarkdown({ content, dark, border, textMain, textMuted, onNavigate }: DocsMarkdownProps) {
  const mdComponents = useMemo(
    () => ({
      h1: ({ children }: { children?: React.ReactNode }) => <h1 style={{ fontSize: '20px', fontWeight: 700, color: textMain, margin: '0 0 16px 0', paddingBottom: '10px', borderBottom: `1px solid ${border}` }}>{children}</h1>,
      h2: ({ children }: { children?: React.ReactNode }) => <h2 style={{ fontSize: '15px', fontWeight: 600, color: textMain, margin: '24px 0 10px 0' }}>{children}</h2>,
      h3: ({ children }: { children?: React.ReactNode }) => <h3 style={{ fontSize: '13px', fontWeight: 600, color: textMain, margin: '16px 0 8px 0' }}>{children}</h3>,
      p: ({ children }: { children?: React.ReactNode }) => <p style={{ fontSize: '13px', color: textMuted, lineHeight: 1.8, margin: '0 0 12px 0' }}>{children}</p>,
      code: ({ inline, className, children }: { inline?: boolean; className?: string; children?: React.ReactNode }) => {
        const lang = className?.replace('language-', '');
        if (inline) {
          return <code style={{ background: dark ? '#27272a' : '#f4f4f6', color: dark ? '#7eb8ff' : '#0055e5', padding: '1px 5px', borderRadius: '3px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>{children}</code>;
        }
        return <CodeBlock code={String(children).trim()} language={lang} dark={dark} />;
      },
      pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
      table: ({ children }: { children?: React.ReactNode }) => <div style={{ overflowX: 'auto', marginBottom: '16px' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>{children}</table></div>,
      th: ({ children }: { children?: React.ReactNode }) => <th style={{ padding: '6px 12px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: textMuted, borderBottom: `1px solid ${border}`, letterSpacing: '0.4px' }}>{children}</th>,
      td: ({ children }: { children?: React.ReactNode }) => <td style={{ padding: '6px 12px', fontSize: '12px', color: textMuted, borderBottom: `1px solid ${dark ? '#18181b' : '#f4f4f4'}` }}>{children}</td>,
      blockquote: ({ children }: { children?: React.ReactNode }) => <blockquote style={{ borderLeft: '3px solid #4d8fff', margin: '12px 0', paddingLeft: '14px', color: textMuted, fontStyle: 'italic' }}>{children}</blockquote>,
      ul: ({ children }: { children?: React.ReactNode }) => <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0', color: textMuted, fontSize: '13px', lineHeight: 1.8 }}>{children}</ul>,
      ol: ({ children }: { children?: React.ReactNode }) => <ol style={{ paddingLeft: '20px', margin: '0 0 12px 0', color: textMuted, fontSize: '13px', lineHeight: 1.8 }}>{children}</ol>,
      li: ({ children }: { children?: React.ReactNode }) => <li style={{ marginBottom: '2px' }}>{children}</li>,
      strong: ({ children }: { children?: React.ReactNode }) => <strong style={{ color: textMain, fontWeight: 600 }}>{children}</strong>,
      a: ({ href, children }: { href?: string; children?: React.ReactNode }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#4d8fff', textDecoration: 'none' }}>{children}</a>,
    }),
    [border, dark, textMain, textMuted],
  );

  const parts = content.split(/(\[\[.*?\]\])/g);

  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[\[(.*?)\]\]$/);
        if (!match) {
          return (
            <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={mdComponents}>
              {part}
            </ReactMarkdown>
          );
        }

        const title = match[1];
        const target = DOCS.find((doc) => doc.title === title || doc.id === title.toLowerCase().replace(/\s+/g, '-'));
        if (!target) {
          return (
            <span key={i} style={{ color: '#4d8fff' }}>
              {title}
            </span>
          );
        }
        return (
          <span key={i} onClick={() => onNavigate(target.id)} style={{ color: '#4d8fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <IconLink />
            {title}
          </span>
        );
      })}
    </>
  );
}
