import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Message } from "../backend.d";
import { useActor } from "./useActor";

export function useGetHistory(sessionId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ["history", sessionId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHistory(sessionId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMessage(sessionId: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      role,
      content,
    }: { role: string; content: string }) => {
      if (!actor) return;
      await actor.addMessage(sessionId, role, content);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["history", sessionId] });
    },
  });
}

export function useClearHistory(sessionId: string) {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.clearHistory(sessionId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["history", sessionId] });
    },
  });
}
