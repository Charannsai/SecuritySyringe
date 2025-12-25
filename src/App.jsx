import { useAuth } from "./hooks/useAuth";
import { useUsers } from "./hooks/useUsers";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/auth/AuthPage";
import { Dashboard } from "./pages/Dashboard";

export default function App() {
  const { session, loading: authLoading, error: authError, signIn, signUp, signOut } = useAuth();
  const { users, loading: usersLoading, error: usersError, addUser, updateUser, deleteUser } = useUsers(session);

  const loading = authLoading || usersLoading;
  const error = authError || usersError;

  if (!session) {
    return (
      <AuthPage
        onSignIn={signIn}
        onSignUp={signUp}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <Layout session={session} onSignOut={signOut}>
      <Dashboard
        users={users}
        loading={loading}
        error={error}
        onAddUser={addUser}
        onUpdateUser={updateUser}
        onDeleteUser={deleteUser}
      />
    </Layout>
  );
}
