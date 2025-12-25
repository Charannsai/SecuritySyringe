import { Alert } from "../components/ui/index.jsx";
import { UserForm } from "../components/users/UserForm";
import { UserList } from "../components/users/UserList";

export function Dashboard({ users, loading, error, onAddUser, onUpdateUser, onDeleteUser }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
        <p className="text-neutral-400">Manage users through the secure gateway</p>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <UserForm onAddUser={onAddUser} loading={loading} />
      
      <UserList
        users={users}
        loading={loading}
        onUpdateUser={onUpdateUser}
        onDeleteUser={onDeleteUser}
      />
    </div>
  );
}