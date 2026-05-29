import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { selectFormation } from '../api/authApi';
import { authKeys } from '../queryKeys';
import type { SelectFormationInput } from '../types';

export function useSelectFormation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: '/formation' });

  return useMutation({
    mutationFn: (input: SelectFormationInput) => selectFormation(input),
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session(), session);
      void navigate({ to: redirect });
    },
  });
}
