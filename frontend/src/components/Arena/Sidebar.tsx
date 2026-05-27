import React from 'react';

const NAV_ITEMS = [
  { icon: '⬡', label: 'Labs', active: true },
  { icon: '◎', label: 'Historique' },
  { icon: '⊕', label: 'Progression' },
  { icon: '⊞', label: 'Ressources' },
];

export default function Sidebar({ dark }: { dark: boolean }) {
  return (
    <div style={{
      width: '48px', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', paddingTop: '12px', gap: '4px',
      borderRight: `1px solid ${dark ? '#1f1f1f' : '#e8e8e5'}`,
      background: dark ? '#0c0c0d' : '#fafaf9',
    }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '6px', background: '#0066ff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '16px',
      }}>K</div>
      {NAV_ITEMS.map((item) => (
        <div key={item.label} title={item.label} style={{
          width: '32px', height: '32px', borderRadius: '6px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '16px', cursor: 'pointer',
          background: item.active ? (dark ? '#1f1f1f' : '#f0f0ed') : 'transparent',
          color: item.active ? (dark ? '#ededed' : '#0f0f0f') : (dark ? '#525252' : '#9b9b9b'),
        }}>
          {item.icon}
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{
        width: '26px', height: '26px', borderRadius: '50%', marginBottom: '12px',
        background: '#0066ff', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '10px', fontWeight: 600, color: '#fff',
      }}>HP</div>
    </div>
  );
}