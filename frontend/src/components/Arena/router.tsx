import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from '@tanstack/react-router';
import React, { useContext } from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import Layout, { LayoutCtx } from './Layout';
import InboxPanel from './InboxPanel';
import MyTickets from './MyTickets';
import RetourPanel from './RetourPanel';
import ActivitePanel from './ActivitePanel';
import CompetencePanel from './CompetencePanel';
import ProjetsPanel from './ProjetsPanel';
import DocsPanel from './DocsPanel';
import StatistiquesPanel from './StatistiquesPanel';
import TicketPanel from './TicketPanel';
import TerminalPanel from './TerminalPanel';
import Landing from '../Landing/Landing';
import Login from '../Auth/Login';

// ─── NOUVEAU COMPOSANT : LE MANUEL / COURS (OBSIDIAN LIKE) ─────────────────
function CoursePanel({
  dark,
  onDragStart,
  onDrop,
  isDraggedOver,
  onDragOver,
}: any) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, 'course')}
      onDrop={(e) => onDrop(e, 'course')}
      onDragOver={onDragOver}
      style={{
        height: '100%',
        background: dark ? '#09090b' : '#fafafa',
        color: dark ? '#f4f4f5' : '#09090b',
        border: isDraggedOver ? `2px dashed #0055e5` : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: '36px',
          borderBottom: `1px solid ${dark ? '#1c1c1e' : '#e4e4e7'}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          fontSize: '11px',
          fontWeight: 600,
          color: dark ? '#71717a' : '#a1a1aa',
          cursor: 'grab',
          flexShrink: 0,
        }}
      >
        📖 MANUEL TECHNIQUE — APACHE VHOSTS
      </div>

      <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
        <h1
          style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '16px',
            letterSpacing: '-0.5px',
          }}
        >
          Configurer un Virtual Host Apache
        </h1>
        <p
          style={{
            fontSize: '13px',
            lineHeight: 1.6,
            color: dark ? '#a1a1aa' : '#52525b',
            marginBottom: '16px',
          }}
        >
          Un <strong>Virtual Host</strong> (hôte virtuel) permet à un seul
          serveur Apache d'héberger plusieurs sites web différents en se basant
          sur le nom de domaine demandé par le client.
        </p>
        <h3
          style={{
            fontSize: '13px',
            fontWeight: 600,
            marginTop: '24px',
            marginBottom: '8px',
          }}
        >
          Exemple de configuration standard :
        </h3>
        <pre
          style={{
            background: dark ? '#141416' : '#f4f4f5',
            border: `1px solid ${dark ? '#27272a' : '#e4e4e7'}`,
            padding: '16px',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'JetBrains Mono, monospace',
            overflowX: 'auto',
            color: dark ? '#e4e4e7' : '#27272a',
          }}
        >
          {`<VirtualHost *:80>
    ServerName www.monsite.fr
    DocumentRoot /var/www/monsite
    
    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>`}
        </pre>
      </div>
    </div>
  );
}

// ─── PAGES TECHNIQUES ───────────────────────────────────────────────────────

function InboxPage() {
  const { dark } = useContext(LayoutCtx);
  return <InboxPanel dark={dark} />;
}

function MyTicketsPage() {
  return <MyTickets />;
}

function TicketDetailPage() {
  const {
    dark,
    vmHost,
    loading,
    startSession,
    vertical,
    showTerminal,
    showTicket,
    showCourse,
  } = useContext(LayoutCtx);

  const [draggedOver, setDraggedOver] = React.useState<
    'term' | 'ticket' | 'course' | null
  >(null);
  const [panelOrder, setPanelOrder] = React.useState<
    ('term' | 'ticket' | 'course')[]
  >(['ticket', 'course', 'term']);

  const handleDragStart = (
    e: React.DragEvent,
    type: 'term' | 'ticket' | 'course',
  ) => {
    e.dataTransfer.setData('text/plain', type);
  };

  const handleDrop = (
    e: React.DragEvent,
    target: 'term' | 'ticket' | 'course',
  ) => {
    e.preventDefault();
    setDraggedOver(null);
    const source = e.dataTransfer.getData('text/plain') as
      | 'term'
      | 'ticket'
      | 'course';

    if (source && source !== target) {
      setPanelOrder((prevOrder) => {
        const newOrder = [...prevOrder];
        const sourceIdx = newOrder.indexOf(source);
        const targetIdx = newOrder.indexOf(target);
        newOrder[sourceIdx] = target;
        newOrder[targetIdx] = source;
        return newOrder;
      });
    }
  };

  const panelProps = {
    dark,
    vmHost,
    onDragStart: handleDragStart,
    onDrop: handleDrop,
  };

  const visiblePanels = panelOrder.filter((panelKey) => {
    if (panelKey === 'term') return showTerminal;
    if (panelKey === 'ticket') return showTicket;
    if (panelKey === 'course') return showCourse;
    return true;
  });

  if (visiblePanels.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '4px',
          color: dark ? '#71717a' : '#a1a1aa',
          fontSize: '12px',
          background: dark ? '#09090b' : '#fafafa',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <span style={{ fontWeight: 500, color: dark ? '#f4f4f5' : '#09090b' }}>
          Espace de travail vide
        </span>
        <span style={{ opacity: 0.6 }}>
          Activez un volet depuis la barre supérieure.
        </span>
      </div>
    );
  }

  return (
    <div style={{ height: '100%' }} onDragLeave={() => setDraggedOver(null)}>
      <Allotment
        key={`${vertical}-${visiblePanels.join('-')}`}
        vertical={vertical}
      >
        {visiblePanels.map((panelKey) => {
          if (panelKey === 'term') {
            return (
              <Allotment.Pane minSize={200} key="term">
                <TerminalPanel
                  {...panelProps}
                  isDraggedOver={draggedOver === 'term'}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDraggedOver('term');
                  }}
                />
              </Allotment.Pane>
            );
          }
          if (panelKey === 'ticket') {
            return (
              <Allotment.Pane minSize={200} key="ticket">
                <TicketPanel
                  {...panelProps}
                  isDraggedOver={draggedOver === 'ticket'}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDraggedOver('ticket');
                  }}
                  onStartSession={startSession}
                  loading={loading}
                />
              </Allotment.Pane>
            );
          }
          if (panelKey === 'course') {
            return (
              <Allotment.Pane minSize={200} key="course">
                <CoursePanel
                  {...panelProps}
                  isDraggedOver={draggedOver === 'course'}
                  onDragOver={(e: React.DragEvent) => {
                    e.preventDefault();
                    setDraggedOver('course');
                  }}
                />
              </Allotment.Pane>
            );
          }
          return null;
        })}
      </Allotment>
    </div>
  );
}

function RetourPage() {
  return <RetourPanel />;
}
function ActivitePage() {
  return <ActivitePanel />;
}
function CompetencePage() {
  return <CompetencePanel />;
}
function ProjetsPage() {
  return <ProjetsPanel />;
}
function RessourcePage() {
  return <DocsPanel />;
}
function StatistiquePage() {
  return <StatistiquesPanel />;
}

// ─── DEFINITION DES ROUTES — STRUCTURE INVERSÉE ──────────────────────────────

// Root vide : Pas de layout global imposé
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Routes Publiques (Plein écran)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

// Route Pivot App : Elle charge ton composant "Layout.tsx" (Sidebar + TopBar)
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: Layout,
});

// Routes Privées (Enfants de appLayoutRoute)
const inboxRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/inbox',
  component: InboxPage,
});
const ticketsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/tickets',
  component: MyTicketsPage,
});
const ticketDetailRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/tickets/$incidentId',
  component: TicketDetailPage,
});
const reviewsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/retours',
  component: RetourPage,
});
const pulseRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/activite',
  component: ActivitePage,
});
const skillsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/competences',
  component: CompetencePage,
});
const projectsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/projets',
  component: ProjetsPage,
});
const docsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/ressources',
  component: RessourcePage,
});
const insightsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/statistiques',
  component: StatistiquePage,
});
const autonomyRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/autonomie',
  component: () => <InboxPanel dark={true} />,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  appLayoutRoute.addChildren([
    inboxRoute,
    ticketsRoute,
    ticketDetailRoute,
    reviewsRoute,
    pulseRoute,
    skillsRoute,
    projectsRoute,
    docsRoute,
    insightsRoute,
    autonomyRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
