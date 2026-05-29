import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import { alertApiError } from "@/lib/api";

type QOpts<T> = Omit<UseQueryOptions<T>, "queryKey" | "queryFn">;

export function useApiQuery<T>(queryKey: unknown[], queryFn: () => Promise<T>, options?: QOpts<T>) {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}

export function useApiMutation<TData, TVariables>(
  mutationFn: (vars: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">,
) {
  return useMutation({
    mutationFn,
    onError: (err, _vars, ctx) => {
      alertApiError(err);
      options?.onError?.(err, _vars, ctx);
    },
    ...options,
  });
}
