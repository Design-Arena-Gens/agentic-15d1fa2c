import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Order } from "@/types/api";

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get<{ orders: Order[] }>("/api/orders");
      return response.data.orders;
    },
  });
}
