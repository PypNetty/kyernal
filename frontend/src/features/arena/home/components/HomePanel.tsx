import { Link } from '@tanstack/react-router';
import { type ReactNode } from 'react';
import { useAuth } from '../../../auth';
import { useAppTheme } from '../../layout/context/AppTheme';
import {
  AUTONOMY_SCORE,
  DOMAIN_COLORS,
  getLastSession,
  getMiniFeed,
  getProgressSnapshot,
  getRecommendedIncident,
  type HomeFeedItem,
  type LastSession,
  type RecommendedIncident,
} from '../data/homeData';

const DOMAIN_LABELS: Record<string, string> = {
  linux: 'Linux',
  web: 'Web',
  reseau: 'Réseau',
  securite: 'Sécurité',
  cloud: 'Cloud',
};

function SectionLabel({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}
    >
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.4px',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        {children}
      </span>
      {action}
    </div>
  );
}

function ResumeCard({
  session,
  dark,
}: {
  session: LastSession;
  dark: boolean;
}) {
  const domainColor = DOMAIN_COLORS[session.domain];

  return (
    <div
      style={{
        padding: '18px 20px',
        borderRadius: '10px',
        border: `1px solid ${dark ? '#27282b' : '#e8e8e5'}`,
        background: dark ? '#111113' : '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        minHeight: '180px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              color: domainColor,
              marginBottom: '6px',
            }}
          >
            {session.incidentId} · {DOMAIN_LABELS[session.domain]}
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--text-main)',
              lineHeight: 1.35,
              marginBottom: '6px',
            }}
          >
            {session.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Dernière activité · {session.lastActive}
          </div>
        </div>
        {session.vmActive && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              padding: '4px 8px',
              borderRadius: '5px',
              background: 'rgba(48,164,108,0.12)',
              color: '#30a46c',
              whiteSpace: 'nowrap',
              height: 'fit-content',
            }}
          >
            VM active
          </span>
        )}
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginBottom: '6px',
          }}
        >
          <span>Progression estimée</span>
          <span>{session.progressPercent}%</span>
        </div>
        <div
          style={{
            height: '6px',
            borderRadius: '999px',
            background: dark ? '#1f1f23' : '#f0f0ee',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${session.progressPercent}%`,
              height: '100%',
              borderRadius: '999px',
              background: '#f59e0b',
            }}
          />
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
          {session.hintsUsed} indice{session.hintsUsed !== 1 ? 's' : ''} utilisé
          {session.hintsUsed !== 1 ? 's' : ''}
        </div>
      </div>

      <Link
        to="/tickets/$incidentId"
        params={{ incidentId: session.ticketRouteId }}
        style={{
          alignSelf: 'flex-start',
          fontSize: '12px',
          fontWeight: 600,
          padding: '8px 14px',
          borderRadius: '7px',
          background: '#0055e5',
          color: '#ffffff',
          textDecoration: 'none',
        }}
      >
        Reprendre la session
      </Link>
    </div>
  );
}

function RecommendedCard({
  incident,
  dark,
}: {
  incident: RecommendedIncident;
  dark: boolean;
}) {
  const domainColor = DOMAIN_COLORS[incident.node.domain];
  const statusColor =
    incident.status === 'available'
      ? '#4d8fff'
      : incident.status === 'locked'
        ? '#8a8a93'
        : '#f59e0b';

  return (
    <div
      style={{
        padding: '18px 20px',
        borderRadius: '10px',
        border: `1px solid ${dark ? '#27282b' : '#e8e8e5'}`,
        background: dark ? '#111113' : '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        minHeight: '180px',
      }}
    >
      <div>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            color: domainColor,
            marginBottom: '6px',
          }}
        >
          {incident.incidentId} · +{incident.node.xp} XP
        </div>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: 'var(--text-main)',
            lineHeight: 1.35,
            marginBottom: '6px',
          }}
        >
          {incident.node.title}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {incident.node.description}
        </div>
      </div>

      <div
        style={{
          fontSize: '11px',
          color: statusColor,
          padding: '6px 10px',
          borderRadius: '6px',
          background: `${statusColor}14`,
          width: 'fit-content',
        }}
      >
        {incident.reason}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Link
          to="/tickets/$incidentId"
          params={{ incidentId: incident.ticketRouteId }}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            padding: '8px 14px',
            borderRadius: '7px',
            background: incident.status === 'locked' ? 'transparent' : '#0055e5',
            color: incident.status === 'locked' ? 'var(--text-muted)' : '#ffffff',
            border:
              incident.status === 'locked'
                ? `1px solid ${dark ? '#27282b' : '#e8e8e5'}`
                : 'none',
            textDecoration: 'none',
            pointerEvents: incident.status === 'locked' ? 'none' : 'auto',
            opacity: incident.status === 'locked' ? 0.6 : 1,
          }}
        >
          {incident.status === 'locked' ? 'Bientôt disponible' : 'Lancer le lab'}
        </Link>
        <Link
          to="/competences"
          style={{
            fontSize: '12px',
            fontWeight: 500,
            padding: '8px 14px',
            borderRadius: '7px',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            border: `1px solid ${dark ? '#27282b' : '#e8e8e5'}`,
          }}
        >
          Voir l&apos;arbre
        </Link>
      </div>
    </div>
  );
}

function AutonomyGauge({ score, dark }: { score: number; dark: boolean }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke={dark ? '#1f1f23' : '#f0f0ee'}
          strokeWidth="6"
        />
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke="#30a46c"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 42 42)"
        />
        <text
          x="42"
          y="46"
          textAnchor="middle"
          fill={dark ? '#ededed' : '#111113'}
          fontSize="16"
          fontWeight="700"
          fontFamily="-apple-system, BlinkMacSystemFont, Inter, sans-serif"
        >
          {score}
        </text>
      </svg>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
          Score d&apos;autonomie
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Résolution sans assistance
        </div>
      </div>
    </div>
  );
}

function ProgressSnapshotCard({ dark }: { dark: boolean }) {
  const snapshot = getProgressSnapshot();
  const xpPercent = Math.min(
    100,
    Math.round((snapshot.xpInLevel / snapshot.xpToNext) * 100),
  );

  return (
    <div
      style={{
        padding: '18px 20px',
        borderRadius: '10px',
        border: `1px solid ${dark ? '#27282b' : '#e8e8e5'}`,
        background: dark ? '#111113' : '#ffffff',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.9fr 1fr',
        gap: '20px',
        alignItems: 'center',
      }}
    >
      <div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Niveau ·{' '}
          <span style={{ color: snapshot.levelColor, fontWeight: 600 }}>
            {snapshot.levelLabel}
          </span>
        </div>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '8px',
          }}
        >
          {snapshot.totalXp} XP
        </div>
        <div
          style={{
            height: '6px',
            borderRadius: '999px',
            background: dark ? '#1f1f23' : '#f0f0ee',
            overflow: 'hidden',
            marginBottom: '6px',
          }}
        >
          <div
            style={{
              width: `${xpPercent}%`,
              height: '100%',
              borderRadius: '999px',
              background: snapshot.levelColor,
            }}
          />
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {snapshot.xpInLevel} / {snapshot.xpToNext} XP vers le niveau suivant
        </div>
      </div>

      <AutonomyGauge score={AUTONOMY_SCORE} dark={dark} />

      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
          Arbre de compétences
        </div>
        <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
          {snapshot.completedLabs}/{snapshot.totalLabs}
          <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '6px' }}>
            labs validés
          </span>
        </div>
        {snapshot.inProgressLab && (
          <div style={{ fontSize: '11px', color: '#f59e0b', marginBottom: '10px' }}>
            En cours · {snapshot.inProgressLab}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {snapshot.domainProgress.map(({ domain, done, total }) => (
            <div key={domain} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', width: '52px' }}>
                {DOMAIN_LABELS[domain]}
              </span>
              <div
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '999px',
                  background: dark ? '#1f1f23' : '#f0f0ee',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${total === 0 ? 0 : (done / total) * 100}%`,
                    height: '100%',
                    background: DOMAIN_COLORS[domain],
                  }}
                />
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', width: '24px' }}>
                {done}/{total}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeedRow({ item }: { item: HomeFeedItem }) {
  return (
    <Link
      to={item.href}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '8px',
        textDecoration: 'none',
        border: '1px solid var(--card-border)',
        background: 'var(--card-bg)',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          marginTop: '5px',
          flexShrink: 0,
          background: item.unread ? '#0055e5' : item.accent ?? '#8a8a93',
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: item.unread ? 600 : 500,
            color: 'var(--text-main)',
            marginBottom: '3px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.title}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.preview}
        </div>
      </div>
      <span style={{ fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0 }}>
        {item.timestamp}
      </span>
    </Link>
  );
}

