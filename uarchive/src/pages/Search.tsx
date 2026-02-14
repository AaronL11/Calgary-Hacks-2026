import { useSearchParams } from "react-router-dom";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  return <div className="p-6">Search (placeholder). Query: {q}</div>;
}
