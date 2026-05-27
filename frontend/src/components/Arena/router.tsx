import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
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
import SkillTreePanel from './SkillTreePanel';
import DocsPanel from './DocsPanel';
import CompetencesPanel from './CompetencesPanel';
import TicketPanel from './TicketPanel';
import TerminalPanel from './TerminalPanel';

// ─── PAGES ──────────────────────────────────────────────────────────────────

function InboxPage() {
  const { dark } = useContext(LayoutCtx);
  return <InboxPanel dark={dark} />;
}

function MyTicketsPage() {
  return <MyTickets />;
}

function TicketDetailPage() {
  const { incidentId } = ticketDetailRoute.useParams();
  const { dark, vmHost, loading, startSession, vertical } =
    useContext(LayoutCtx);

  const [draggedOver, setDraggedOver] = React.useState<
    'term' | 'ticket' | null
  >(null);
  const [reverseOrder, setReverseOrder] = React.useState(false);

  const handleDragStart = (e: React.DragEvent, type: 'term' | 'ticket') => {
    e.dataTransfer.setData('text/plain', type);
  };
  const handleDrop = (e: React.DragEvent, target: 'term' | 'ticket') => {
    e.preventDefault();
    setDraggedOver(null);
    const source = e.dataTransfer.getData('text/plain') as 'term' | 'ticket';
    if (source && source !== target) setReverseOrder((r) => !r);
  };

  const panelProps = {
    dark,
    vmHost,
    onDragStart: handleDragStart,
    onDrop: handleDrop,
  };

  const termPanel = (
    <TerminalPanel
      {...panelProps}
      isDraggedOver={draggedOver === 'term'}
      onDragOver={(e) => {
        e.preventDefault();
        setDraggedOver('term');
      }}
    />
  );
  const ticketPanel = (
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
  );

  return (
    <div style={{ height: '100%' }} onDragLeave={() => setDraggedOver(null)}>
      <Allotment key={`${vertical}-${reverseOrder}`} vertical={vertical}>
        <Allotment.Pane minSize={200}>
          {reverseOrder ? ticketPanel : termPanel}
        </Allotment.Pane>
        <Allotment.Pane minSize={200}>
          {reverseOrder ? termPanel : ticketPanel}
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

function PlaceholderPage({ name }: { name: string }) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8a8a93',
        fontSize: '13px',
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
      }}
    >
      {name} — à venir
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
  return <SkillTreePanel />;
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
function AutonomiePage() {
  return <PlaceholderPage name="Score d'autonomie" />;
}

// ─── ROUTES ─────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/inbox' });
  },
});

const inboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inbox',
  component: InboxPage,
});
const ticketsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tickets',
  component: MyTicketsPage,
});
const ticketDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tickets/$incidentId',
  component: TicketDetailPage,
});
const reviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/retours',
  component: RetourPage,
});
const pulseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/activite',
  component: ActivitePage,
});
const skillsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/competences',
  component: CompetencePage,
});
const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projets',
  component: ProjetsPage,
});
const docsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ressources',
  component: RessourcePage,
});
const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/statistiques',
  component: StatistiquePage,
});
const autonomyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/autonomie',
  component: AutonomiePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
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
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
