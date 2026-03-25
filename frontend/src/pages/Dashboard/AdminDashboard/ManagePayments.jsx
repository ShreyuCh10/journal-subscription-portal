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
  Button,
  CircularProgress
} from "@mui/material";

import { getAllPayments } from "../../../Service/PaymentApi";
import { downloadReceiptByPaymentId } from "../../../Service/ReceiptApi";

const ManagePayments = () => {

  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {

    try {

      const res = await getAllPayments();

      setPayments(res.data);
      setFiltered(res.data);

    } catch (err) {

      console.error("Failed to load payments", err);

    } finally {

      setLoading(false);

    }
  };

  // Search + filter
  useEffect(() => {

    let result = payments;

    if (search) {

      result = result.filter((p) =>
        p.userName.toLowerCase().includes(search.toLowerCase()) ||
        p.journalTitle.toLowerCase().includes(search.toLowerCase())
      );

    }

    if (statusFilter !== "all") {

      result = result.filter(
        (p) => p.status === statusFilter
      );

    }

    setFiltered(result);

  }, [search, statusFilter, payments]);

  // Download receipt
  const handleDownloadReceipt = async (receiptId) => {

    try {

      const res = await downloadReceiptByPaymentId(receiptId);

      const blob = new Blob([res.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "receipt.pdf";

      link.click();

    } catch (error) {

      console.error("Receipt download failed", error);

    }

  };

  const getStatusColor = (status) => {

    switch (status) {

      case "SUCCESS":
        return "success";

      case "FAILED":
        return "error";

      case "REFUNDED":
        return "warning";

      case "PENDING":
        return "info";

      default:
        return "default";

    }

  };

  const totalPayments = payments.length;

  const totalRevenue = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

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
        Manage Payments
      </Typography>

      {/* Summary */}

      <Grid container spacing={3} mb={4}>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total Payments
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {totalPayments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Total Revenue
              </Typography>
              <Typography variant="h5" fontWeight={600} color="success.main">
                ₹{totalRevenue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Filters */}

      <Box display="flex" gap={2} mb={3}>

        <TextField
          label="Search by User / Journal"
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
          <MenuItem value="SUCCESS">Success</MenuItem>
          <MenuItem value="FAILED">Failed</MenuItem>
          <MenuItem value="REFUNDED">Refunded</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>

        </TextField>

      </Box>

      {/* Table */}

      <Card>

        <CardContent>

          <Table>

            <TableHead>

              <TableRow>
                <TableCell>Payment ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Journal</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Receipt</TableCell>
              </TableRow>

            </TableHead>

            <TableBody>

              {filtered.map((payment) => (

                <TableRow key={payment.id} hover>

                  <TableCell>{payment.id}</TableCell>

                  <TableCell>{payment.userName}</TableCell>

                  <TableCell>{payment.journalTitle}</TableCell>

                  <TableCell>₹{payment.amount}</TableCell>

                  <TableCell>

                    <Chip
                      label={payment.status}
                      color={getStatusColor(payment.status)}
                      size="small"
                    />

                  </TableCell>

                  <TableCell>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>

                    {payment.receiptId ? (

                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleDownloadReceipt(payment.receiptId)}
                      >
                        Download
                      </Button>

                    ) : "-"}

                  </TableCell>

                </TableRow>

              ))}

              {filtered.length === 0 && (

                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No payments found
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

export default ManagePayments;