import { useState, useEffect } from "react";
import { gatewayRequest } from "../services/gateway";

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('session');
    if (savedSession) {
      try {
        setSession(JSON.parse(savedSession));
      } catch (err) {
        localStorage.removeItem('session');
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

  const signUp = async (email, password) => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }

    setLoading(true);
    setError("");

    try {
      const data = await gatewayRequest({
        intent: "auth.write",
        capability: "supabase.auth.signUp",
        payload: { email, password },
      });

      if (!data?.access_token) {
        throw new Error("Signup failed");
      }

      setSession(data);
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
    signUp,
    signOut,
    refreshSession,
    setError,
  };
}