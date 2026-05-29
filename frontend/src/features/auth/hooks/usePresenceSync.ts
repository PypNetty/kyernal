import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { setStoredSession } from '../lib/authStorage';
import {
  derivePresenceStatus,
  getPresenceActivityFromRoute,
} from '../lib/presenceStatus';
import { authKeys } from '../queryKeys';
import type { AuthSession } from '../types';
import { useAuth } from './useAuth';

export function usePresenceSync(
  vmHost: string | undefined,
  showCourse: boolean,
  pathname: string,
) {
  const queryClient = useQueryClient();
  const { data: session } = useAuth();

  const vmActive = Boolean(vmHost);
  const routeActivity = getPresenceActivityFromRoute(pathname);
  const readingContent = showCourse || routeActivity.readingContent;
  const workingOnTicket = routeActivity.workingOnTicket;
  const dndEnabled = session?.dndEnabled ?? false;

  useEffect(() => {
    if (!session) return;

    const nextStatus = derivePresenceStatus({
      dndEnabled,
      vmActive,
      readingContent,
      workingOnTicket,
    });

    if (nextStatus === session.presenceStatus) return;

    const updated: AuthSession = {
      ...session,
      presenceStatus: nextStatus,
    };

    setStoredSession(updated);
    queryClient.setQueryData(authKeys.session(), updated);
  }, [
    session,
    dndEnabled,
    vmActive,
    readingContent,
    workingOnTicket,
    queryClient,
  ]);
}
