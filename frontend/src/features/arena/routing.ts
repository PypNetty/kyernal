export const POST_AUTH_HOME = '/home' as const;
export const UNAUTHENTICATED_REDIRECT = '/' as const;

export function parseAuthRedirect(search: Record<string, unknown>): string {
  return typeof search.redirect === 'string' && search.redirect.startsWith('/')
    ? search.redirect
    : POST_AUTH_HOME;
}

export function safeRedirectPath(href: string): string {
  return href.startsWith('/') ? href : POST_AUTH_HOME;
}
