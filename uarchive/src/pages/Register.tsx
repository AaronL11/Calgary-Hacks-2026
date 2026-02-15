import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold mb-6">Create an account</h1>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              if (password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
              }
              if (username.length < 3) {
                setError("Username must be at least 3 characters");
                return;
              }
              setLoading(true);
              try {
                await auth.register(username, email, password);
                navigate("/");
              } catch (err: any) {
                setError(err?.message || "Registration failed");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
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
                placeholder="Create a password"
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-uofc-red px-4 py-3 text-sm font-medium text-white hover:bg-uofc-darkred disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create account"}
              </button>
              {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-neutral-600 hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
