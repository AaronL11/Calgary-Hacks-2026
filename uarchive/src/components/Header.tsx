import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function initials(name: string | undefined) {
  if (!name) return "?";
  const parts = name.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Header() {
  const auth = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-full items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">UArchive</div>
            <div className="text-xs text-neutral-600">Integrity-first course memory bank</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <Link className="rounded-lg px-3 py-2 hover:bg-neutral-100" to="/courses">
            Browse
          </Link>

          {auth.isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setOpen((s) => !s)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium text-neutral-800"
                aria-label="Profile"
              >
                {initials(auth.user?.username || auth.user?.email)}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-white shadow-md">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-neutral-50" onClick={() => setOpen(false)}>
                    View profile
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-50"
                    onClick={() => {
                      setOpen(false);
                      auth.logout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              className="rounded-lg bg-uofc-red px-3 py-2 font-medium text-white hover:bg-uofc-darkred"
              to="/login"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
      <div className="h-2 w-full bg-uofc-red" />
    </header>
  );
}
