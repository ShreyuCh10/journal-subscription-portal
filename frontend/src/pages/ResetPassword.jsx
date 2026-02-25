import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { getCurrentUser } from "../Service/UserApi"; // adjust path if needed
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
        console.log("Backend user after reset:", data);
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
    <div className="reset-page">
      <div className="reset-card">
        <h2 className="reset-title">
          {step === 1 ? "Reset Password" : "Create New Password"}
        </h2>

        {step === 1 && (
          <form onSubmit={sendResetCode}>
            <input
              className="reset-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {error && <p className="reset-error">{error}</p>}

            <button className="reset-button" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetPassword}>
            <input
              className="reset-input"
              placeholder="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            <div className="password-wrapper">
              <input
                className="reset-input"
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>

            {error && <p className="reset-error">{error}</p>}

            <button className="reset-button" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

