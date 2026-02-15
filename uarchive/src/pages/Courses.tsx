import { Link } from "react-router-dom";

export default function Courses() {
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

      <div className="p-6">Courses (placeholder)</div>
    </main>
  );
}
