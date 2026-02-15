import { Link, useSearchParams } from "react-router-dom";
import {
  MOCK_COURSES,
  MOCK_PROBLEMS,
  type Course,
  type Problem,
} from "../data/mockData";
import { useState } from "react";

function TagPill({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700">
      {text}
    </span>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

function DifficultyBadge({ level }: { level: number }) {
  const color =
    level >= 8
      ? "bg-red-100 text-red-700"
      : level >= 4
        ? "bg-yellow-100 text-yellow-700"
        : "bg-green-100 text-green-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${color}`}
    >
      Difficulty: {level}/10
    </span>
  );
}

function ProblemCard({ problem }: { problem: Problem }) {
  const [upvotes, setUpvotes] = useState(problem.votes > 0 ? problem.votes : 0);
  const [downvotes, setDownvotes] = useState(0);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  const handleVote = (type: "up" | "down") => {
    if (userVote === type) {
      // Unvote
      if (type === "up") setUpvotes(upvotes - 1);
      else setDownvotes(downvotes - 1);
      setUserVote(null);
    } else {
      // Change or new vote
      if (userVote === "up") setUpvotes(upvotes - 1);
      if (userVote === "down") setDownvotes(downvotes - 1);

      if (type === "up") setUpvotes(upvotes + 1);
      else setDownvotes(downvotes + 1);
      setUserVote(type);
    }
  };

  const netVotes = upvotes - downvotes;

  return (
    <Card>
      <div className="p-5">
        <div className="flex gap-4">
          {/* Voting column */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleVote("up")}
              className={`rounded-lg p-2 transition-colors ${
                userVote === "up"
                  ? "bg-green-100 text-green-700"
                  : "hover:bg-neutral-100 text-neutral-600"
              }`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span
              className={`text-sm font-semibold ${
                netVotes > 0
                  ? "text-green-600"
                  : netVotes < 0
                    ? "text-red-600"
                    : "text-neutral-600"
              }`}
            >
              {netVotes > 0 ? "+" : ""}
              {netVotes}
            </span>
            <button
              onClick={() => handleVote("down")}
              className={`rounded-lg p-2 transition-colors ${
                userVote === "down"
                  ? "bg-red-100 text-red-700"
                  : "hover:bg-neutral-100 text-neutral-600"
              }`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Content column */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold">{problem.title}</h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-600">
              <span>
                {problem.semester} {problem.year}
              </span>
            </div>

            <p className="mt-3 text-sm text-neutral-700">
              {problem.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {problem.tags.map((t) => (
                <TagPill key={t} text={t} />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                by {problem.authorUsername}
              </span>
              <Link
                to={`/problem?id=${problem._id}`}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function CourseProblems() {
  const [searchParams] = useSearchParams();
  const courseCode = searchParams.get("code") || "CPSC 413";

  const [sortBy, setSortBy] = useState<"votes" | "recent" | "difficulty">(
    "votes",
  );
  const [filterDifficulty, setFilterDifficulty] = useState<
    "All" | "Easy" | "Medium" | "Hard"
  >("All");

  // Find the course
  const course = MOCK_COURSES.find((c) => c.courseCode === courseCode);

  // Find related problems
  let problems = MOCK_PROBLEMS.filter((p) => p.courseCode === courseCode);

  // Apply difficulty filter
  if (filterDifficulty !== "All") {
    problems = problems.filter((p) => p.difficulty === filterDifficulty);
  }

  // Apply sorting
  problems = [...problems].sort((a, b) => {
    if (sortBy === "votes") return b.votes - a.votes;
    if (sortBy === "recent")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "difficulty") {
      const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
      return diffOrder[b.difficulty] - diffOrder[a.difficulty];
    }
    return 0;
  });

  if (!course) {
    return (
      <main className="min-h-screen bg-neutral-50 text-neutral-900">
        <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-full items-center justify-between px-6 py-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">
                  UArchive
                </div>
                <div className="text-xs text-neutral-600">
                  Integrity-first course memory bank
                </div>
              </div>
            </Link>
            <nav className="flex items-center gap-2 text-sm">
              <Link
                className="rounded-lg px-3 py-2 hover:bg-neutral-100"
                to="/courses"
              >
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
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-neutral-600">Course not found: {courseCode}</p>
          <Link
            to="/courses"
            className="mt-4 inline-block text-sm text-uofc-red hover:underline"
          >
            ← Back to courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-full items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                UArchive
              </div>
              <div className="text-xs text-neutral-600">
                Integrity-first course memory bank
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-2 text-sm">
            <Link
              className="rounded-lg px-3 py-2 hover:bg-neutral-100"
              to="/courses"
            >
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

      {/* Course Header */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Link
            to={`/course?code=${courseCode}`}
            className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
          >
            ← Back to {courseCode}
          </Link>

          <div className="mt-4">
            <h1 className="text-3xl font-bold">{course.courseCode}</h1>
            <h2 className="mt-2 text-xl text-neutral-700">
              {course.courseName}
            </h2>
            <p className="mt-3 text-sm text-neutral-600">
              View and explore exam problems and practice questions from this
              course
            </p>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold">Problems & Takeaways</h2>
              <p className="mt-1 text-sm text-neutral-600">
                {problems.length}{" "}
                {problems.length === 1 ? "problem" : "problems"} found
              </p>
            </div>

            <Link
              to="/post"
              className="rounded-lg bg-uofc-red px-4 py-2 text-sm font-medium text-white hover:bg-uofc-darkred transition-colors"
            >
              Contribute Problem
            </Link>
          </div>

          <div className="flex items-center justify-end gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-600">Difficulty:</label>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value as any)}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
              >
                <option value="All">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
              >
                <option value="votes">Most Votes</option>
                <option value="recent">Most Recent</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </div>
          </div>
        </div>

        {problems.length === 0 ? (
          <Card>
            <div className="p-12 text-center">
              <p className="text-neutral-600">
                No problems found for this filter.
              </p>
              <button
                onClick={() => setFilterDifficulty("All")}
                className="mt-4 rounded-lg bg-uofc-red px-4 py-2 text-sm font-medium text-white hover:bg-uofc-darkred"
              >
                Clear Filters
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6">
            {problems.map((problem) => (
              <ProblemCard key={problem._id} problem={problem} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600">
          UArchive is built for integrity-first pattern learning. No copyrighted
          exam uploads.
        </div>
      </footer>
    </main>
  );
}
