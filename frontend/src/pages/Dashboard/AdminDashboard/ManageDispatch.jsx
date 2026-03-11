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
  TextField,
  MenuItem,
  Button,
  Pagination
} from "@mui/material";

import {
  getAllDispatches,
  createDispatch,
  updateDispatchStatus
} from "../../../Service/DispatchApi";

const ManageDispatch = () => {

  const [dispatches, setDispatches] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);

  const rowsPerPage = 8;

  useEffect(() => {
    fetchDispatch();
  }, []);

  const fetchDispatch = async () => {
    const res = await getAllDispatches();
    setDispatches(res.data);
    setFiltered(res.data);
  };

  // SEARCH + FILTER

  useEffect(() => {

    let result = dispatches;

    if (search) {
      result = result.filter(d =>
        d.trackingNumber?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(d => d.status === statusFilter);
    }

    setFiltered(result);

  }, [search, statusFilter, dispatches]);

  // CREATE DISPATCH

  const handleCreateDispatch = async (subscriptionId) => {

    await createDispatch(subscriptionId);

    alert("Dispatch created successfully");

    fetchDispatch();
  };

  // UPDATE STATUS

  const updateStatus = async (id, status) => {
    await updateDispatchStatus(id, status);
    fetchDispatch();
  };

  // STATUS COLORS

  const getStatusColor = (status) => {

    switch (status) {

      case "PENDING":
        return "default";

      case "PACKED":
        return "warning";

      case "SHIPPED":
        return "info";

      case "IN_TRANSIT":
        return "secondary";

      case "DELIVERED":
        return "success";

      default:
        return "default";
    }
  };

  // PAGINATION

  const startIndex = (page - 1) * rowsPerPage;

  const currentRows =
    filtered.slice(startIndex, startIndex + rowsPerPage);

  return (

    <Box sx={{ px: 4, py: 4 }}>

      <Typography variant="h4" mb={3}>
        Dispatch Management
      </Typography>

      {/* Filters */}

      <Box display="flex" gap={2} mb={3}>

        <TextField
          label="Search Tracking"
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
        >

          <MenuItem value="all">All</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="PACKED">Packed</MenuItem>
          <MenuItem value="SHIPPED">Shipped</MenuItem>
          <MenuItem value="DELIVERED">Delivered</MenuItem>

        </TextField>

      </Box>

      <Card>

        <CardContent>

          <Table>

            <TableHead>

              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Subscription</TableCell>
                <TableCell>Courier</TableCell>
                <TableCell>Tracking</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>

            </TableHead>

            <TableBody>

              {currentRows.map((d) => (

                <TableRow key={d.id} hover>

                  <TableCell>{d.id}</TableCell>

                  <TableCell>
                    {d.subscriptionId}
                  </TableCell>

                  <TableCell>
                    {d.courier || "N/A"}
                  </TableCell>

                  <TableCell>

                    {d.trackingNumber ?

                      <a
                        href={`https://www.delhivery.com/track/package/${d.trackingNumber}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {d.trackingNumber}
                      </a>

                      :

                      "Not Generated"

                    }

                  </TableCell>

                  <TableCell>

                    <Chip
                      label={d.status}
                      color={getStatusColor(d.status)}
                      size="small"
                    />

                  </TableCell>

                  <TableCell align="center">

                    {d.status === "PENDING" && (

                      <Button
                        size="small"
                        onClick={() =>
                          updateStatus(d.id, "PACKED")
                        }
                      >
                        Pack
                      </Button>

                    )}

                    {d.status === "PACKED" && (

                      <Button
                        size="small"
                        onClick={() =>
                          updateStatus(d.id, "SHIPPED")
                        }
                      >
                        Ship
                      </Button>

                    )}

                    {d.status === "SHIPPED" && (

                      <Button
                        size="small"
                        color="success"
                        onClick={() =>
                          updateStatus(d.id, "DELIVERED")
                        }
                      >
                        Deliver
                      </Button>

                    )}

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </CardContent>

      </Card>

      {/* Pagination */}

      <Box mt={3} display="flex" justifyContent="center">

        <Pagination
          count={Math.ceil(filtered.length / rowsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
        />

      </Box>

    </Box>
  );
};

export default ManageDispatch;