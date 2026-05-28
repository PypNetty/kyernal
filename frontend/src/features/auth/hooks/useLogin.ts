import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { login } from '../api/authApi';
import { authKeys } from '../queryKeys';
import type { LoginCredentials } from '../types';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: '/login' });

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (session) => {
      queryClient.setQueryData(authKeys.session(), session);
      void navigate({ to: redirect });
    },
  });
}
