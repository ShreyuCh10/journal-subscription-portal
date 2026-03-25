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
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";

import {
  createJournal,
  updateJournal,
} from "../../../Service/JournalApi";

const AddJournalDialog = ({ open, onClose, journal, onSave }) => {

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    publisher: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ===== PREFILL =====
  useEffect(() => {
    if (journal) {
      setForm({
        title: journal.title || "",
        price: journal.price || "",
        description: journal.description || "",
        publisher: journal.publisher || "",
      });
      setPreview(journal.imageUrl || null);
    } else {
      setForm({
        title: "",
        price: "",
        description: "",
        publisher: "",
      });
      setImage(null);
      setPreview(null);
    }
    setErrors({});
  }, [journal, open]);

  // ===== CHANGE HANDLER =====
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ===== IMAGE =====
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ===== VALIDATION =====
  const validate = () => {
    const newErrors = {};

    if (!form.title) newErrors.title = "Title required";
    if (!form.price) newErrors.price = "Price required";
    if (!form.publisher) newErrors.publisher = "Publisher required";
    if (!form.description) newErrors.description = "Description required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);

      const res = journal
        ? await updateJournal(journal.id, fd)
        : await createJournal(fd);

      onSave(res.data);
      onClose();

    } catch (err) {
      console.error(err);
      alert("Failed to save journal");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">

      <DialogTitle fontWeight={700}>
        {journal ? "✏️ Edit Journal" : "➕ Add New Journal"}
      </DialogTitle>

      <Divider />

      <form onSubmit={handleSubmit}>
        <DialogContent>

          <Stack spacing={3}>

            {/* ===== BASIC INFO ===== */}
            <Box>
              <Typography fontWeight={600} mb={1}>
                Basic Information
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="Title"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  error={!!errors.title}
                  helperText={errors.title}
                  fullWidth
                />

                <TextField
                  label="Price (₹)"
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  error={!!errors.price}
                  helperText={errors.price}
                  fullWidth
                />

                <TextField
                  label="Publisher"
                  value={form.publisher}
                  onChange={(e) => handleChange("publisher", e.target.value)}
                  error={!!errors.publisher}
                  helperText={errors.publisher}
                  fullWidth
                />
              </Stack>
            </Box>

            {/* ===== DESCRIPTION ===== */}
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
              fullWidth
            />

            {/* ===== IMAGE ===== */}
            <Box>
              <Typography fontWeight={600} mb={1}>
                Journal Image
              </Typography>

              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  py: 2,
                  borderStyle: "dashed",
                }}
              >
                Click to Upload Image
                <input hidden type="file" accept="image/*" onChange={handleImageChange} />
              </Button>

              {preview && (
                <Box
                  mt={2}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #eee",
                  }}
                >
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Box>

          </Stack>

        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>

          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 140 }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : journal ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>

        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddJournalDialog;