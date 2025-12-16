import api from "./axios";

export interface DashboardStats {
  pendingInquiries: number;
  activeOfficials: number;
  documentsUploaded: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get("/dashboard/stats");
  return response.data.data;
};
