import { Link, useSearchParams } from "react-router-dom";
import { MOCK_COURSES, MOCK_PROBLEMS, type Course, type Problem } from "../data/mockData";
import { useState } from "react";

function TagPill({ text }: { text: string }) {
  return <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700">{text}</span>;
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">{children}</div>;
}

function DifficultyBadge({ level }: { level: number }) {
  const color = level >= 8 ? "bg-red-100 text-red-700" : level >= 6 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${color}`}>
      Difficulty: {level}/10
    </span>
  );
}

function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <Card>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">{problem.title}</h3>
              {problem.isVerified && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                  ✓ Verified
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-600">
              <span>{problem.semester} {problem.year}</span>
            </div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium">
            ▲ {problem.votes}
          </div>
        </div>

        <p className="mt-3 text-sm text-neutral-700">{problem.description}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {problem.tags.map((t) => <TagPill key={t} text={t} />)}
        </div>

        <div className="mt-4 rounded-lg bg-neutral-50 p-3">
          <p className="text-xs font-medium text-neutral-600">Key Takeaway:</p>
          <p className="mt-1 text-sm text-neutral-900">{problem.takeaway}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-neutral-500">by {problem.authorUsername}</span>
          <div className="flex gap-2">
            <Link 
              to={`/problem?id=${problem._id}`}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
            >
              View Details
            </Link>
            <Link 
              to="/login" 
              className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800"
            >
              Add Reflection
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function CourseDetail() {
  const [searchParams] = useSearchParams();
  const courseCode = searchParams.get("code") || "CPSC 413";
  
  const [sortBy, setSortBy] = useState<"votes" | "recent" | "difficulty">("votes");
  const [filterDifficulty, setFilterDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  
  // Find the course
  const course = MOCK_COURSES.find(c => c.courseCode === courseCode);
  
  // Find related problems
  let problems = MOCK_PROBLEMS.filter(p => p.courseCode === courseCode);
  
  // Apply difficulty filter
  if (filterDifficulty !== "All") {
    problems = problems.filter(p => p.difficulty === filterDifficulty);
  }
  
  // Apply sorting
  problems = [...problems].sort((a, b) => {
    if (sortBy === "votes") return b.votes - a.votes;
    if (sortBy === "recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "difficulty") {
      const diffOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
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
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-neutral-600">Course not found: {courseCode}</p>
          <Link to="/courses" className="mt-4 inline-block text-sm text-uofc-red hover:underline">
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

      {/* Course Header */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900">
            ← Back to all courses
          </Link>
          
          <div className="mt-4 flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{course.courseCode}</h1>
                <DifficultyBadge level={course.difficulty} />
              </div>
              <h2 className="mt-2 text-xl text-neutral-700">{course.courseName}</h2>
              
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Professor:</span>
                  <span>{course.professor}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Semester:</span>
                  <span>{course.semester} {course.year}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Department:</span>
                  <span>{course.department}</span>
                </div>
              </div>

              <p className="mt-4 text-sm text-neutral-700">{course.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {course.tags.map((tag) => <TagPill key={tag} text={tag} />)}
              </div>
            </div>

            <Card>
              <div className="p-5 text-center">
                <div className="text-3xl font-bold text-uofc-red">{course.problemCount}</div>
                <p className="mt-1 text-xs text-neutral-600">Problems Shared</p>
                <div className="mt-3 text-2xl font-semibold text-neutral-700">{course.enrollmentCount}</div>
                <p className="mt-1 text-xs text-neutral-600">Students Enrolled</p>
                <Link
                  to="/login"
                  className="mt-4 block w-full rounded-lg bg-uofc-red px-4 py-2 text-sm font-medium text-white hover:bg-uofc-darkred"
                >
                  Contribute Problem
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Problems & Takeaways</h2>
            <p className="mt-1 text-sm text-neutral-600">
              {problems.length} {problems.length === 1 ? 'problem' : 'problems'} found
            </p>
          </div>

          <div className="flex items-center gap-3">
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
              <p className="text-neutral-600">No problems found for this filter.</p>
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
          UArchive is built for integrity-first pattern learning. No copyrighted exam uploads.
        </div>
      </footer>
    </main>
  );
}
