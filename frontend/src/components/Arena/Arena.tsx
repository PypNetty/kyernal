import React, { useState } from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { PanelType } from './types';
import Sidebar from './Sidebar';
import TerminalPanel from './TerminalPanel';
import TicketPanel from './TicketPanel';

export default function Arena() {
  const [dark, setDark] = useState(true);
  const [vertical, setVertical] = useState(false);
  const [reverseOrder, setReverseOrder] = useState(false);
  const [draggedOver, setDraggedOver] = useState<PanelType | null>(null);
  
  // États de la VM
  const [vmHost, setVmHost] = useState<string | undefined>(undefined);
  const [vmId, setVmId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const border = dark ? '#1f1f1f' : '#e8e8e5';
  const bg = dark ? '#0c0c0d' : '#fafaf9';
  const text = dark ? '#ededed' : '#0f0f0f';

  // Nouvelle logique de démarrage liée à l'Inbox
  const startSession = async (incidentId: string) => {
    setLoading(true);
    setVmHost(undefined);
    try {
      const res = await fetch(`http://127.0.0.1:8080/arena/start?incident=${incidentId}`, { method: 'POST' });
      const data = await res.json();
      setVmHost(data.vmIP);
      setVmId(data.vmID);
    } catch (e) {
      console.error('Failed to start arena:', e);
    } finally {
      setLoading(false);
    }
  };

  const stopSession = async () => { /* Reste identique */ };
  const deleteSession = async () => { /* Reste identique */ };

  const handleDragStart = (e: React.DragEvent, type: PanelType) => { e.dataTransfer.setData('text/plain', type); };
  const handleDrop = (e: React.DragEvent, target: PanelType) => {
    e.preventDefault();
    setDraggedOver(null);
    const source = e.dataTransfer.getData('text/plain') as PanelType;
    if (source && source !== target) setReverseOrder(!reverseOrder);
  };

  const panelProps = { dark, vmHost, onDragStart: handleDragStart, onDrop: handleDrop };

  const termPanel = <TerminalPanel {...panelProps} isDraggedOver={draggedOver === 'term'} onDragOver={(e) => { e.preventDefault(); setDraggedOver('term'); }} />;
  const ticketPanel = <TicketPanel {...panelProps} isDraggedOver={draggedOver === 'ticket'} onDragOver={(e) => { e.preventDefault(); setDraggedOver('ticket'); }} onStartSession={startSession} loading={loading} />;

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: dark ? '#111113' : '#ffffff', color: text, fontFamily: 'sans-serif' }}>
      
      {/* TopBar simplifiée (plus de bouton start manuel) */}
      <div style={{ height: '40px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between', background: bg }}>
        <div style={{ fontSize: '12px' }}>Klixy Arena</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {vmHost && (
             <>
               <button onClick={stopSession}>Stop</button>
               <button onClick={deleteSession}>Delete</button>
             </>
          )}
          <button onClick={() => setVertical(!vertical)}>Layout</button>
          <button onClick={() => setDark(!dark)}>Thème</button>
        </div>
      </div>

      {/* Workspace */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }} onDragLeave={() => setDraggedOver(null)}>
        <Sidebar dark={dark} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Allotment key={`${vertical}-${reverseOrder}`} vertical={vertical}>
            <Allotment.Pane minSize={200}>{reverseOrder ? ticketPanel : termPanel}</Allotment.Pane>
            <Allotment.Pane minSize={200}>{reverseOrder ? termPanel : ticketPanel}</Allotment.Pane>
          </Allotment>
        </div>
      </div>
    </div>
  );
}