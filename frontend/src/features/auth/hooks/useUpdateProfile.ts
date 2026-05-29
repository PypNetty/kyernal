import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../api/authApi';
import { authKeys } from '../queryKeys';
import type { UpdateProfileInput } from '../types';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session(), session);
    },
  });
}
