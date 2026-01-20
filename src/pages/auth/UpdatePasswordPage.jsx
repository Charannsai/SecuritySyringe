import { useState } from "react";
import { Button, Input, Card, Alert } from "../../components/ui/index.jsx";

export function UpdatePasswordPage({ onUpdatePassword, onSignOut, loading, error }) {
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await onUpdatePassword(password);
        if (result) {
            setSuccess(true);
            setTimeout(async () => {
                await onSignOut();
                // The App component will redirect to AuthPage naturally after signOut
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Set New Password</h2>
                    <p className="text-neutral-400">Please enter your new password below</p>
                </div>

                {error && <Alert type="error" className="mb-4">{error}</Alert>}

                {success ? (
                    <Alert type="success" className="mb-4">
                        Password updated successfully! Redirecting to login...
                    </Alert>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                                New Password
                            </label>
                            <Input
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
}
