import React, { useState } from 'react';
import { PanelProps, TicketData } from '../../layout/context/types';

// Mock de l'Inbox
const INBOX_TICKETS: TicketData[] = [
  {
    id: "042", title: "Apache ne répond plus sur le port 80",
    description: "Le serveur web de la RH ne répond plus depuis ce matin...",
    reporter: "Utilisateur RH", duration: "10 min", server: "vm-web-rh",
    os: "Debian 13", severity: "Critique",
    objectives: [
      { text: "Diagnostiquer la cause du blocage", done: false, active: true },
      { text: "Identifier le processus sur le port 80", done: false, active: false }
    ]
  },
  {
    id: "088", title: "Problème DNS interne",
    description: "Impossible de résoudre les noms de domaine du lab.",
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

  const border = dark ? '#1f1f1f' : '#e8e8e5';
  const bg = dark ? '#0c0c0d' : '#fafaf9';
  const bg2 = dark ? '#111113' : '#ffffff';
  const text = dark ? '#ededed' : '#0f0f0f';
  const text2 = dark ? '#a1a1aa' : '#6b6b6b';

  if (!selectedTicket) {
    return (
      <div onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'ticket')} style={{ height: '100%', display: 'flex', flexDirection: 'column', background: bg2, outline: isDraggedOver ? '2px dashed #0066ff' : 'none' }}>
        <div style={{ height: '36px', display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: `1px solid ${border}`, background: bg }}>
          <span draggable onDragStart={(e) => onDragStart(e, 'ticket')} style={{ fontSize: '12px', fontWeight: 600, color: text, cursor: 'grab' }}>☰ Inbox</span>
        </div>
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {INBOX_TICKETS.map(ticket => (
            <div key={ticket.id} onClick={() => { setSelectedTicket(ticket); onStartSession(ticket.id); }} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${border}`, background: bg, cursor: 'pointer' }}>
              <span style={{ fontSize: '11px', color: '#0066ff', fontWeight: 600 }}>#INC-{ticket.id}</span>
              <h4 style={{ fontSize: '13px', margin: '4px 0', color: text }}>{ticket.title}</h4>
              <p style={{ fontSize: '11px', color: text2, margin: 0 }}>{ticket.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div onDragOver={onDragOver} onDrop={(e) => onDrop(e, 'ticket')} style={{ height: '100%', display: 'flex', flexDirection: 'column', background: bg2, outline: isDraggedOver ? '2px dashed #0066ff' : 'none' }}>
       <div style={{ height: '36px', display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: `1px solid ${border}`, background: bg }}>
        <button onClick={() => setSelectedTicket(null)} style={{ background: 'none', border: 'none', color: '#0066ff', cursor: 'pointer', fontSize: '12px', padding: '0 8px 0 0' }}>← Retour</button>
        <span draggable onDragStart={(e) => onDragStart(e, 'ticket')} style={{ fontSize: '12px', fontWeight: 600, color: text, cursor: 'grab' }}>☰ Ticket #{selectedTicket.id}</span>
      </div>
      {/* ... (Ici tu peux remettre le reste de l'UI du ticket détaillé que j'avais fourni) ... */}
      <div style={{ padding: '16px' }}>
         <p style={{ fontSize: '12px', color: text }}>{loading ? 'Préparation de la VM...' : vmHost ? 'VM Prête !' : ''}</p>
      </div>
    </div>
  );
}