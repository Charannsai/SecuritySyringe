import { Button, Card } from "../ui/index.jsx";

export function UserList({ users, loading, onUpdateUser, onDeleteUser }) {
  if (loading && users.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-neutral-400">Loading users...</div>
        </div>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="text-neutral-400">No users found</div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-white mb-4">Users</h3>
      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 bg-neutral-900 rounded-lg border border-neutral-700"
          >
            <div>
              <h4 className="font-medium text-white">{user.name}</h4>
              <p className="text-sm text-neutral-400">{user.role}</p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="warning"
                onClick={() => onUpdateUser(user.id, { role: "editor" })}
                disabled={loading}
              >
                Make Editor
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDeleteUser(user.id)}
                disabled={loading}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}