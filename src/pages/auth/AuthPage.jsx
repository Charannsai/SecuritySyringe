import { useState } from "react";
import { SignIn } from "../../components/auth/SignIn";
import { SignUp } from "../../components/auth/SignUp";

export function AuthPage({ onSignIn, onOAuth, onSignUp, onResetPassword, loading, error }) {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isSignUp ? (
          <SignUp
            onSignUp={onSignUp}
            onSwitchToSignIn={() => setIsSignUp(false)}
            loading={loading}
            error={error}
          />
        ) : (
          <SignIn
            onSignIn={onSignIn}
            onOAuth={onOAuth}
            onSwitchToSignUp={() => setIsSignUp(true)}
            onResetPassword={onResetPassword}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}