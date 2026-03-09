import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  CircularProgress,
  IconButton,
  InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { createUser } from "../Service/UserApi";

const Register = () => {
  const { isLoaded, signUp } = useSignUp();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLoaded) {
      setError("Signup service not loaded yet.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp.create({
        emailAddress,
        password,
        firstName: name.split(" ")[0] || "",
        lastName: name.split(" ").slice(1).join(" ") || "",
        username: name.split(" ")[0] + Math.floor(Math.random() * 1000),
        publicMetadata: { role: "user" },
      });

      await createUser({
        clerkUserId: result.createdUserId || result.id,
        email: emailAddress,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      navigate("/verify-email", { state: { name } });
    } catch (err) {
      setError(err.errors?.[0]?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f9fafb 0%, #eef2ff 100%)",
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            px: 4,
            py: 5,
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent sx={{ p: 0 }}>

            {/* Brand */}
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h5"
                color="primary"
                sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
              >
                JournalHub
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your account
              </Typography>
            </Box>

            {/* Error */}
            {error && (
              <Box mb={2}>
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              </Box>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSignup}>

              <TextField
                label="Full Name"
                fullWidth
                size="small"
                margin="normal"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                size="small"
                margin="normal"
                required
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                size="small"
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                fullWidth
                size="small"
                margin="normal"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirm(!showConfirm)}
                        edge="end"
                      >
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, py: 1.2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="caption"
              display="block"
              textAlign="center"
              color="text.secondary"
            >
              Already have an account?{" "}
              <Typography
                component={Link}
                to="/login"
                color="secondary"
                sx={{
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              >
                Sign in
              </Typography>
            </Typography>

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;