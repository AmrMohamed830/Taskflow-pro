import { api } from "./client";

import type { DashboardStats } from "../types/dashboard";

export const getDashboardStats = async (): Promise<DashboardStats> => {
  return api.get<DashboardStats>("/dashboard/stats");
};
