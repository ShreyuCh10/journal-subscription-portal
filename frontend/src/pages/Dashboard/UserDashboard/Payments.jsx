import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Divider,
  TablePagination
} from "@mui/material";

import CreditCardIcon from "@mui/icons-material/CreditCard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { getMyPayments } from "../../../Service/PaymentApi";
import { downloadReceiptByPaymentId } from "../../../Service/ReceiptApi";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ================= FETCH PAYMENTS =================
  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await getMyPayments();
      setPayments(res.data || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= SUMMARY =================
  const totalSpent = useMemo(() => {
    return payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [payments]);

  // ================= PAGINATION =================
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ================= DOWNLOAD =================
  const handleDownload = async (paymentId) => {
    try {
      setDownloadingId(paymentId);

      const res = await downloadReceiptByPaymentId(paymentId);

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${paymentId}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloadingId(null);
    }
  };

  // ================= UI =================
  return (
    <Box
      sx={{
        ml: "60px",
        px: 5,
        py: 5,
        minHeight: "100vh",
        backgroundColor: "background.default"
      }}
    >
      <Typography variant="h4" gutterBottom>
        My Payments
      </Typography>

      {/* ================= SUMMARY ================= */}
      {!loading && payments.length > 0 && (
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Payments
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {payments.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Amount Spent
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color="secondary.main"
                >
                  ₹{totalSpent}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* ================= LOADING ================= */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="300px"
        >
          <CircularProgress />
        </Box>
      ) : payments.length === 0 ? (
        /* ================= EMPTY ================= */
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh"
        >
          <Card sx={{ p: 6, textAlign: "center", width: 420 }}>
            <CreditCardIcon
              sx={{ fontSize: 60, color: "secondary.main", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              No Payments Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Once you subscribe to a journal, your payments will appear here.
            </Typography>
            <Button
              variant="contained"
              onClick={() => (window.location.href = "/journals")}
            >
              Browse Journals
            </Button>
          </Card>
        </Box>
      ) : (
        /* ================= TABLE ================= */
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Payment History
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Journal</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment ID</TableCell>
                  <TableCell>Receipt</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {payments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((p) => (
                    <TableRow key={p.id} hover>

                      <TableCell>
                        <Typography fontWeight={600}>
                          {p.journalTitle}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          fontWeight={600}
                          color="secondary.main"
                        >
                          ₹{p.amount}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {new Date(p.paymentDate).toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={p.status}
                          color={
                            p.status === "SUCCESS"
                              ? "success"
                              : p.status === "PENDING"
                              ? "warning"
                              : "error"
                          }
                          size="small"
                        />
                      </TableCell>

                      <TableCell sx={{ fontSize: 12, color: "text.secondary" }}>
                        {p.razorpayPaymentId}
                      </TableCell>

                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<ReceiptLongIcon />}
                          onClick={() => handleDownload(p.id)}
                          disabled={downloadingId === p.id}
                        >
                          {downloadingId === p.id
                            ? "Downloading..."
                            : "Download"}
                        </Button>
                      </TableCell>

                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={payments.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Payments;