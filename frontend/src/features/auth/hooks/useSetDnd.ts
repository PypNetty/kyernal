import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setDndEnabled } from '../api/authApi';
import type { PresenceActivity } from '../lib/presenceStatus';
import { authKeys } from '../queryKeys';

export function useSetDnd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      enabled,
      activity,
    }: {
      enabled: boolean;
      activity: Omit<PresenceActivity, 'dndEnabled'>;
    }) => setDndEnabled(enabled, activity),
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session(), session);
    },
  });
}
