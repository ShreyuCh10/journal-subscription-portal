import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { getCurrentUser } from "../Service/UserApi";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">JH</span>
          </div>
          <span className="text-blue-900 font-bold text-lg">JournalHub</span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 1 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"
          }`}>
            1
          </div>
          <div className={`flex-1 h-px ${step === 2 ? "bg-blue-600" : "bg-slate-200"}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step === 2 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-400"
          }`}>
            2
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-blue-900 mb-1">
          {step === 1 ? "Reset Password" : "Create New Password"}
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          {step === 1
            ? "Enter your email and we'll send you a reset code"
            : "Enter the code sent to your email and set a new password"}
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        {/* ── Step 1: Email ── */}
        {step === 1 && (
          <form onSubmit={sendResetCode} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>
        )}

        {/* ── Step 2: Code + New Password ── */}
        {step === 2 && (
          <form onSubmit={resetPassword} className="space-y-4">

            {/* Verification Code */}
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">
                Verification Code
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition tracking-widest"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </button>

            {/* Back to step 1 */}
            <button
              type="button"
              onClick={() => { setStep(1); setError(""); }}
              className="w-full text-sm text-slate-400 hover:text-blue-600 transition bg-transparent border-none cursor-pointer"
            >
              ← Use a different email
            </button>
          </form>
        )}

        {/* Back to Login */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        <p className="text-center text-sm text-slate-500">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;

