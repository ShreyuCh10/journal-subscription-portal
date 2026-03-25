import React, { useEffect, useMemo, useState } from "react";
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
  Tooltip,
  TablePagination,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

import {
  getAllDispatches,
  getDispatchCounts,
  updateDispatchStatus,
} from "../../../Service/DispatchApi";


// ================= HELPERS =================

const sortDispatches = (data) => {
  return [...data].sort((a, b) => {
    if (a.status === "DELIVERED" && b.status !== "DELIVERED") return 1;
    if (a.status !== "DELIVERED" && b.status === "DELIVERED") return -1;

    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
};

const getMonthName = (month, year) => {
  if (!month || !year) return "-";
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];
  return `${months[month - 1]} ${year}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return "-";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isFutureDispatch = (month, year) => {
  const now = new Date();
  return (
    year > now.getFullYear() ||
    (year === now.getFullYear() && month > now.getMonth() + 1)
  );
};

const getStatusColor = (status) => {
  return {
    PENDING: "warning",
    PACKED: "secondary",
    SHIPPED: "info",
    DELIVERED: "success",
  }[status] || "default";
};


// ================= STAT CARD =================

const StatCard = ({ title, value, icon }) => (
  <Card sx={{ borderRadius: 3 }}>
    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {icon}
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


// ================= MAIN =================

const ManageDispatch = () => {
  const [dispatches, setDispatches] = useState([]);
  const [counts, setCounts] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  // ===== FETCH =====
  useEffect(() => {
    (async () => {
      try {
        const [dRes, cRes] = await Promise.all([
          getAllDispatches(),
          getDispatchCounts(),
        ]);

        setDispatches(sortDispatches(dRes.data));
        setCounts(cRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  // ===== FILTER + SORT =====
  const filtered = useMemo(() => {
    let data = dispatches;

    if (statusFilter !== "all") {
      data = data.filter((d) => d.status === statusFilter);
    }

    return sortDispatches(data);
  }, [dispatches, statusFilter]);


  // ===== PAGINATION =====
  const paginated = useMemo(() => {
    return filtered.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filtered, page, rowsPerPage]);


  // ===== UPDATE =====
  const handleUpdate = async (id, status) => {
    try {
      const res = await updateDispatchStatus(id, status);

      const updated = dispatches.map((d) =>
        d.id === id ? res.data : d
      );

      setDispatches(sortDispatches(updated));

      const cRes = await getDispatchCounts();
      setCounts(cRes.data);
    } catch {
      alert("Update failed");
    }
  };


  // ===== UI =====

  if (loading) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} display="flex" flexDirection="column" gap={4}>

      {/* HEADER */}
      <Typography variant="h4" fontWeight={700}>
        🚚 Dispatch Management
      </Typography>


      {/* STATS */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Pending" value={counts.pending}
            icon={<HourglassEmptyIcon color="warning" />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Shipped" value={counts.shipped}
            icon={<LocalShippingIcon color="info" />} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Delivered" value={counts.delivered}
            icon={<CheckCircleIcon color="success" />} />
        </Grid>
      </Grid>


      {/* FILTER */}
      <TextField
        select
        size="small"
        label="Filter Status"
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(0);
        }}
        sx={{ width: 200 }}
      >
        {["all","PENDING","PACKED","SHIPPED","DELIVERED"].map(s => (
          <MenuItem key={s} value={s}>{s}</MenuItem>
        ))}
      </TextField>


      {/* TABLE */}
      <Card>
        <CardContent>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Journal</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Dispatch</TableCell>
                <TableCell>Delivery</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.length ? paginated.map((d, i) => {
                const future = isFutureDispatch(d.month, d.year);

                return (
                  <TableRow key={d.id} sx={{ opacity: future ? 0.5 : 1 }}>
                    <TableCell>{page * rowsPerPage + i + 1}</TableCell>

                    <TableCell>
                      <Typography fontWeight={600}>{d.userName}</Typography>
                      <Typography variant="caption">{d.userEmail}</Typography>
                    </TableCell>

                    <TableCell>{d.journalTitle}</TableCell>

                    <TableCell>
                      <Chip label={d.status} color={getStatusColor(d.status)} size="small" />
                    </TableCell>

                    <TableCell>
                      <Chip label={getMonthName(d.month, d.year)} size="small" />
                    </TableCell>

                    <TableCell>{formatDate(d.dispatchDate)}</TableCell>
                    <TableCell>{formatDate(d.deliveryDate)}</TableCell>

                    <TableCell align="center">

                      {(d.status === "PENDING" || d.status === "PACKED") && (
                        <Tooltip title={future ? "Future dispatch locked" : ""}>
                          <span>
                            <Button
                              size="small"
                              variant="contained"
                              disabled={future}
                              onClick={() => handleUpdate(d.id, "SHIPPED")}
                            >
                              Ship
                            </Button>
                          </span>
                        </Tooltip>
                      )}

                      {d.status === "SHIPPED" && (
                        <Button
                          size="small"
                          color="success"
                          variant="contained"
                          onClick={() => handleUpdate(d.id, "DELIVERED")}
                        >
                          Deliver
                        </Button>
                      )}

                      {d.status === "DELIVERED" && (
                        <Typography color="success.main">✔ Done</Typography>
                      )}

                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* PAGINATION */}
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(e, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />

        </CardContent>
      </Card>
    </Box>
  );
};

export default ManageDispatch;