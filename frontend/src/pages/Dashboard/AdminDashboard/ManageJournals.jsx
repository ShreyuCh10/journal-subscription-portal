import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddJournalDialog from "./AddJournalDialog";
import { getAllJournals, deleteJournal as deleteJournalApi } from "../../../Service/JournalApi";

const ManageJournals = () => {
  const [journals, setJournals] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔄 Fetch journals from backend
  useEffect(() => {
    const loadJournals = async () => {
      try {
        const res = await getAllJournals();
        setJournals(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load journals");
      } finally {
        setLoading(false);
      }
    };

    loadJournals();
  }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this journal?")) return;
//
//     try {
//       await deleteJournalApi(id);
//       setJournals((prev) => prev.filter((j) => j.id !== id));
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete journal");
//     }
//   };

  const handleAddJournal = (newJournal) => {
    // After successful backend create, just refresh or append
    setJournals((prev) => [newJournal, ...prev]);
  };

  if (loading) return <Typography>Loading journals...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold">
          Manage Journals
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
        >
          Add Journal
        </Button>
      </Stack>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f7fb" }}>
              <TableCell><b>Title</b></TableCell>
              <TableCell><b>Publisher</b></TableCell>
              <TableCell><b>Price (₹)</b></TableCell>
              <TableCell><b>Created At</b></TableCell>
              <TableCell align="center"><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {journals.map((journal) => (
              <TableRow key={journal.id} hover>
                <TableCell>{journal.title}</TableCell>
                <TableCell>{journal.publisher}</TableCell>
                <TableCell>₹{journal.price}</TableCell>
                <TableCell>
                  {journal.createdAt
                    ? new Date(journal.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(journal.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}

            {journals.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No journals available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Journal Dialog */}
      <AddJournalDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdd={handleAddJournal}
      />
    </Box>
  );
};

export default ManageJournals;