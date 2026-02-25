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
import {
  getAllJournals,
  deleteJournal as deleteJournalApi,
} from "../../../Service/JournalApi";

const ManageJournals = () => {
  const [journals, setJournals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null); // for edit
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this journal?")) return;

    try {
      await deleteJournalApi(id);
      setJournals((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete journal");
    }
  };

  // OPEN ADD
  const handleAddClick = () => {
    setSelectedJournal(null); // add mode
    setOpenDialog(true);
  };

  // OPEN EDIT
  const handleEditClick = (journal) => {
    setSelectedJournal(journal); // edit mode
    setOpenDialog(true);
  };

  // AFTER SAVE (ADD or EDIT)
  const handleSaveJournal = (savedJournal) => {
    if (selectedJournal) {
      // EDIT: update existing row
      setJournals((prev) =>
        prev.map((j) => (j.id === savedJournal.id ? savedJournal : j))
      );
    } else {
      // ADD: add to top
      setJournals((prev) => [savedJournal, ...prev]);
    }
  };

  if (loading) return <Typography>Loading journals...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold">
          Manage Journals
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Journal
        </Button>
      </Stack>

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
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(journal)}
                  >
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

      {/* Add / Edit Dialog */}
      <AddJournalDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        journal={selectedJournal}     // null = add, object = edit
        onSave={handleSaveJournal}
      />
    </Box>
  );
};

export default ManageJournals;