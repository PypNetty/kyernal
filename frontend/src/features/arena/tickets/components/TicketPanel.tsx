import React, { useState } from 'react';
import { PanelProps, TicketData } from '../../layout/context/types';

// Mock de l'Inbox
const INBOX_TICKETS: TicketData[] = [
  {
    id: "042", title: "Apache ne répond plus sur le port 80",
    description: "Le serveur web de la RH ne répond plus depuis ce matin. Le service semble planté.",
    reporter: "Utilisateur RH", duration: "10 min", server: "vm-web-rh",
    os: "Debian 13", severity: "Critique",
    objectives: [
      { text: "Diagnostiquer la cause du blocage", done: false, active: true },
      { text: "Identifier le processus sur le port 80", done: false, active: false },
      { text: "Relancer le service proprement", done: false, active: false }
    ]
  },
  {
    id: "088", title: "Problème DNS interne",
    description: "Impossible de résoudre les noms de domaine du lab. Les pings renvoient NXDOMAIN.",
    reporter: "Formateur", duration: "1 heure", server: "vm-dns-master",
    os: "Debian 13", severity: "Moyen",
    objectives: [
      { text: "Vérifier l'état de bind9", done: false, active: true }
    ]
  }
];

interface TicketPanelProps extends PanelProps {
  onStartSession: (incidentId: string) => void;
  loading: boolean;
}

export default function TicketPanel({ dark, vmHost, onDragStart, onDragOver, onDrop, isDraggedOver, onStartSession, loading }: TicketPanelProps) {
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);

  // Thème brut orienté terminal / TUI
  const bg = dark ? '#000000' : '#f5f5f5';
  const headerBg = dark ? '#111111' : '#e5e5e5';
  const border = dark ? '#333333' : '#d4d4d4';
  const text = dark ? '#888888' : '#666666';
  const highlightText = dark ? '#eeeeee' : '#111111';
  const accent = dark ? '#00ff00' : '#0066ff'; // Vert terminal ou bleu tech
  const critColor = dark ? '#ff3333' : '#cc0000';
  const warnColor = dark ? '#ffcc00' : '#aa8800';

  const getSeverityColor = (sev: string) => {
    if (sev === 'Critique') return critColor;
    if (sev === 'Moyen') return warnColor;
    return text;
  };

  // VUE LISTE (Mode "Logs")
  if (!selectedTicket) {
    return (
      <div 
        onDragOver={onDragOver} 
        onDrop={(e) => onDrop(e, 'ticket')} 
        style={{ 
          height: '100%', display: 'flex', flexDirection: 'column', background: bg, 
          outline: isDraggedOver ? `1px solid ${accent}` : 'none', 
          fontFamily: '"JetBrains Mono", "Fira Code", monospace' // Police terminal
        }}
      >
        <div style={{ height: '30px', display: 'flex', alignItems: 'center', padding: '0 8px', borderBottom: `1px solid ${border}`, background: headerBg }}>
          <span draggable onDragStart={(e) => onDragStart(e, 'ticket')} style={{ fontSize: '11px', fontWeight: 'bold', color: highlightText, cursor: 'grab' }}>
            [=] /var/spool/tickets/inbox
          </span>
        </div>
        
        <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {/* Header des colonnes textuelles */}
          <div style={{ display: 'flex', fontSize: '11px', color: text, paddingBottom: '4px', borderBottom: `1px dashed ${border}`, marginBottom: '4px' }}>
            <span style={{ width: '40px' }}>ID</span>
            <span style={{ width: '50px' }}>SEV</span>
            <span style={{ flex: 1 }}>SUJET</span>
            <span style={{ width: '80px', textAlign: 'right' }}>CIBLE</span>
          </div>

          {/* Lignes d'incidents */}
          {INBOX_TICKETS.map(ticket => (
            <div 
              key={ticket.id} 
              onClick={() => { setSelectedTicket(ticket); onStartSession(ticket.id); }} 
              style={{ 
                display: 'flex', fontSize: '11px', color: text, padding: '4px 0', cursor: 'pointer', transition: 'background 0.1s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = dark ? '#1a1a1a' : '#e0e0e0'; e.currentTarget.style.color = highlightText; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = text; }}
            >
              <span style={{ width: '40px' }}>{ticket.id}</span>
              <span style={{ width: '50px', color: getSeverityColor(ticket.severity) }}>[{ticket.severity.substring(0,4).toUpperCase()}]</span>
              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '8px' }}>
                {ticket.title}
              </span>
              <span style={{ width: '80px', textAlign: 'right' }}>{ticket.server}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // VUE DÉTAIL (Mode "Rapport d'incident CLI")
  return (
    <div 
      onDragOver={onDragOver} 
      onDrop={(e) => onDrop(e, 'ticket')} 
      style={{ 
        height: '100%', display: 'flex', flexDirection: 'column', background: bg, 
        outline: isDraggedOver ? `1px solid ${accent}` : 'none', 
        fontFamily: '"JetBrains Mono", "Fira Code", monospace' 
      }}
    >
      <div style={{ height: '30px', display: 'flex', alignItems: 'center', padding: '0 8px', borderBottom: `1px solid ${border}`, background: headerBg }}>
        <span draggable onDragStart={(e) => onDragStart(e, 'ticket')} style={{ fontSize: '11px', fontWeight: 'bold', color: highlightText, cursor: 'grab', flex: 1 }}>
          [=] less /tickets/INC-{selectedTicket.id}.log
        </span>
        <button 
          onClick={() => setSelectedTicket(null)} 
          style={{ background: 'none', border: 'none', color: accent, cursor: 'pointer', fontSize: '11px', padding: 0 }}
        >
          [q] Quit
        </button>
      </div>
      
      <div style={{ padding: '12px', fontSize: '12px', color: text, overflowY: 'auto', lineHeight: '1.6' }}>
        <div style={{ color: highlightText, opacity: 0.5, marginBottom: '8px' }}>==================================================</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: highlightText, fontWeight: 'bold' }}>INCIDENT #{selectedTicket.id}</span>
            <span style={{ color: loading ? warnColor : accent, fontWeight: 'bold' }}>
                STATUS: {loading ? '[ PROVISIONING... ]' : '[ CONNECTED ]'}
            </span>
        </div>
        <div style={{ color: highlightText, opacity: 0.5, marginBottom: '8px' }}>==================================================</div>
        
        <div style={{ marginTop: '12px' }}>
          <span style={{ display: 'inline-block', width: '80px' }}>TARGET:</span><span style={{ color: highlightText }}>root@{selectedTicket.server}</span><br/>
          <span style={{ display: 'inline-block', width: '80px' }}>OS:</span>{selectedTicket.os}<br/>
          <span style={{ display: 'inline-block', width: '80px' }}>REPORTER:</span>{selectedTicket.reporter}
        </div>

        <div style={{ marginTop: '20px' }}>
          <span style={{ fontWeight: 'bold' }}>DESCRIPTION:</span><br/>
          <div style={{ paddingLeft: '12px', borderLeft: `2px solid ${border}`, marginTop: '8px', color: highlightText }}>
            {selectedTicket.description}
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <span style={{ fontWeight: 'bold' }}>OBJECTIVES:</span><br/>
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {selectedTicket.objectives.map((obj, i) => (
              <div key={i} style={{ color: obj.done ? text : highlightText, textDecoration: obj.done ? 'line-through' : 'none' }}>
                {obj.done ? '[x]' : '[ ]'} {obj.text} {obj.active && !obj.done && <span style={{ color: accent, fontSize: '10px', marginLeft: '8px' }}>(ACTIVE)</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}