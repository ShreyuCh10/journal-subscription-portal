import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { createUser } from "../Service/UserApi";

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

        {/* Email icon */}
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-blue-900 mb-1 text-center">
          Check your email
        </h2>
        <p className="text-slate-400 text-sm mb-6 text-center">
          We sent a verification code to your email address. Enter it below to confirm your account.
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        {/* Resent success */}
        {resent && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg mb-5">
            ✅ A new code has been sent to your email.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-4">

          {/* Code Input */}
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
              maxLength={6}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition tracking-widest text-center text-lg font-medium"
            />
          </div>

          {/* Submit Button */}
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
                Verifying...
              </span>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        {/* Resend Code */}
        <p className="text-center text-sm text-slate-500 mt-5">
          Didn't receive a code?{" "}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-blue-600 font-medium hover:underline bg-transparent border-none cursor-pointer disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend code"}
          </button>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Back to login */}
        <p className="text-center text-sm text-slate-500">
          Wrong account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Back to Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default VerifyEmail;

