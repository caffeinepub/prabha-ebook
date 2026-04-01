import { useMutation, useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useSubmitInquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      phone,
    }: {
      name: string;
      email: string;
      phone: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.submitInquiry(name, email, phone);
    },
  });
}

export function useCheckSubmitted(email: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["checkSubmitted", email],
    queryFn: async () => {
      if (!actor || !email) return false;
      return actor.checkSubmitted(email);
    },
    enabled: !!actor && !isFetching && email.length > 0,
  });
}
