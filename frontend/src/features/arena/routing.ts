export const POST_AUTH_HOME = '/home' as const;
export const UNAUTHENTICATED_REDIRECT = '/' as const;

function isSafeRelativePath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//');
}

export function parseAuthRedirect(search: Record<string, unknown>): string {
  const redirect = search.redirect;
  return typeof redirect === 'string' && isSafeRelativePath(redirect)
    ? redirect
    : POST_AUTH_HOME;
}

export function safeRedirectPath(href: string): string {
  return isSafeRelativePath(href) ? href : POST_AUTH_HOME;
}
