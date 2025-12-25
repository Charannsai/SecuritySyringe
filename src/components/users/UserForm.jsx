import { useState } from "react";
import { Button, Input, Card } from "../ui/index.jsx";

export function UserForm({ onAddUser, loading }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onAddUser(name, role);
    if (success) {
      setName("");
      setRole("");
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Add New User</h3>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
          required
        />
        <Input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="flex-1"
          required
        />
        <Button
          type="submit"
          disabled={loading || !name || !role}
        >
          Add User
        </Button>
      </form>
    </Card>
  );
}