import api from "./api";

export const getReportSummary = () => api.get("/api/reports/summary");
