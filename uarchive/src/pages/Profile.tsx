import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function Profile() {
  const auth = useAuth();
  const [userData, setUserData] = useState<any | null>(auth.user ?? null);
  const [loading, setLoading] = useState<boolean>(!auth.user && auth.isAuthenticated);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!auth.isAuthenticated) return;
      setLoading(true);
      try {
        const envBase = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";
        const base = envBase ? (envBase as string).replace(/\/+$/, "") : "";
        const url = base ? `${base}/api/users/me` : "/api/users/me";
        const res = await fetch(url, { headers: { Authorization: `Bearer ${auth.token}` } });
        if (res.status === 401) {
          auth.logout();
          return;
        }
        if (!res.ok) {
          setUserData(auth.user ?? null);
          return;
        }
        const data = await res.json();
        if (mounted) setUserData(data);
      } catch (err) {
        setUserData(auth.user ?? null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [auth.token]);

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

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header />
      <div className="flex items-start justify-center pt-12">
        <div className="w-full max-w-md px-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-semibold mb-4">Profile</h1>

            {loading ? (
              <div className="text-sm text-neutral-600">Loading...</div>
            ) : (
              <div className="space-y-2 text-sm text-neutral-700">
                <div><strong>Username:</strong> {userData?.username ?? "-"}</div>
                <div><strong>Email:</strong> {userData?.email ?? "-"}</div>
                <div><strong>Degree:</strong> {userData?.degree ?? "-"}</div>
                <div><strong>Joined:</strong> {userData?.joinedAt ? new Date(userData.joinedAt).toLocaleDateString() : "-"}</div>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <Link to="/" className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-100">
                Back
              </Link>
              <button
                className="rounded-xl bg-uofc-red px-4 py-2 text-sm font-medium text-white hover:bg-uofc-darkred"
                onClick={() => auth.logout()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
