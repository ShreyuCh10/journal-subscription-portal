import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { getCurrentUser } from "../Service/UserApi";
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
  InputAdornment,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
const ResetPassword = () => {
  const { signIn, isLoaded } = useSignIn();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const sendResetCode = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setStep(2);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      try {
        const { data } = await getCurrentUser();
        localStorage.setItem("user", JSON.stringify(data));
      } catch (apiErr) {
        console.warn("Could not fetch backend user:", apiErr);
      }
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.errors?.[0]?.message || "Password reset failed");
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
                {step === 1 ? "Reset your password" : "Create new password"}
              </Typography>
            </Box>

            {/* Stepper */}
            <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 4 }}>
              <Step>
                <StepLabel>Email</StepLabel>
              </Step>
              <Step>
                <StepLabel>Verify</StepLabel>
              </Step>
            </Stepper>

            {/* Error */}
            {error && (
              <Box mb={2}>
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              </Box>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <Box component="form" onSubmit={sendResetCode}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  size="small"
                  margin="normal"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    "Send Reset Code"
                  )}
                </Button>
              </Box>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <Box component="form" onSubmit={resetPassword}>

                <TextField
                  label="Verification Code"
                  fullWidth
                  size="small"
                  margin="normal"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  inputProps={{ style: { letterSpacing: "4px" } }}
                />

                <TextField
                  label="New Password"
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
                    "Reset Password"
                  )}
                </Button>

                <Button
                  onClick={() => { setStep(1); setError(""); }}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Use a different email
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="caption"
              display="block"
              textAlign="center"
              color="text.secondary"
            >
              Remember your password?{" "}
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

export default ResetPassword;

