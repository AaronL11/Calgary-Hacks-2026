import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
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
            <Link
              className="rounded-lg bg-uofc-red px-3 py-2 font-medium text-white hover:bg-uofc-darkred"
              to="/login"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      <div className="h-2 w-full bg-uofc-red" />

      <div className="mx-auto max-w-4xl px-4 py-12">
        {!isRegistering && !isEditingProfile ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-neutral-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                try {
                  await auth.login(username, password);
                  navigate("/");
                } catch (err: any) {
                  setError(err?.message || "Login failed");
                }
              }}
            >
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
                />
              </div>
                <div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-uofc-red px-4 py-3 text-sm font-medium text-white hover:bg-uofc-darkred"
                  >
                    Login
                  </button>
                  {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
                </div>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsRegistering(true)}
                className="text-sm text-uofc-red hover:underline"
              >
                Don't have an account? Register
              </button>
            </div>
          </div>
        ) : isRegistering ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-semibold mb-6">Register</h1>

            <form className="space-y-4">
              <div>
                <label htmlFor="reg-email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
                />
              </div>

              <div>
                <label htmlFor="reg-username" className="block text-sm font-medium text-neutral-700 mb-1">
                  Username
                </label>
                <input
                  id="reg-username"
                  type="text"
                  placeholder="Choose a username"
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
                />
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-sm font-medium text-neutral-700 mb-1">
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="w-full rounded-xl bg-uofc-red px-4 py-3 text-sm font-medium text-white hover:bg-uofc-darkred"
              >
                Register
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsRegistering(false)}
                className="text-sm text-neutral-600 hover:underline"
              >
                Already have an account? Login
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-semibold mb-6">User Information</h1>

            <form className="space-y-4">
              <div>
                <label htmlFor="course-code" className="block text-sm font-medium text-neutral-700 mb-1">
                  Edit course code
                </label>
                <input
                  id="course-code"
                  type="text"
                  placeholder="e.g., CPSC 413"
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
                />
              </div>

              <div>
                <label htmlFor="available-digit" className="block text-sm font-medium text-neutral-700 mb-1">
                  Available digit out
                </label>
                <input
                  id="available-digit"
                  type="text"
                  placeholder="Enter available digit"
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
                />
              </div>

              <div>
                <label htmlFor="user-degree" className="block text-sm font-medium text-neutral-700 mb-1">
                  Username/Degree
                </label>
                <input
                  id="user-degree"
                  type="text"
                  placeholder="e.g., Computer Science"
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-uofc-red px-4 py-3 text-sm font-medium text-white hover:bg-uofc-darkred"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
