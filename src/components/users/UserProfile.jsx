import { useState } from "react";
import { Button, Input, Card, Alert } from "../ui";

export function UserProfile({ session, onUpdateEmail, loading, error }) {
    const [email, setEmail] = useState(session?.user?.email || "");
    const [success, setSuccess] = useState("");
    const [localError, setLocalError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess("");
        setLocalError("");

        if (!email) {
            setLocalError("Email is required");
            return;
        }

        if (email === session?.user?.email) {
            setLocalError("Please enter a different email");
            return;
        }

        const result = await onUpdateEmail(email);
        if (result) {
            setSuccess("Check your new email for a confirmation link.");
        }
    };

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>

            {error && <Alert type="error" className="mb-4">{error}</Alert>}
            {localError && <Alert type="error" className="mb-4">{localError}</Alert>}
            {success && <Alert type="success" className="mb-4">{success}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">
                        Email Address
                    </label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your new email"
                        disabled={loading}
                    />
                </div>

                <div className="flex justify-end">
                    <Button type="submit" loading={loading}>
                        Update User Email
                    </Button>
                </div>
            </form>
        </Card>
    );
}
