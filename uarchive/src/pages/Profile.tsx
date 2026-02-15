import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="p-6 bg-white rounded shadow">
          <div className="text-sm">You are not logged in.</div>
          <Link to="/login" className="text-uofc-red hover:underline mt-2 block">Login</Link>
        </div>
      </main>
    );
  }

  const user = auth.user || {};

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 flex items-start justify-center pt-12">
      <div className="w-full max-w-md px-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold mb-4">Profile</h1>
          <div className="space-y-2 text-sm text-neutral-700">
            <div><strong>Username:</strong> {user.username}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Degree:</strong> {user.degree ?? "-"}</div>
          </div>

          <div className="mt-6">
            <button
              className="rounded-xl bg-uofc-red px-4 py-2 text-sm font-medium text-white hover:bg-uofc-darkred"
              onClick={() => auth.logout()}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
