import React, { useContext, useState } from 'react';
import { LayoutCtx } from '../../layout/components/Layout';
import {
  MOCK_PROJECTS,
  ROLE_LABELS,
  STATUS_CONFIG,
  VISIBILITY_CONFIG,
  VISIBILITY_ICONS,
  filterByRole,
  type Project,
  type UserRole,
} from '../data/projetsData';

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
          <span title={visCfg.label} style={{ fontSize: '11px', flexShrink: 0 }}>
            {VISIBILITY_ICONS[project.visibility]}
          </span>
        )}
      </div>

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
      <div
        style={{
          width: '280px',
          flexShrink: 0,
          borderRight: `1px solid ${border}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
                background: role === r ? (dark ? '#ffffff18' : '#00000012') : 'transparent',
                color: role === r ? textMain : textMuted,
              }}
            >
              {ROLE_LABELS[r]}
            </button>
          ))}
        </div>

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
                  LIVRABLES — {project.deliverables.filter((d) => d.done).length}/
                  {project.deliverables.length}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
                  Vous consultez la version publique de ce projet. Les détails techniques internes et les labs associés ne sont pas visibles.
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
