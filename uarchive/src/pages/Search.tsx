import { useSearchParams, Link } from "react-router-dom";
import Header from "../components/Header";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header />

      <div className="p-6">Search (placeholder). Query: {q}</div>
    </main>
  );
}
