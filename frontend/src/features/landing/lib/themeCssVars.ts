import type { CSSProperties } from 'react';
import type { Theme } from '../theme/landingTheme';

export function themeCssVars(theme: Theme): CSSProperties {
  return {
    '--bg': theme.bg,
    '--bg-card': theme.bgCard,
    '--border': theme.border,
    '--border-muted': theme.borderMuted,
    '--text': theme.text,
    '--text-sub': theme.textSub,
    '--text-muted': theme.textMuted,
    '--text-faint': theme.textFaint,
    '--nav-bg': theme.navBg,
    '--btn-primary': theme.btnPrimary,
    '--btn-primary-text': theme.btnPrimaryText,
    '--btn-secondary-bg': theme.btnSecondaryBg,
    '--btn-secondary-text': theme.btnSecondaryText,
    '--badge-bg': theme.badgeBg,
    '--badge-border': theme.badgeBorder,
    '--grid-color': theme.gridColor,
    '--halo-bg': theme.haloBg,
  } as CSSProperties;
}
