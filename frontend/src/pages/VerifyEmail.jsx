import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { createUser } from "../Service/UserApi";
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
  Alert
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
const VerifyEmail = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: res.createdSessionId });

      const clerkUser = res.createdUserId;
      const email = signUp.emailAddress;

      if (clerkUser) {
        await createUser({
          clerkUserId: clerkUser,
          email: email,
          name: `${signUp.firstName || ""} ${signUp.lastName || ""}`.trim(),
          role: "user",
        });
      }

      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded) return;
    setResending(true);
    setError("");
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Failed to resend code");
    } finally {
      setResending(false);
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
            <Box textAlign="center" mb={3}>
              <Typography
                variant="h5"
                color="primary"
                sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
              >
                JournalHub
              </Typography>
            </Box>

            {/* Email Icon */}
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: "rgba(99,102,241,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <MarkEmailReadIcon color="secondary" fontSize="medium" />
            </Box>

            {/* Heading */}
            <Typography
              variant="h6"
              align="center"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              Check your email
            </Typography>

            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              sx={{ mt: 1, mb: 3 }}
            >
              Enter the 6-digit verification code sent to your email.
            </Typography>

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Resent Success */}
            {resent && (
              <Alert severity="success" sx={{ mb: 2 }}>
                A new verification code has been sent.
              </Alert>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleVerify}>

              <TextField
                label="Verification Code"
                fullWidth
                size="small"
                margin="normal"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputProps={{
                  maxLength: 6,
                  style: {
                    letterSpacing: "6px",
                    textAlign: "center",
                    fontSize: "1rem",
                    fontWeight: 600,
                  },
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
                  "Verify Email"
                )}
              </Button>
            </Box>

            {/* Resend */}
            <Typography
              variant="caption"
              display="block"
              textAlign="center"
              color="text.secondary"
              sx={{ mt: 3 }}
            >
              Didn’t receive the code?{" "}
              <Typography
                component="span"
                color="secondary"
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
                onClick={handleResend}
              >
                {resending ? "Resending..." : "Resend code"}
              </Typography>
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="caption"
              display="block"
              textAlign="center"
              color="text.secondary"
            >
              Wrong account?{" "}
              <Typography
                component={Link}
                to="/login"
                color="secondary"
                sx={{
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                Back to Sign In
              </Typography>
            </Typography>

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default VerifyEmail;

