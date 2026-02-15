import { Link, useSearchParams } from "react-router-dom";
import { type Course, type Summary } from "../data/mockData";
import { listSummaries, listCourses } from "../lib/api";
import { useEffect, useState } from "react";
import Header from "../components/Header";

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

function SummaryCard({ summary }: { summary: Summary }) {
  const [upvotes, setUpvotes] = useState(summary.votes > 0 ? summary.votes : 0);
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
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900">
                    {summary.authorUsername}
                  </span>
                  <span className="text-xs text-neutral-500">•</span>
                  <span className="text-xs text-neutral-600">
                    {summary.professor}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  <span className="text-neutral-500">
                    {summary.semester} {summary.year}
                  </span>
                  <span className="text-neutral-500">•</span>
                  <DifficultyBadge level={summary.difficulty} />
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              {summary.content}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function CourseDetail() {
  const [searchParams] = useSearchParams();
  const courseCode = searchParams.get("code") || "CPSC 413";
  const [sortBy, setSortBy] = useState<"votes" | "recent">("votes");
  const [course, setCourse] = useState<Course | null>(null);
  const [summaries, setSummaries] = useState<Summary[]>([]);

  useEffect(() => {
    let mounted = true;
    // load course info from backend list
    listCourses()
      .then((courses) => {
        if (!mounted) return;
        const found = (courses as Course[]).find((c) => c.courseCode === courseCode);
        setCourse(found ?? null);
      })
      .catch(() => {});

    listSummaries(courseCode)
      .then((s) => {
        if (!mounted) return;
        setSummaries(s as Summary[]);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [courseCode]);

  // Apply sorting
  const sortedSummaries = [...summaries].sort((a, b) => {
    if (sortBy === "votes") return (b.votes || 0) - (a.votes || 0);
    if (sortBy === "recent")
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    return 0;
  });

  if (!course) {
    return (
      <main className="min-h-screen bg-neutral-50 text-neutral-900">
        <Header />
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
        <Header />

      {/* Course Header */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
          >
            ← Back to all courses
          </Link>

          <div className="mt-4 flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{course.courseCode}</h1>
              <h2 className="mt-2 text-xl text-neutral-700">
                {course.courseName}
              </h2>

              <p className="mt-4 text-sm text-neutral-700">
                {course.description}
              </p>
            </div>

            <Card>
              <div className="p-5 text-center">
                <div className="text-3xl font-bold text-uofc-red">
                  {course.problemCount}
                </div>
                <p className="mt-1 text-xs text-neutral-600">Problems Shared</p>

                <Link
                  to={`/course-problems?code=${courseCode}`}
                  className="mt-4 block w-full rounded-lg bg-uofc-red px-4 py-2 text-sm font-medium text-white hover:bg-uofc-darkred transition-colors"
                >
                  View Problems
                </Link>

                <Link
                  to="/post"
                  className="mt-2 block w-full rounded-lg border border-uofc-red bg-white px-4 py-2 text-sm font-medium text-uofc-red hover:bg-red-50 transition-colors"
                >
                  Contribute
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Summaries Section */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Course Content Summaries</h2>
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
            </select>
          </div>
        </div>

        {sortedSummaries.length === 0 ? (
          <Card>
            <div className="p-12 text-center">
              <p className="text-neutral-600">
                No summaries yet for this course.
              </p>
              <Link
                to="/post"
                className="mt-4 inline-block rounded-lg bg-uofc-red px-4 py-2 text-sm font-medium text-white hover:bg-uofc-darkred"
              >
                Be the first to contribute
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6">
            {sortedSummaries.map((summary) => (
              <SummaryCard key={summary._id} summary={summary} />
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
