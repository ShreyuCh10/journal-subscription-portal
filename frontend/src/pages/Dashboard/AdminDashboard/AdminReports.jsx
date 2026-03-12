import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  People,
  MenuBook,
  Subscriptions,
  CreditCard,
  AttachMoney,
  CheckCircle,
  Cancel,
  TrendingUp,
  Favorite,
} from "@mui/icons-material";
import { getReportSummary } from "../../../Service/ReportApi";

const StatCard = ({ icon, title, value, color }) => (
  <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, py: 3 }}>
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: 2,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await getReportSummary();
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" mt={3}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Typography variant="h4" fontWeight={700}>
        📈 Reports & Analytics
      </Typography>

      {/* User Stats */}
      <Box>
        <Typography variant="h6" fontWeight={600} mb={2} color="text.secondary">
          Users Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={<People />}
              title="Total Users"
              value={data.totalUsers}
              color="linear-gradient(135deg, #667eea, #764ba2)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={<CheckCircle />}
              title="Subscribed Users"
              value={data.subscribedUsers}
              color="linear-gradient(135deg, #11998e, #38ef7d)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={<Favorite />}
              title="Interested Users"
              value={data.interestedUsers}
              color="linear-gradient(135deg, #f093fb, #f5576c)"
            />
          </Grid>
        </Grid>
      </Box>

      <Divider />

      {/* Journal & Subscription Stats */}
      <Box>
        <Typography variant="h6" fontWeight={600} mb={2} color="text.secondary">
          Journals & Subscriptions
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={<MenuBook />}
              title="Total Journals"
              value={data.totalJournals}
              color="linear-gradient(135deg, #4facfe, #00f2fe)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={<Subscriptions />}
              title="Total Subscriptions"
              value={data.totalSubscriptions}
              color="linear-gradient(135deg, #a18cd1, #fbc2eb)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={<TrendingUp />}
              title="Active Subscriptions"
              value={data.activeSubscriptions}
              color="linear-gradient(135deg, #43e97b, #38f9d7)"
            />
          </Grid>
        </Grid>
      </Box>

      <Divider />

      {/* Payment Stats */}
      <Box>
        <Typography variant="h6" fontWeight={600} mb={2} color="text.secondary">
          Payments & Revenue
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CreditCard />}
              title="Total Payments"
              value={data.totalPayments}
              color="linear-gradient(135deg, #fa709a, #fee140)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CheckCircle />}
              title="Successful"
              value={data.successfulPayments}
              color="linear-gradient(135deg, #11998e, #38ef7d)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Cancel />}
              title="Failed"
              value={data.failedPayments}
              color="linear-gradient(135deg, #eb3349, #f45c43)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<AttachMoney />}
              title="Total Revenue"
              value={`₹${data.totalRevenue.toLocaleString()}`}
              color="linear-gradient(135deg, #f7971e, #ffd200)"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminReports;
