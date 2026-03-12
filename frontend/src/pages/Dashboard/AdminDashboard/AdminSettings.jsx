import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { getSettings, updateSettings } from "../../../Service/SettingsApi";

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    site_name: "Journal Hub",
    support_email: "",
    razorpay_key_id: "",
    enable_email_notifications: "true",
    dispatch_auto_create: "true",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        if (res.data && Object.keys(res.data).length > 0) {
          setSettings((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await updateSettings(settings);
      setSettings((prev) => ({ ...prev, ...res.data }));
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 700 }}>
      <Typography variant="h4" fontWeight={700}>
        ⚙️ Settings
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* General Settings */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            General
          </Typography>

          <TextField
            label="Site Name"
            value={settings.site_name}
            onChange={(e) => handleChange("site_name", e.target.value)}
            fullWidth
          />

          <TextField
            label="Support Email"
            value={settings.support_email}
            onChange={(e) => handleChange("support_email", e.target.value)}
            fullWidth
            placeholder="support@example.com"
          />
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Payment
          </Typography>

          <TextField
            label="Razorpay Key ID"
            value={settings.razorpay_key_id}
            onChange={(e) => handleChange("razorpay_key_id", e.target.value)}
            fullWidth
            placeholder="rzp_live_xxxxxxx"
            helperText="Your Razorpay public key for payment integration"
          />
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Notifications & Automation
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={settings.enable_email_notifications === "true"}
                onChange={(e) =>
                  handleChange("enable_email_notifications", e.target.checked ? "true" : "false")
                }
              />
            }
            label="Enable Email Notifications"
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.dispatch_auto_create === "true"}
                onChange={(e) =>
                  handleChange("dispatch_auto_create", e.target.checked ? "true" : "false")
                }
              />
            }
            label="Auto-create Dispatch on Payment Success"
          />
        </CardContent>
      </Card>

      <Divider />

      {/* Save Button */}
      <Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{ borderRadius: 2, px: 4 }}
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        message="Settings saved successfully!"
      />
    </Box>
  );
};

export default AdminSettingsPage;
