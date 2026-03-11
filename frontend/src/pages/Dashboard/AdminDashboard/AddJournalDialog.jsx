import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
} from "@mui/material";

import {
  createJournal,
  updateJournal,
} from "../../../Service/JournalApi";

const AddJournalDialog = ({ open, onClose, journal, onSave }) => {

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [publisher, setPublisher] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  // Prefill when editing
  useEffect(() => {

    if (journal) {

      setTitle(journal.title || "");
      setPrice(journal.price || "");
      setDescription(journal.description || "");
      setPublisher(journal.publisher || "");

      if (journal.imageUrl) {
        setPreview(journal.imageUrl);
      }

    } else {

      setTitle("");
      setPrice("");
      setDescription("");
      setPublisher("");
      setImage(null);
      setPreview(null);

    }

  }, [journal, open]);



  // IMAGE CHANGE
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImage(file);

    const imagePreview = URL.createObjectURL(file);

    setPreview(imagePreview);
  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!title || !price || !description || !publisher) {
      alert("All fields are required");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("publisher", publisher);

      if (image) {
        formData.append("image", image);
      }

      let res;

      if (journal) {
        res = await updateJournal(journal.id, formData);
      } else {
        res = await createJournal(formData);
      }

      onSave(res.data);

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

      <DialogTitle>
        {journal ? "Edit Journal" : "Add New Journal"}
      </DialogTitle>

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

            {/* IMAGE UPLOAD */}

            <Button variant="outlined" component="label">
              Upload Journal Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {/* IMAGE PREVIEW */}

            {preview && (
              <Box
                component="img"
                src={preview}
                alt="Preview"
                sx={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            )}

          </Stack>

        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>

          <Button
            onClick={onClose}
            variant="outlined"
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : journal
              ? "Update Journal"
              : "Add Journal"}
          </Button>

        </DialogActions>

      </form>

    </Dialog>
  );
};

export default AddJournalDialog;