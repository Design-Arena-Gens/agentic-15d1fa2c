import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Offer } from "@/types/api";

type Response = {
  offers: Offer[];
};

export function useOffers() {
  return useQuery<Response>({
    queryKey: ["offers"],
    queryFn: async () => {
      const response = await api.get<Response>("/api/offers");
      return response.data;
    },
  });
}
