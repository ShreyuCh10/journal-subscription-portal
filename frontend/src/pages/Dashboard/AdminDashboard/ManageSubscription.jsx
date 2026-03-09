import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider
} from "@mui/material";

const ManageSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSub, setSelectedSub] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/subscriptions");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSubscriptions(data.data);
      setFiltered(data.data);
    } catch (err) {
      setError("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  // 🔎 Search + Filter Logic
  useEffect(() => {
    let result = subscriptions;

    if (search) {
      result = result.filter((sub) =>
        sub.userName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((sub) => sub.status === statusFilter);
    }

    setFiltered(result);
  }, [search, statusFilter, subscriptions]);

  const handleCancel = async () => {
    try {
      await fetch(
        `http://localhost:5000/api/admin/subscriptions/${selectedSub._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "cancelled" }),
        }
      );

      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub._id === selectedSub._id
            ? { ...sub, status: "cancelled" }
            : sub
        )
      );

      setSelectedSub(null);
    } catch (error) {
      console.error("Cancel failed:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "expired":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  // 📊 Summary Data
  const total = subscriptions.length;
  const active = subscriptions.filter((s) => s.status === "active").length;
  const revenue = subscriptions.reduce((sum, s) => sum + s.price, 0);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ px: 4, py: 4 }}>
      <Typography variant="h4" mb={3}>
        Manage Subscriptions
      </Typography>

      {/* 📊 Summary Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Total Subscriptions</Typography>
              <Typography variant="h5" fontWeight={600}>{total}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Active</Typography>
              <Typography variant="h5" fontWeight={600} color="success.main">
                {active}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">Total Revenue</Typography>
              <Typography variant="h5" fontWeight={600} color="secondary.main">
                ₹{revenue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 🔍 Filters */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search by User"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TextField
          select
          label="Status"
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 160 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="expired">Expired</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </TextField>
      </Box>

      {/* 📋 Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((sub) => (
                <TableRow key={sub._id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>
                      {sub.userName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sub.email}
                    </Typography>
                  </TableCell>

                  <TableCell>{sub.plan}</TableCell>
                  <TableCell>₹{sub.price}</TableCell>
                  <TableCell>
                    {new Date(sub.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(sub.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={sub.status}
                      color={getStatusColor(sub.status)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="center">
                    {sub.status === "active" && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => setSelectedSub(sub)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No subscriptions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 🛑 Cancel Confirmation Dialog */}
      <Dialog open={!!selectedSub} onClose={() => setSelectedSub(null)}>
        <DialogTitle>Cancel Subscription?</DialogTitle>
        <DialogContent>
          Are you sure you want to cancel this subscription?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSub(null)}>No</Button>
          <Button color="error" onClick={handleCancel}>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageSubscription;