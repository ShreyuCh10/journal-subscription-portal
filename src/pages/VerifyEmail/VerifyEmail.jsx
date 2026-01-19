import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: res.createdSessionId });
      navigate("/dashboard", {replace:true});
    } catch (err) {
      setError(err.errors?.[0]?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-card">
        <h2 className="verify-title">Verify Email</h2>

        <p className="verify-subtitle">
          Enter the verification code sent to your email
        </p>

        <form onSubmit={handleVerify}>
          <input
            className="verify-input"
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />

          {error && <p className="verify-error">{error}</p>}

          <button className="verify-button" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;

