import { useState } from "react";
import { Button, Input, Card, Alert } from "../ui/index.jsx";

export function SignIn({ onSignIn,onOAuth, onSwitchToSignUp, onResetPassword, loading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetMsg, setResetMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isResetMode) {
      handleReset();
    } else {
      onSignIn(email, password);
    }
  };

  const handleReset = async () => {
    setResetMsg("");
    const success = await onResetPassword(email);
    if (success) {
      setResetMsg("Password reset link sent! Check your email.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isResetMode ? "Reset Password" : "Welcome Back"}
        </h2>
        <p className="text-neutral-400">
          {isResetMode ? "Enter your email to receive a reset link" : "Sign in to your account"}
        </p>
      </div>

      {error && <Alert type="error" className="mb-4">{error}</Alert>}
      {resetMsg && <Alert type="success" className="mb-4">{resetMsg}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Email
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || (isResetMode && !!resetMsg)}
          />
        </div>

        {!isResetMode && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-neutral-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(true);
                  setResetMsg("");
                }}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Forgot password?
              </button>
            </div>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading || (isResetMode && !!resetMsg)}
        >
          {loading
            ? "Processing..."
            : isResetMode
              ? "Send Reset Link"
              : "Sign In"}
        </Button>

        {isResetMode && (
          <Button
            type="button"
            variant="secondary"
            className="w-full mt-2 bg-neutral-700 hover:bg-neutral-600"
            onClick={() => {
              setIsResetMode(false);
              setResetMsg("");
            }}
            disabled={loading}
          >
            Back to Sign In
          </Button>
        )}
      </form>
<div className="mt-6 space-y-3">
  <Button
    type="button"
    className="w-full bg-blue-400 text-black hover:bg-neutral-200"
    onClick={() => onOAuth("google")}
    disabled={loading}
  >
    Continue with Google
  </Button>

  <Button
    type="button"
    className="w-full bg-neutral-800 text-white hover:bg-neutral-700"
    onClick={() => onOAuth("github")}
    disabled={loading}
  >
    Continue with GitHub
  </Button>
</div>

      {!isResetMode && (
        <div className="mt-6 text-center">
          <p className="text-neutral-400">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToSignUp}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      )}
    </Card>
  );
}