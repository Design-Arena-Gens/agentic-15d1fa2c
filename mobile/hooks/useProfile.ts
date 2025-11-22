import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Address } from "@/types/api";

export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image?: string | null;
  deliveryInstructions?: string | null;
  addresses: Address[];
};

export function useProfile() {
  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get<{ profile: Profile }>("/api/profile");
      return response.data.profile;
    },
  });
}
