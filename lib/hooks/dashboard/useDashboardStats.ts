import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../api/dashboard";
import { useAuth } from "@/lib/store/auth";

export const useDashboardStats = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: getDashboardStats,
    enabled: !!user?.id,
  });
};
