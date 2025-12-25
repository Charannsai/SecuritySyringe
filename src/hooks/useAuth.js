import { useState, useEffect } from "react";
import { gatewayRequest } from "../services/gateway";

const parseAuthCallback = () => {
  const hash = window.location.hash;
  if (!hash || !hash.includes("access_token")) return null;

  const params = new URLSearchParams(hash.substring(1));

  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");
  const token_type = params.get("token_type");
  const expires_in = params.get("expires_in");
  const type = params.get("type"); // signup | recovery | invite

  if (!access_token || !refresh_token) return null;

  return {
    access_token,
    refresh_token,
    token_type,
    expires_in: expires_in ? Number(expires_in) : null,
    type,
  };
};

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Handle callback on app load or regular session restore
  useEffect(() => {
    const callbackSession = parseAuthCallback();

    if (callbackSession) {
      setSession(callbackSession);

      // Clean URL (remove tokens from address bar)
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    } else {
      // Fallback to local storage if no hash is present
      const savedSession = localStorage.getItem('session');
      if (savedSession) {
        try {
          setSession(JSON.parse(savedSession));
        } catch (err) {
          localStorage.removeItem('session');
        }
      }
    }

    setLoading(false);
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (session) {
      localStorage.setItem('session', JSON.stringify(session));
    } else {
      localStorage.removeItem('session');
    }
  }, [session]);

  const signIn = async (email, password) => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      const data = await gatewayRequest({
        intent: "auth.write",
        capability: "supabase.auth.signIn",
        payload: { email, password },
      });

      if (!data?.access_token) {
        throw new Error("Invalid credentials");
      }

      setSession(data);
      return true;
    } catch (err) {
      console.error(err);
      setError("Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInWithOAuth = async (provider) => {
  setLoading(true);
  setError("");

  try {
    // This request returns a REDIRECT response, not JSON
    const res = await gatewayRequest({
      intent: "auth.write",
      capability: "supabase.auth.oauth.start",
      payload: {
        provider, 
      },
    }, null, { raw: true });

    // IMPORTANT: redirect browser
    if (res?.url) {
      window.location.href = res.url;
    } else {
      throw new Error("OAuth redirect failed");
    }
  } catch (err) {
    console.error(err);
    setError("OAuth sign-in failed");
    setLoading(false);
  }
};


  const signUp = async (email, password) => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      await gatewayRequest({
        intent: "auth.write",
        capability: "supabase.auth.signUp",
        payload: {
          email,
          password,
          options: {
            emailRedirectTo: "http://localhost:5173/",
          },
        },
      });

      // No session yet — user must verify email
      return true;
    } catch (err) {
      console.error(err);
      setError("Signup failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (session) {
      try {
        await gatewayRequest({
          intent: "auth.write",
          capability: "supabase.auth.signOut",
        }, session);
      } catch (err) {
        console.error("Sign out error:", err);
      }
    }
    setSession(null);
    setError("");
  };

  const resetPassword = async (email) => {
    if (!email) {
      setError("Email is required");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      await gatewayRequest({
        intent: "auth.write",
        capability: "supabase.auth.resetPassword",
        payload: {
          email,
          redirectTo: "http://localhost:5173", // Ensure user comes back after clicking link
        },
      });
      return true;
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Failed to send reset email");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword) => {
    if (!newPassword) {
      setError("New password is required");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      await gatewayRequest({
        intent: "auth.write",
        capability: "supabase.auth.updateUser",
        payload: {
          password: newPassword,
        },
      }, session);

      return true;
    } catch (err) {
      console.error("Update password error:", err);
      setError("Failed to update password");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateEmail = async (newEmail) => {
    if (!newEmail) {
      setError("New email is required");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      const data = await gatewayRequest({
        intent: "auth.write",
        capability: "supabase.auth.updateUser",
        payload: {
          email: newEmail,
        },
      }, session);

      // If email update is successful, we might get a new session or need to handle confirmation
      if (data) {
        // If the API returns a session/user object, we might update it. 
        // However, typically email updates require verification.
      }
      return true;
    } catch (err) {
      console.error("Update email error:", err);
      setError("Failed to update email");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    if (!session?.refresh_token) return false;

    try {
      const data = await gatewayRequest({
        intent: "auth.read",
        capability: "supabase.auth.refresh",
        payload: {
          refresh_token: session.refresh_token,
        },
      });

      if (data?.access_token) {
        setSession(data);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Refresh error:", err);
      setSession(null);
      return false;
    }
  };

  // Auto-refresh on mount if session exists
  useEffect(() => {
    if (session?.refresh_token) {
      refreshSession();
    }
  }, []);

  return {
    session,
    loading,
    error,
    signIn,
    signInWithOAuth,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateEmail,
    refreshSession,
    setError,
  };
}