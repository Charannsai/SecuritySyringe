import { useState } from "react";
import { Button } from "./ui/index.jsx";
import { ProfileModal } from "./profile/ProfileModal";

export function Layout({ children, session, onSignOut }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-900">
      {session && (
        <header className="bg-neutral-800 border-b border-neutral-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-white">
                SecuritySyringe
              </h1>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-full transition-colors"
                  aria-label="Profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        session={session}
      />
    </div>
  );
}