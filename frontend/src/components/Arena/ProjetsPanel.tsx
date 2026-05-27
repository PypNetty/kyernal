import React, { useState, useContext } from 'react';
import { LayoutCtx } from './Layout';

// --- TYPES ---
type UserRole = 'apprenant' | 'formateur' | 'recruteur';
type ProjectStatus = 'en-cours' | 'termine' | 'pause' | 'brouillon';
type ProjectVisibility = 'public' | 'prive' | 'formation';

interface ProjectDeliverable {
  label: string;
  done: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  owner: string;
  ownerInitials: string;
  ownerColor: string;
  tags: string[];
  deliverables: ProjectDeliverable[];
  updatedAt: string;
  // Champs internes — jamais visibles aux recruteurs
  labsLinked?: string[];
  formationModule?: string;
}

// --- MOCK ---
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Infrastructure Haute Disponibilité',
    description:
      "Mise en place d'une infrastructure HA avec load balancer Nginx, deux serveurs web en backend et monitoring Prometheus/Grafana.",
    status: 'en-cours',
    visibility: 'public',
    owner: 'Henryck Paris',
    ownerInitials: 'HP',
    ownerColor: '#30a46c',
    tags: ['Linux', 'Nginx', 'HA', 'Monitoring'],
    deliverables: [
      { label: "Schéma d'architecture", done: true },
      { label: 'Configuration Nginx load balancer', done: true },
      { label: 'Mise en place Prometheus', done: false },
      { label: 'Dashboard Grafana', done: false },
      { label: 'Documentation technique', done: false },
    ],
    updatedAt: "Aujourd'hui",
    labsLinked: ['INC-042', 'INC-021'],
    formationModule: 'CCP2',
  },
  {
    id: '2',
    title: "Durcissement d'un serveur Debian",
    description:
      "Checklist complète de sécurisation d'un serveur Debian 12 : SSH, fail2ban, iptables, auditd, suppression des services inutiles.",
    status: 'termine',
    visibility: 'public',
    owner: 'Henryck Paris',
    ownerInitials: 'HP',
    ownerColor: '#30a46c',
    tags: ['Sécurité', 'Debian', 'SSH', 'fail2ban'],
    deliverables: [
      { label: 'Checklist de durcissement', done: true },
      { label: "Script d'automatisation bash", done: true },
      { label: "Rapport d'audit avant/après", done: true },
    ],
    updatedAt: 'Mar',
    labsLinked: ['INC-035', 'INC-077'],
    formationModule: 'CCP3',
  },
  {
    id: '3',
    title: 'Dossier Professionnel TSSR',
    description:
      'Constitution du dossier professionnel pour la certification TSSR — deux situations professionnelles documentées.',
    status: 'en-cours',
    visibility: 'formation',
    owner: 'Henryck Paris',
    ownerInitials: 'HP',
    ownerColor: '#30a46c',
    tags: ['TSSR', 'Certification', 'DP'],
    deliverables: [
      { label: 'Situation professionnelle 1', done: true },
      { label: 'Situation professionnelle 2', done: false },
      { label: 'Relecture formateur', done: false },
    ],
    updatedAt: 'Hier',
    formationModule: 'CCP1 + CCP2 + CCP3',
  },
  {
    id: '4',
    title: 'Homelab — Cluster Proxmox',
    description:
      'Documentation de mon homelab personnel : cluster Proxmox 3 nœuds, réseau WireGuard mesh, self-hosting de services.',
    status: 'pause',
    visibility: 'prive',
    owner: 'Henryck Paris',
    ownerInitials: 'HP',
    ownerColor: '#30a46c',
    tags: ['Proxmox', 'Homelab', 'WireGuard', 'Self-hosting'],
    deliverables: [
      { label: 'Schéma réseau', done: true },
      { label: 'Documentation Proxmox', done: false },
      { label: 'Guide WireGuard mesh', done: false },
    ],
    updatedAt: 'Lun',
  },
];

// --- CONFIG ---
const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string; bg: string }
> = {
  'en-cours': {
    label: 'En cours',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
  },
  termine: { label: 'Terminé', color: '#30a46c', bg: 'rgba(48,164,108,0.1)' },
  pause: { label: 'En pause', color: '#8a8a93', bg: 'rgba(138,138,147,0.1)' },
  brouillon: {
    label: 'Brouillon',
    color: '#6b7280',
    bg: 'rgba(107,114,128,0.1)',
  },
};

const IconPublic = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const IconPrive = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconFormation = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const VISIBILITY_ICONS: Record<ProjectVisibility, React.ReactNode> = {
  public: <IconPublic />,
  prive: <IconPrive />,
  formation: <IconFormation />,
};

const VISIBILITY_CONFIG: Record<
  ProjectVisibility,
  { label: string; color: string }
