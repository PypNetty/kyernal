import React from 'react';
import TerminalComponent from '../Terminal'; // Ajuste le chemin selon ton projet
import { PanelProps } from './types';

export default function TerminalPanel({ dark, vmHost, onDragStart, onDragOver, onDrop, isDraggedOver }: PanelProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, 'term')}
      style={{
        height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0,
        outline: isDraggedOver ? '2px dashed #0066ff' : 'none', outlineOffset: '-2px',
      }}
    >
      <div style={{
        height: '36px', display: 'flex', alignItems: 'center', padding: '0 16px', gap: '8px',
        flexShrink: 0, borderBottom: `1px solid ${dark ? '#1f1f1f' : '#e8e8e5'}`,
        background: dark ? '#0c0c0d' : '#fafaf9',
      }}>
        <span
          draggable
          onDragStart={(e) => onDragStart(e, 'term')}
          style={{ fontSize: '12px', fontWeight: 600, color: dark ? '#ededed' : '#0f0f0f', cursor: 'grab', userSelect: 'none' }}
        >
          ☰ Terminal
        </span>
        <span style={{ fontSize: '11px', color: dark ? '#525252' : '#9b9b9b' }}>
          {vmHost ?? 'En attente de connexion...'}
        </span>
        <div style={{ flex: 1 }} />
        <span style={{
          fontSize: '10px', padding: '2px 7px', borderRadius: '100px',
          border: `1px solid ${vmHost ? '#30a46c44' : '#f76b1544'}`,
          color: vmHost ? '#30a46c' : '#f76b15', background: vmHost ? '#30a46c0f' : '#f76b150f',
        }}>
          {vmHost ? '● SSH Actif' : '○ Déconnecté'}
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <TerminalComponent vmHost={vmHost} />
      </div>
    </div>
  );
}