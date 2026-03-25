import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  TextField,
  MenuItem,
  TablePagination
} from "@mui/material";

import { getUserShipments } from "../../../Service/DispatchApi";

const TrackShipment = () => {

  const [shipments, setShipments] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [shipments, statusFilter, search]);

  const fetchShipments = async () => {
    const res = await getUserShipments();
    setShipments(res.data);
    setFiltered(res.data);
  };

  // ================= FILTER =================
const applyFilters = () => {
  let data = shipments.filter(d => d.status !== "CANCELLED");

  // Status filter
  if (statusFilter !== "all") {
    data = data.filter(d => d.status === statusFilter);
  }

  // Search
  if (search.trim() !== "") {
    data = data.filter(d =>
      d.journalTitle?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // ✅ SORT BY YEAR + MONTH (LATEST FIRST)
  data.sort((a, b) => {
    if (b.year !== a.year) {
      return a.year - b.year;
    }
    return a.month - b.month;
  });

  setFiltered(data);
};
  // ================= HELPERS =================

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getMonthName = (month) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return month ? months[month - 1] : "-";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "default";
      case "PACKED": return "warning";
      case "SHIPPED": return "info";
      case "DELIVERED": return "success";
      default: return "default";
    }
  };

  // ================= PAGINATION =================

  const paginated = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // ================= UI =================

  return (
    <Box sx={{ px: 4, py: 4 }}>

      <Typography variant="h4" mb={3}>
        My Shipments
      </Typography>

      {/* 🔍 FILTERS */}
      <Box display="flex" gap={2} mb={3}>

        {/* Status Filter */}
        <TextField
          select
          label="Status"
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="PACKED">Packed</MenuItem>
          <MenuItem value="SHIPPED">Shipped</MenuItem>
          <MenuItem value="DELIVERED">Delivered</MenuItem>
        </TextField>

        {/* Search */}
        <TextField
          label="Search Journal"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </Box>

      <Card>
        <CardContent>

          <Table>

            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Journal</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Dispatch</TableCell>
                <TableCell>Track</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {paginated.map((s, index) => (

                <TableRow key={s.id} hover>

                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                  <TableCell>{s.journalTitle}</TableCell>

                  {/* Timeline Month */}
                  <TableCell>
                    <Chip
                      label={`${getMonthName(s.month)} ${s.year}`}
                      size="small"
                      color="primary"
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={s.status}
                      color={getStatusColor(s.status)}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {formatDate(s.dispatchDate)}
                  </TableCell>

                  <TableCell>
                    {s.trackingNumber ? (
                      <Button
                        variant="contained"
                        size="small"
                        href={`https://www.delhivery.com/track/package/${s.trackingNumber}`}
                        target="_blank"
                      >
                        Track
                      </Button>
                    ) : (
                      <Typography variant="caption">
                        Not shipped
                      </Typography>
                    )}
                  </TableCell>

                </TableRow>

              ))}

              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No shipments found
                  </TableCell>
                </TableRow>
              )}

            </TableBody>

          </Table>

          {/* 📄 PAGINATION */}
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
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

export default TrackShipment;