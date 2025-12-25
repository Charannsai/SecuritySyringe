import { Alert } from "../components/ui/index.jsx";
import { UserForm } from "../components/users/UserForm";
import { UserList } from "../components/users/UserList";
import { UserProfile } from "../components/users/UserProfile";

export function Dashboard({ session, users, loading, error, onAddUser, onUpdateUser, onDeleteUser, onUpdateEmail }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
        <p className="text-neutral-400">Manage users through the secure gateway</p>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <UserProfile
            session={session}
            onUpdateEmail={onUpdateEmail}
            loading={loading}
            error={error}
          />
          <UserForm onAddUser={onAddUser} loading={loading} />
        </div>

        <div>
          <UserList
            users={users}
            loading={loading}
            onUpdateUser={onUpdateUser}
            onDeleteUser={onDeleteUser}
          />
        </div>
      </div>
    </div>
  );
}