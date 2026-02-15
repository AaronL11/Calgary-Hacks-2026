import { Link, useSearchParams } from "react-router-dom";
import { MOCK_PROBLEMS, MOCK_RESPONSES, MOCK_COURSES, type Problem, type Response } from "../data/mockData";
import { useState } from "react";

function TagPill({ text }: { text: string }) {
  return <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700">{text}</span>;
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">{children}</div>;
}

function ResponseCard({ response }: { response: Response }) {
  const [upvotes, setUpvotes] = useState(response.upvotes);
  const [downvotes, setDownvotes] = useState(response.downvotes);
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
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <span className={`text-sm font-semibold ${
              netVotes > 0 ? "text-green-600" : netVotes < 0 ? "text-red-600" : "text-neutral-600"
            }`}>
              {netVotes > 0 ? "+" : ""}{netVotes}
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
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Content column */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-neutral-900">{response.authorUsername}</span>
                  {response.isAccepted && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                      ✓ Accepted Answer
                    </span>
                  )}
                </div>
                <span className="text-xs text-neutral-500">
                  {new Date(response.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </span>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              {response.content}
            </p>

            <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500">
              <button className="hover:text-red-600">Report</button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function ProblemDetail() {
  const [searchParams] = useSearchParams();
  const problemId = searchParams.get("id") || "prob_001";
  const [sortBy, setSortBy] = useState<"votes" | "recent">("votes");
  const [problemVotes, setProblemVotes] = useState<number>(0);
  const [userProblemVote, setUserProblemVote] = useState<"up" | "down" | null>(null);

  // Find the problem
  const problem = MOCK_PROBLEMS.find(p => p._id === problemId);
  
  // Initialize problem votes
  if (problem && problemVotes === 0) {
    setProblemVotes(problem.votes);
  }
  
  const handleProblemVote = (type: "up" | "down") => {
    if (userProblemVote === type) {
      // Unvote
      if (type === "up") setProblemVotes(problemVotes - 1);
      else setProblemVotes(problemVotes + 1);
      setUserProblemVote(null);
    } else {
      // Change or new vote
      if (userProblemVote === "up") setProblemVotes(problemVotes - 1);
      if (userProblemVote === "down") setProblemVotes(problemVotes + 1);
      
      if (type === "up") setProblemVotes(problemVotes + 1);
      else setProblemVotes(problemVotes - 1);
      setUserProblemVote(type);
    }
  };
  
  // Find the course
  const course = problem ? MOCK_COURSES.find(c => c._id === problem.courseId) : null;
  
  // Find responses
  let responses = MOCK_RESPONSES.filter(r => r.problemId === problemId);
  
  // Sort responses
  responses = [...responses].sort((a, b) => {
    if (a.isAccepted) return -1;
    if (b.isAccepted) return 1;
    
    if (sortBy === "votes") {
      return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (!problem) {
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
        <div className="mx-auto max-w-4xl px-4 py-12">
          <p className="text-neutral-600">Problem not found</p>
          <Link to="/" className="mt-4 inline-block text-sm text-uofc-red hover:underline">
            ← Back to home
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

      {/* Problem Header */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link 
            to={`/course?code=${encodeURIComponent(problem.courseCode)}`}
            className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
          >
            ← Back to {problem.courseCode}
          </Link>
          
          <div className="mt-4">
            <div className="flex items-start gap-6">
              {/* Voting column for problem */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleProblemVote("up")}
                  className={`rounded-lg p-2 transition-colors ${
                    userProblemVote === "up"
                      ? "bg-green-100 text-green-700"
                      : "hover:bg-neutral-100 text-neutral-600"
                  }`}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className={`text-lg font-bold ${
                  problemVotes > (problem?.votes || 0) ? "text-green-600" : 
                  problemVotes < (problem?.votes || 0) ? "text-red-600" : 
                  "text-neutral-900"
                }`}>
                  {problemVotes}
                </span>
                <button
                  onClick={() => handleProblemVote("down")}
                  className={`rounded-lg p-2 transition-colors ${
                    userProblemVote === "down"
                      ? "bg-red-100 text-red-700"
                      : "hover:bg-neutral-100 text-neutral-600"
                  }`}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{problem.title}</h1>
                  {problem.isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      ✓ Verified
                    </span>
                  )}
                </div>
                
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                  <Link 
                    to={`/course?code=${encodeURIComponent(problem.courseCode)}`}
                    className="font-medium text-uofc-red hover:underline"
                  >
                    {problem.courseCode}
                  </Link>
                  {course && <span>- {course.courseName}</span>}
                  <span>•</span>
                  <span>{problem.semester} {problem.year}</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-neutral-700">{problem.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {problem.tags.map((tag) => <TagPill key={tag} text={tag} />)}
            </div>

            <div className="mt-6 border-t border-neutral-200 pt-4">
              <span className="text-sm text-neutral-500">
                Posted by <span className="font-medium text-neutral-900">{problem.authorUsername}</span> on{" "}
                {new Date(problem.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Responses Section */}
      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {responses.length} {responses.length === 1 ? 'Response' : 'Responses'}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              Student reflections and study tips
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
            >
              <option value="votes">Highest Voted</option>
              <option value="recent">Most Recent</option>
            </select>
            <Link
              to="/login"
              className="rounded-lg bg-uofc-red px-4 py-2 text-sm font-medium text-white hover:bg-uofc-darkred"
            >
              Add Response
            </Link>
          </div>
        </div>

        {responses.length === 0 ? (
          <Card>
            <div className="p-12 text-center">
              <p className="text-neutral-600">No responses yet. Be the first to share your insights!</p>
              <Link
                to="/login"
                className="mt-4 inline-block rounded-lg bg-uofc-red px-6 py-3 text-sm font-medium text-white hover:bg-uofc-darkred"
              >
                Add Response
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {responses.map((response) => (
              <ResponseCard key={response._id} response={response} />
            ))}
          </div>
        )}

        {/* Add Response Prompt */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold text-neutral-900">Want to add your reflection?</h3>
            <p className="mt-1 text-sm text-neutral-600">
              Share what you learned, tips for solving similar problems, or common pitfalls to avoid.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-block rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Login to Contribute
            </Link>
          </div>
        </Card>
      </section>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 text-sm text-neutral-600">
          UArchive is built for integrity-first pattern learning. No copyrighted exam uploads.
        </div>
      </footer>
    </main>
  );
}
