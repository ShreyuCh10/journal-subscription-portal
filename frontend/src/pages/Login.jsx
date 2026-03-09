import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
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
  CircularProgress
} from "@mui/material";
import { getCurrentUser } from "../Service/UserApi";

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      await setActive({ session: result.createdSessionId });

      const { data } = await getCurrentUser();
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/");
    } catch (err) {
      setError(err.errors?.[0]?.message || "Sign in failed.");
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

            {/* Logo / Brand */}
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h5"
                color="primary"
                sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
              >
                JournalHub
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Welcome back
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
            <Box component="form" onSubmit={handleSignIn}>

              <TextField
                label="Email"
                type="email"
                fullWidth
                size="small"
                margin="normal"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                size="small"
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Box display="flex" justifyContent="flex-end" mt={1}>
                <Typography
                  component={Link}
                  to="/reset-password"
                  variant="caption"
                  color="secondary"
                  sx={{ textDecoration: "none" }}
                >
                  Forgot password?
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.2,
                  fontSize: "0.9rem",
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Sign In"
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
              Don’t have an account?{" "}
              <Typography
                component={Link}
                to="/register"
                color="secondary"
                sx={{
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              >
                Sign up
              </Typography>
            </Typography>

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;