> = {
  public: { label: 'Public', color: '#30a46c' },
  prive: { label: 'Privé', color: '#8a8a93' },
  formation: { label: 'Formation', color: '#4d8fff' },
};

const ROLE_LABELS: Record<UserRole, string> = {
  apprenant: 'Apprenant',
  formateur: 'Formateur',
  recruteur: 'Recruteur',
};

// --- FILTRAGE SELON RÔLE ---
function filterByRole(projects: Project[], role: UserRole): Project[] {
  if (role === 'recruteur')
    return projects.filter((p) => p.visibility === 'public');
  return projects;
}

// --- COMPOSANT CARTE PROJET ---
function ProjectCard({
  project,
  role,
  dark,
  isActive,
  onClick,
  textMain,
  textMuted,
  border,
  hoverBg,
  activeBg,
}: {
  project: Project;
  role: UserRole;
  dark: boolean;
  isActive: boolean;
  onClick: () => void;
  textMain: string;
  textMuted: string;
  border: string;
  hoverBg: string;
  activeBg: string;
}) {
  const statusCfg = STATUS_CONFIG[project.status];
  const visCfg = VISIBILITY_CONFIG[project.visibility];
  const done = project.deliverables.filter((d) => d.done).length;
  const total = project.deliverables.length;
  const pct = Math.round((done / total) * 100);
  const trackBg = dark ? '#27282b' : '#e8e8e5';

  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 14px',
        cursor: 'pointer',
        background: isActive ? activeBg : 'transparent',
        borderBottom: `1px solid ${border}`,
        transition: 'background 0.1s',
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = hoverBg;
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent';
      }}
    >
      {/* Titre + visibilité */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '8px',
          marginBottom: '4px',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: textMain,
            lineHeight: 1.4,
            flex: 1,
          }}
        >
          {project.title}
        </span>
        {role !== 'recruteur' && (
          <span
            title={visCfg.label}
            style={{ fontSize: '11px', flexShrink: 0 }}
          >
            {VISIBILITY_ICONS[project.visibility]}
          </span>
        )}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: '11px',
          color: textMuted,
          marginBottom: '8px',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {project.description}
      </div>

      {/* Barre de progression */}
      <div
        style={{
          height: '3px',
          borderRadius: '2px',
          background: trackBg,
          overflow: 'hidden',
          marginBottom: '6px',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '2px',
            background: statusCfg.color,
            width: `${pct}%`,
            transition: 'width 0.3s',
          }}
        />
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            background: statusCfg.bg,
            color: statusCfg.color,
            fontWeight: 500,
          }}
        >
          {statusCfg.label}
        </span>
        <span style={{ fontSize: '10px', color: textMuted }}>
          {done}/{total} · {project.updatedAt}
        </span>
      </div>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL ---
