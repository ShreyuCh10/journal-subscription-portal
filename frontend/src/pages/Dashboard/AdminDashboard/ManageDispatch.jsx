import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { getAllDispatches, getDispatchCounts, updateDispatchStatus } from "../../../Service/DispatchApi";

const ManageDispatch = () => {
  const [dispatches, setDispatches] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, shipped: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dispRes, countRes] = await Promise.all([
        getAllDispatches(),
        getDispatchCounts(),
      ]);
      setDispatches(dispRes.data);
      setFiltered(dispRes.data);
      setCounts(countRes.data);
    } catch (err) {
      console.error("Failed to load dispatches", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (statusFilter === "all") {
      setFiltered(dispatches);
    } else {
      setFiltered(dispatches.filter((d) => d.status === statusFilter));
    }
  }, [statusFilter, dispatches]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await updateDispatchStatus(id, newStatus);
      setDispatches((prev) =>
        prev.map((d) => (d.id === id ? res.data : d))
      );
      // Refresh counts
      const countRes = await getDispatchCounts();
      setCounts(countRes.data);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update dispatch status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "warning";
      case "SHIPPED": return "info";
      case "DELIVERED": return "success";
      case "PACKED": return "secondary";
      default: return "default";
    }
  };

const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "1970-01-01T00:00:00") return "-";

    const date = new Date(dateStr);

    // extra safety
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h4" fontWeight={700}>
        🚚 Dispatch Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <HourglassEmptyIcon sx={{ fontSize: 40, color: "#ed6c02" }} />
              <Box>
                <Typography color="text.secondary" variant="body2">Pending</Typography>
                <Typography variant="h5" fontWeight={700}>{counts.pending}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LocalShippingIcon sx={{ fontSize: 40, color: "#0288d1" }} />
              <Box>
                <Typography color="text.secondary" variant="body2">Shipped</Typography>
                <Typography variant="h5" fontWeight={700}>{counts.shipped}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: "#2e7d32" }} />
              <Box>
                <Typography color="text.secondary" variant="body2">Delivered</Typography>
                <Typography variant="h5" fontWeight={700}>{counts.delivered}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter */}
      <Box>
        <TextField
          select
          label="Filter by Status"
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="SHIPPED">Shipped</MenuItem>
          <MenuItem value="DELIVERED">Delivered</MenuItem>
          <MenuItem value="PACKED">Packed</MenuItem>
        </TextField>
      </Box>

      {/* Table */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f7fb" }}>
                <TableCell><b>S.Id</b></TableCell>
                <TableCell><b>User</b></TableCell>
                <TableCell><b>Journal</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Dispatch Date</b></TableCell>
                <TableCell><b>Delivery Date</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {filtered.map((d, index) => (

                <TableRow key={d.id} hover>

                  {/* S.No */}
                  <TableCell>{index + 1}</TableCell>

                  {/* User */}
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {d.userName || "-"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {d.userEmail || ""}
                    </Typography>
                  </TableCell>

                  {/* Journal */}
                  <TableCell>{d.journalTitle || "-"}</TableCell>

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={d.status}
                      color={getStatusColor(d.status)}
                      size="small"
                    />
                  </TableCell>

                  {/* Dispatch Date */}
                  <TableCell>{formatDate(d.dispatchDate)}</TableCell>

                  {/* Delivery Date */}
                  <TableCell>{formatDate(d.deliveryDate)}</TableCell>

                  {/* Actions */}
                  <TableCell align="center">

                    {(d.status === "PENDING" || d.status === "PACKED") && (
                      <Button
                        size="small"
                        variant="contained"
                        color="info"
                        onClick={() => handleStatusUpdate(d.id, "SHIPPED")}
                      >
                        Ship
                      </Button>
                    )}

                    {d.status === "SHIPPED" && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusUpdate(d.id, "DELIVERED")}
                      >
                        Deliver
                      </Button>
                    )}

                    {d.status === "DELIVERED" && (
                      <Typography
                        variant="caption"
                        color="success.main"
                        fontWeight={600}
                      >
                        ✓ Done
                      </Typography>
                    )}

                  </TableCell>

                </TableRow>

              ))}

              {/* EMPTY STATE */}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No dispatches found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ManageDispatch;
