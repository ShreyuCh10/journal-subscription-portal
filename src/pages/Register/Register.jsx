import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "./Register.css";

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
      setError("Signup service not loaded yet. Please try again.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
     
      await signUp.create({
        emailAddress,
        password,
        firstName: name.split(" ")[0] || "",
        lastName: name.split(" ").slice(1).join(" ") || "",
        username: name.split(" ")[0] + Math.floor(Math.random() * 1000), // required by Clerk
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      navigate("/verify-email", { state: { name } });
    } catch (err) {
      console.error(err);
      setError(err.errors?.[0]?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Sign Up</h2>

        <form onSubmit={handleSignup}>
          <input
            className="register-input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            className="register-input"
            type="email"
            placeholder="Email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              className="register-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>

          <div className="password-wrapper">
            <input
              className="register-input"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff /> : <Eye />}
            </span>
          </div>

          {error && <p className="register-error">{error}</p>}

          <button className="register-button" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

