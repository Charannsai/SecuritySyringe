import { useAuth } from "./hooks/useAuth";
import { useUsers } from "./hooks/useUsers";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/auth/AuthPage";
import { UpdatePasswordPage } from "./pages/auth/UpdatePasswordPage";
import { Dashboard } from "./pages/Dashboard";

export default function App() {
  const { session, loading: authLoading, error: authError, signIn, signUp, signOut, resetPassword, updatePassword, updateEmail, signInWithOAuth } = useAuth();
  const { users, loading: usersLoading, error: usersError, addUser, updateUser, deleteUser } = useUsers(session);

  const loading = authLoading || usersLoading;
  const error = authError || usersError;

  if (!session) {
    return (
      <AuthPage
        onSignIn={signIn}
        onOAuth={signInWithOAuth}
        onSignUp={signUp}
        onResetPassword={resetPassword}
        loading={loading}
        error={error}
      />
    );
  }

  if (session.type === "recovery") {
    return (
      <UpdatePasswordPage
        onUpdatePassword={updatePassword}
        onSignOut={signOut}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <Layout session={session} onSignOut={signOut}>
      <Dashboard
        session={session}
        users={users}
        loading={loading}
        error={error}
        onAddUser={addUser}
        onUpdateUser={updateUser}
        onDeleteUser={deleteUser}
        onUpdateEmail={updateEmail}
      />
    </Layout>
  );
}
