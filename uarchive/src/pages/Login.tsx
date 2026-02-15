import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center">
      <div className="w-full max-w-md px-6 py-12">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
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
            <div className="mt-4 text-center">
              <Link to="/register" className="text-sm text-uofc-red hover:underline">
                Don't have an account? Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