export default function ProjetsPanel() {
  const { dark } = useContext(LayoutCtx);
  const [selected, setSelected] = useState<string>('1');
  const [role, setRole] = useState<UserRole>('apprenant');

  const border = dark ? '#27282b' : '#e8e8e5';
  const bg = dark ? '#0e0f11' : '#f7f7f9';
  const bgDetail = dark ? '#111113' : '#ffffff';
  const textMain = dark ? '#ededed' : '#111113';
  const textMuted = dark ? '#8a8a93' : '#6b6b6b';
  const hoverBg = dark ? '#ffffff0a' : '#00000008';
  const activeBg = dark ? '#ffffff12' : '#00000012';
  const trackBg = dark ? '#27282b' : '#e8e8e5';
  const codeBg = dark ? '#1a1b1e' : '#f4f4f6';

  const visible = filterByRole(MOCK_PROJECTS, role);
  const project = visible.find((p) => p.id === selected) ?? visible[0] ?? null;
  const statusCfg = project ? STATUS_CONFIG[project.status] : null;
  const visCfg = project ? VISIBILITY_CONFIG[project.visibility] : null;

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, Inter, sans-serif',
        background: bg,
      }}
    >
      {/* ── LISTE ── */}
      <div
        style={{
          width: '280px',
          flexShrink: 0,
          borderRight: `1px solid ${border}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            borderBottom: `1px solid ${border}`,
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: textMain,
              flex: 1,
            }}
          >
            Projets
          </span>
          <span
            style={{
              fontSize: '11px',
              color: textMuted,
              background: dark ? '#ffffff0f' : '#0000000a',
              padding: '1px 7px',
              borderRadius: '10px',
            }}
          >
            {visible.length}
          </span>
        </div>

        {/* Switcher rôle (dev only — à retirer en prod) */}
        <div
          style={{
            padding: '8px 12px',
            borderBottom: `1px solid ${border}`,
            display: 'flex',
            gap: '4px',
          }}
        >
          {(['apprenant', 'formateur', 'recruteur'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              style={{
                padding: '3px 8px',
                fontSize: '10px',
                fontWeight: 500,
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                background:
                  role === r
                    ? dark
                      ? '#ffffff18'
                      : '#00000012'
                    : 'transparent',
                color: role === r ? textMain : textMuted,
              }}
            >
              {ROLE_LABELS[r]}
            </button>
          ))}
        </div>

        {/* Liste */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {visible.length === 0 ? (
            <div
              style={{
                padding: '24px 16px',
                textAlign: 'center',
                fontSize: '12px',
                color: textMuted,
              }}
            >
              Aucun projet public
            </div>
          ) : (
            visible.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                role={role}
                dark={dark}
                isActive={p.id === (project?.id ?? '')}
                onClick={() => setSelected(p.id)}
                textMain={textMain}
                textMuted={textMuted}
                border={border}
                hoverBg={hoverBg}
                activeBg={activeBg}
              />
            ))
          )}
        </div>
      </div>

      {/* ── DÉTAIL ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: bgDetail,
          minWidth: 0,
        }}
      >
        {project && statusCfg && visCfg ? (
          <>
            {/* Header */}
            <div
              style={{
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 20px',
                borderBottom: `1px solid ${border}`,
                gap: '10px',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: textMain,
                  flex: 1,
                }}
              >
                {project.title}
              </span>
              {role !== 'recruteur' && (
                <span style={{ fontSize: '11px', color: visCfg.color }}>
                  {VISIBILITY_ICONS[project.visibility]} {visCfg.label}
                </span>
              )}
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: statusCfg.bg,
                  color: statusCfg.color,
                  fontWeight: 500,
                }}
              >
                {statusCfg.label}
              </span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {/* Description */}
              <p
                style={{
                  fontSize: '13px',
                  color: textMuted,
                  lineHeight: 1.7,
                  marginTop: 0,
                  marginBottom: '20px',
                }}
              >
                {project.description}
              </p>

              {/* Tags */}
              {project.tags.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    flexWrap: 'wrap',
                    marginBottom: '24px',
                  }}
                >
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '5px',
                        background: dark ? '#ffffff0f' : '#0000000a',
                        color: textMuted,
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Livrables */}
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: textMuted,
                    letterSpacing: '0.5px',
                    marginBottom: '10px',
                  }}
                >
                  LIVRABLES —{' '}
                  {project.deliverables.filter((d) => d.done).length}/
                  {project.deliverables.length}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {project.deliverables.map((d, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '7px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${border}`,
                        background: d.done
                          ? dark
                            ? 'rgba(48,164,108,0.04)'
                            : 'rgba(48,164,108,0.03)'
                          : 'transparent',
                      }}
                    >
                      <div
                        style={{
                          width: '15px',
                          height: '15px',
                          borderRadius: '4px',
                          flexShrink: 0,
                          border: `1.5px solid ${d.done ? '#30a46c' : border}`,
                          background: d.done ? '#30a46c' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {d.done && (
                          <svg
                            width="9"
                            height="9"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: '13px',
                          color: d.done ? textMain : textMuted,
                          opacity: d.done ? 1 : 0.75,
                        }}
                      >
                        {d.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infos internes — masquées aux recruteurs */}
              {role !== 'recruteur' && (
                <>
                  {project.formationModule && (
                    <div style={{ marginBottom: '16px' }}>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: textMuted,
                          letterSpacing: '0.5px',
                          marginBottom: '6px',
                        }}
                      >
                        MODULE
                      </div>
                      <span
                        style={{
                          fontSize: '12px',
                          padding: '3px 8px',
                          borderRadius: '5px',
                          background: 'rgba(0,85,229,0.1)',
                          color: '#4d8fff',
                          fontWeight: 500,
                        }}
                      >
                        {project.formationModule}
                      </span>
                    </div>
                  )}

                  {project.labsLinked && project.labsLinked.length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: textMuted,
                          letterSpacing: '0.5px',
                          marginBottom: '6px',
                        }}
                      >
                        LABS ASSOCIÉS
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '6px',
                          flexWrap: 'wrap',
                        }}
                      >
                        {project.labsLinked.map((id) => (
                          <span
                            key={id}
                            style={{
                              fontSize: '11px',
                              padding: '3px 8px',
                              borderRadius: '5px',
                              background: dark ? '#ffffff0f' : '#0000000a',
                              color: textMuted,
                              fontWeight: 500,
                            }}
                          >
                            #{id}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Vue recruteur — message d'info */}
              {role === 'recruteur' && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '7px',
                    border: `1px solid ${border}`,
                    background: dark ? '#ffffff05' : '#00000005',
                    fontSize: '12px',
                    color: textMuted,
                    lineHeight: 1.6,
                  }}
                >
                  Vous consultez la version publique de ce projet. Les détails
                  techniques internes et les labs associés ne sont pas visibles.
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: textMuted,
              fontSize: '13px',
            }}
          >
            Sélectionne un projet
          </div>
        )}
      </div>
    </div>
  );
}
