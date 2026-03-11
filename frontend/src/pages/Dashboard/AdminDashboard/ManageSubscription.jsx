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
  TextField,
  MenuItem,
  CircularProgress,
  Button
} from "@mui/material";

import { getAllSubscriptions } from "../../../Service/SubscriptionApi";
import { createDispatch } from "../../../Service/DispatchApi";
const ManageSubscription = () => {

  const [subscriptions, setSubscriptions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchSubscriptions();
  }, []);


const handleCreateDispatch = async (subscriptionId) => {

  try {

    await createDispatch(subscriptionId);

    alert("Dispatch created successfully");

    fetchSubscriptions(); // refresh table

  } catch (err) {

    console.error("Dispatch creation failed", err);

  }

};

  const fetchSubscriptions = async () => {
    try {

      const res = await getAllSubscriptions();
      console.log(res.data);

      setSubscriptions(res.data);
      setFiltered(res.data);

    } catch (err) {

      console.error("Failed to load subscriptions", err);

    } finally {

      setLoading(false);

    }
  };

  // Search + Filter
  useEffect(() => {

    let result = subscriptions;

    if (search) {

      result = result.filter((sub) =>
        sub.journalTitle.toLowerCase().includes(search.toLowerCase())
      );

    }

    if (statusFilter !== "all") {

      result = result.filter(
        (sub) => sub.status === statusFilter
      );

    }

    setFiltered(result);

  }, [search, statusFilter, subscriptions]);

  const getStatusColor = (status) => {

    switch (status) {

      case "ACTIVE":
        return "success";

      case "EXPIRED":
        return "warning";

      case "CANCELLED":
        return "error";

      default:
        return "default";

    }

  };

  const total = subscriptions.length;

  const active = subscriptions.filter(
    (s) => s.status === "ACTIVE"
  ).length;

  if (loading) {

    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  }

  return (

    <Box sx={{ px: 4, py: 4 }}>

      <Typography variant="h4" mb={3}>
        Manage Subscriptions
      </Typography>

      {/* Summary Cards */}

      <Grid container spacing={3} mb={4}>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total Subscriptions
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Active Subscriptions
              </Typography>
              <Typography variant="h5" fontWeight={600} color="success.main">
                {active}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Filters */}

      <Box display="flex" gap={2} mb={3}>

        <TextField
          label="Search by Journal"
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
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="EXPIRED">Expired</MenuItem>
          <MenuItem value="CANCELLED">Cancelled</MenuItem>

        </TextField>

      </Box>

      {/* Table */}

      <Card>

        <CardContent>

          <Table>

            <TableHead>

              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Journal</TableCell>
                <TableCell>Months</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Dispatch</TableCell>
              </TableRow>

            </TableHead>

            <TableBody>

              {filtered.map((sub) => (

                <TableRow key={sub.id} hover>

                  <TableCell>{sub.id}</TableCell>

                  <TableCell>{sub.journalTitle}</TableCell>

                  <TableCell>{sub.months}</TableCell>

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

                       {sub.status === "ACTIVE" ? (

                         <Button
                           variant="contained"
                           size="small"
                           onClick={() => handleCreateDispatch(sub.id)}
                         >
                           Create Dispatch
                         </Button>

                       ) : (

                         "—"

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

    </Box>

  );

};

export default ManageSubscription;