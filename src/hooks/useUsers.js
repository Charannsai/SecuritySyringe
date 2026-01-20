import { useState, useEffect } from "react";
import { gatewayRequest } from "../services/gateway";

export function useUsers(session) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    if (!session) return;

    setLoading(true);
    setError("");

    try {
      const data = await gatewayRequest({
  capability: "supabase.table.select",
  intent: "data.read",
  resource: { table: "users" },
  payload: {
    select: ["id","name", "role"],
    
       orderBy: { column: "created_at", direction: "desc" },
  limit: 5
  },
  
},session);

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (name, role) => {
    if (!name || !role) return false;

    setLoading(true);
    setError("");

    try {
      await gatewayRequest({
        capability: "supabase.table.insert",
        intent: "data.write",
        resource: { table: "users" },
        payload: {
          data: { name, role },
        },
      }, session);

      await loadUsers();
      return true;
    } catch (err) {
      console.error(err);
      setError("Failed to add user");
      setLoading(false);
      return false;
    }
  };

  const updateUser = async (id, updates) => {
  if (!id || !updates) {
    setError("Invalid update request");
    return false;
  }

  setLoading(true);
  setError("");

  try {
    await gatewayRequest(
      {
        capability: "supabase.table.update",
        intent: "data.write",
        resource: { table: "users" },
        payload: {
          where: {
            id: { op: "eq", value: id },
          },
          data: updates,
        },
      },
      session
    );

    await loadUsers();
    return true;
  } catch (err) {
    console.error(err);
    setError("Failed to update user");
    return false;
  } finally {
    setLoading(false);
  }
};

const deleteUser = async (id) => {
  if (!id) {
    setError("Invalid user id");
    return false;
  }

  if (!confirm("Delete this user?")) return false;

  setLoading(true);
  setError("");

  try {
    await gatewayRequest(
      {
        capability: "supabase.table.delete",
        intent: "data.delete",
        resource: { table: "users" },
        payload: {
          where: {
            id: { op: "eq", value: id  },
          },
        },
      },
      session
    );

    await loadUsers();
    return true;
  } catch (err) {
    console.error(err);
    setError("Delete failed");
    return false;
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadUsers();
  }, [session]);

  return {
    users,
    loading,
    error,
    loadUsers,
    addUser,
    updateUser,
    deleteUser,
  };
}