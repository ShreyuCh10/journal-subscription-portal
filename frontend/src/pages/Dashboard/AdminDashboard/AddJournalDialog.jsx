import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import {
  createJournal,
  updateJournal,
} from "../../../Service/JournalApi"; // 👈 make sure updateJournal exists

const AddJournalDialog = ({ open, onClose, journal, onSave }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [publisher, setPublisher] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill when editing
  useEffect(() => {
    if (journal) {
      setTitle(journal.title || "");
      setPrice(journal.price || "");
      setDescription(journal.description || "");
      setPublisher(journal.publisher || "");
    } else {
      // Reset when adding
      setTitle("");
      setPrice("");
      setDescription("");
      setPublisher("");
    }
  }, [journal, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !description || !publisher) {
      alert("All fields are required");
      return;
    }

    const journalPayload = {
      title,
      price: Number(price),
      description,
      publisher,
    };

    try {
      setLoading(true);

      let res;
      if (journal) {
        // EDIT
        res = await updateJournal(journal.id, journalPayload);
      } else {
        // ADD
        res = await createJournal(journalPayload);
      }

      onSave(res.data); // send back to ManageJournals
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save journal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{journal ? "Edit Journal" : "Add New Journal"}</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Price (₹)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="outlined" disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Saving..." : journal ? "Update Journal" : "Add Journal"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddJournalDialog;