import api from "./api";

// 📊 Dashboard Stats
export const fetchAdminStats = () => {
  return api.get("/admin/stats");
};

// 👥 Users
export const fetchAllUsers = () => {
  return api.get("/admin/users");
};

export const blockUser = (userId) => {
  return api.put(`/admin/users/${userId}/block`);
};

export const deleteUser = (userId) => {
  return api.delete(`/admin/users/${userId}`);
};

// 📘 Journals
export const fetchAllJournals = () => {
  return api.get("/admin/journals");
};

export const approveJournal = (journalId) => {
  return api.put(`/admin/journals/${journalId}/approve`);
};

export const rejectJournal = (journalId) => {
  return api.put(`/admin/journals/${journalId}/reject`);
};

// 💳 Subscriptions
export const fetchAllSubscriptions = () => {
  return api.get("/admin/subscriptions");
};

export const createSubscription = (data) => {
  return api.post("/admin/subscriptions", data);
};

export const deleteSubscription = (id) => {
  return api.delete(`/admin/subscriptions/${id}`);
};