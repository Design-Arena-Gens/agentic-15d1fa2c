import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { HomePayload } from "@/types/api";

export function useHomeData() {
  return useQuery<HomePayload>({
    queryKey: ["home"],
    queryFn: async () => {
      const response = await api.get<HomePayload>("/api/menu");
      return response.data;
    },
  });
}
