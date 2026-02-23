import { useSignIn, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { getCurrentUser } from "../../Service/UserApi"; // adjust path if needed

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);



  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      await setActive({ session: result.createdSessionId });

      // 🔥 Call your backend to get current user
      const { data } = await getCurrentUser();

      console.log("Backend user:", data);

      // You can store this in localStorage / context if you want
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect after login
      navigate("/"); // change to your route z
    } catch (err) {
      alert(err.errors?.[0]?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Sign In</h2>

        <form onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />

          <div className="login-links-row">
            <Link to="/reset-password" className="forgot-link">
              Forgot Password?
            </Link>

            <Link to="/register" className="register-link">
              Don't have an account?
            </Link>
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
