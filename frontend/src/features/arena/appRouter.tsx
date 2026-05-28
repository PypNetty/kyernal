import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import React, { useContext } from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';

import Layout, { LayoutCtx } from './layout/components/Layout';
import { InboxPanel } from './inbox';
import MyTickets from './tickets/components/MyTickets';
import RetourPanel from './feedback/components/RetourPanel';
import ActivitePanel from './activity/components/ActivitePanel';
import { ProjetsPanel } from './projects';
import StatistiquesPanel from './stats/components/StatistiquesPanel';
import SkillTreePanel from './skills/components/SkillTreePanel';
import { DocsPanel } from './docs';
import TicketPanel from './tickets/components/TicketPanel';
import TerminalPanel from './tickets/components/TerminalPanel';
import { getStoredSession, LoginPage, ProfilePage } from '../auth';
import { Landing } from '../landing';

function RootPage() {
  return <Outlet />;
}

function InboxPage() {
  const { dark } = useContext(LayoutCtx);
  return <InboxPanel dark={dark} />;
}

function MyTicketsPage() {
  return <MyTickets />;
}

function TicketDetailPage() {
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
function ProfilePageRoute() {
  return <ProfilePage />;
}

const rootRoute = createRootRoute({ component: RootPage });
const arenaLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'arena-layout',
  component: Layout,
  beforeLoad: ({ location }) => {
    if (!getStoredSession()) {
      const redirectTo = location.pathname + location.search;
      throw redirect({
        to: '/login',
        search: {
          redirect: redirectTo.startsWith('/') ? redirectTo : '/inbox',
        },
      });
    }
  },
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  validateSearch: (search: Record<string, unknown>) => ({
    redirect:
      typeof search.redirect === 'string' && search.redirect.startsWith('/')
        ? search.redirect
        : '/inbox',
  }),
  beforeLoad: ({ search }) => {
    if (getStoredSession()) {
      throw redirect({ to: search.redirect });
    }
  },
  component: LoginPage,
});

const inboxRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/inbox',
  component: InboxPage,
});
const ticketsRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/tickets',
  component: MyTicketsPage,
});
const ticketDetailRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/tickets/$incidentId',
  component: TicketDetailPage,
});
const reviewsRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/retours',
  component: RetourPage,
});
const pulseRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/activite',
  component: ActivitePage,
});
const skillsRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/competences',
  component: CompetencePage,
});
const projectsRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/projets',
  component: ProjetsPage,
});
const docsRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/ressources',
  component: RessourcePage,
});
const insightsRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/statistiques',
  component: StatistiquePage,
});
const autonomyRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/autonomie',
  component: AutonomiePage,
});
const profileRoute = createRoute({
  getParentRoute: () => arenaLayoutRoute,
  path: '/profil',
  component: ProfilePageRoute,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  loginRoute,
  arenaLayoutRoute.addChildren([
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
    profileRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
