import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Avatar,
  Divider
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  getAdminStats,
  getChartData,
  getRecentUsers,
  getRecentPayments
} from "../../../Service/AdminApi";

// ================= STAT CARD =================
const StatCard = ({ title, value, icon, gradient }) => (
  <Card
    sx={{
      borderRadius: 3,
      background: gradient,
      color: "#fff",
      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-6px) scale(1.02)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
      }
    }}
  >
    <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {value ?? "-"}
        </Typography>
      </Box>

      <Box sx={{ fontSize: 32 }}>{icon}</Box>
    </CardContent>
  </Card>
);

// ================= MAIN =================
const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, chartRes, usersRes, paymentsRes] = await Promise.all([
        getAdminStats(),
        getChartData(),
        getRecentUsers(),
        getRecentPayments()
      ]);

      setStats(statsRes.data);
      setChartData(chartRes.data.userGrowth || []);
      setUsers(usersRes.data || []);
      setPayments(paymentsRes.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 5 }, py: 4 }}>

      {/* ===== HEADER ===== */}
      <Box mb={5}>
        <Typography variant="h4" fontWeight={700}>
          Admin Dashboard
        </Typography>
        <Typography color="text.secondary">
          Monitor your platform performance 🚀
        </Typography>
      </Box>

      {/* ===== STATS ===== */}
      <Grid container spacing={3} mb={5}>
        {[
          {
            title: "Total Users",
            value: stats?.totalUsers,
            icon: "👥",
            gradient: "linear-gradient(135deg, #6366f1, #4f46e5)"
          },
          {
            title: "Journals",
            value: stats?.totalJournals,
            icon: "📘",
            gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)"
          },
          {
            title: "Active Subs",
            value: stats?.activeSubscriptions,
            icon: "💳",
            gradient: "linear-gradient(135deg, #22c55e, #16a34a)"
          },
          {
            title: "Revenue",
            value: `₹${stats?.revenue || 0}`,
            icon: "💰",
            gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
          }
        ].map((item, i) => (
          <Grid key={i} size={{ xs: 12, md: 3 }}>
            <StatCard {...item} />
          </Grid>
        ))}
      </Grid>

      {/* ===== CHART + INSIGHTS ===== */}
      <Grid container spacing={3} mb={5}>

        {/* CHART */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography fontWeight={600} mb={2}>
              Growth Overview
            </Typography>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* INSIGHTS */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography fontWeight={600} mb={2}>
              Insights
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              {[
                "🔥 Highest revenue this month",
                "📈 User growth increasing",
                "💡 Focus on retention strategy"
              ].map((text, i) => (
                <Box
                  key={i}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#f9fafb",
                    "&:hover": { bgcolor: "#f3f4f6" }
                  }}
                >
                  {text}
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* ===== TABLES ===== */}
      <Grid container spacing={3}>

        {/* USERS */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2, borderRadius: 3 }}>
            <Typography fontWeight={600} mb={2}>
              Recent Users
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><b>User</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.length > 0 ? users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar>{u.name?.charAt(0)}</Avatar>
                        {u.name}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: "#6b7280" }}>
                      {u.email}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </Grid>

        {/* PAYMENTS */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ p: 2, borderRadius: 3 }}>
            <Typography fontWeight={600} mb={2}>
              Recent Payments
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><b>User</b></TableCell>
                  <TableCell><b>Amount</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {payments.length > 0 ? payments.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>{p.userName}</TableCell>
                    <TableCell>₹{p.amount}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AdminHome;