export default function HomePanel() {
  const { dark } = useAppTheme();
  const { data: session } = useAuth();
  const lastSession = getLastSession();
  const recommended = getRecommendedIncident();
  const feed = getMiniFeed();

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Apprenant';
  const bg = dark ? '#0c0c0d' : '#fafaf9';
  const border = dark ? '#27282b' : '#e8e8e5';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const cardBg = dark ? '#111113' : '#ffffff';

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        background: bg,
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
        ['--text-main' as string]: textMain,
        ['--text-muted' as string]: textMuted,
        ['--card-bg' as string]: cardBg,
        ['--card-border' as string]: border,
      }}
    >
      <div
        style={{
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          borderBottom: `1px solid ${border}`,
          position: 'sticky',
          top: 0,
          background: bg,
          zIndex: 1,
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>
          Accueil
        </span>
      </div>

      <div
        style={{
          padding: '24px',
          maxWidth: '1080px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 700,
              color: textMain,
              letterSpacing: '-0.02em',
            }}
          >
            Bon retour, {firstName}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: textMuted }}>
            Reprends là où tu t&apos;es arrêté ou explore ton prochain lab.
          </p>
        </div>

        <section>
          <SectionLabel>Reprendre · Recommandé</SectionLabel>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '14px',
            }}
          >
            {lastSession ? (
              <ResumeCard session={lastSession} dark={dark} />
            ) : (
              <div
                style={{
                  padding: '18px 20px',
                  borderRadius: '10px',
                  border: `1px dashed ${border}`,
                  color: textMuted,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '180px',
                }}
              >
                Aucune session en cours
              </div>
            )}
            {recommended ? (
              <RecommendedCard incident={recommended} dark={dark} />
            ) : (
              <div
                style={{
                  padding: '18px 20px',
                  borderRadius: '10px',
                  border: `1px dashed ${border}`,
                  color: textMuted,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '180px',
                }}
              >
                Tous les labs sont complétés
              </div>
            )}
          </div>
        </section>

        <section>
          <SectionLabel
            action={
              <Link
                to="/competences"
                style={{ fontSize: '11px', color: '#0055e5', textDecoration: 'none' }}
              >
                Voir tout
              </Link>
            }
          >
            Progression
          </SectionLabel>
          <ProgressSnapshotCard dark={dark} />
        </section>

        <section>
          <SectionLabel
            action={
              <Link
                to="/inbox"
                style={{ fontSize: '11px', color: '#0055e5', textDecoration: 'none' }}
              >
                Boîte de réception
              </Link>
            }
          >
            Fil récent
          </SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {feed.map((item) => (
              <FeedRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
