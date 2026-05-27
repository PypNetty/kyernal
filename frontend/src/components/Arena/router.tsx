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
import RessourcesPanel from './RessourcesPanel';
import StatistiquesPanel from './StatistiquesPanel';
import TicketPanel from './TicketPanel';
import TerminalPanel from './TerminalPanel';
import Landing from '../Landing/Landing';
import Login from '../Auth/Login';

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
  } = useContext(LayoutCtx);

  const [draggedOver, setDraggedOver] = React.useState<
    'term' | 'ticket' | null
  >(null);
  const [panelOrder, setPanelOrder] = React.useState<('term' | 'ticket')[]>([
    'term',
    'ticket',
  ]);

  const handleDragStart = (e: React.DragEvent, type: 'term' | 'ticket') => {
    e.dataTransfer.setData('text/plain', type);
  };

  const handleDrop = (e: React.DragEvent, target: 'term' | 'ticket') => {
    e.preventDefault();
    setDraggedOver(null);
    const source = e.dataTransfer.getData('text/plain') as 'term' | 'ticket';

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
          gap: '6px',
          color: dark ? '#8a8a93' : '#6b6b6b',
          fontSize: '13px',
          background: dark ? '#0c0c0d' : '#fafaf9',
          fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
        }}
      >
        <span style={{ fontWeight: 500, color: dark ? '#ededed' : '#111113' }}>
          Espace de travail vide
        </span>
        <span style={{ fontSize: '11px', opacity: 0.7 }}>
          Activez le Ticket ou le Terminal depuis la barre supérieure.
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
  return <RessourcesPanel />;
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
