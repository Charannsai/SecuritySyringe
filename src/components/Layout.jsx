import { Button } from "./ui/index.jsx";

export function Layout({ children, session, onSignOut }) {
  return (
    <div className="min-h-screen bg-neutral-900">
      {session && (
        <header className="bg-neutral-800 border-b border-neutral-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-bold text-white">
                SecuritySyringe
              </h1>
              <Button
                variant="danger"
                size="sm"
                onClick={onSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}