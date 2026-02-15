import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { type Problem, type Response, type Course, type Comment } from "../data/mockData";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { getProblem, listResponses, listCourses, listComments, createComment, createResponse } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

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
    const delta = type === "up" ? 1 : -1;
    // optimistic update
    if (type === "up") setUpvotes((s) => s + 1);
    else setDownvotes((s) => s + 1);
    setUserVote(type);
    voteResponse(response._id, delta).catch(() => {
      // revert on error
      if (type === "up") setUpvotes((s) => s - 1);
      else setDownvotes((s) => s - 1);
      setUserVote(null);
    });
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
              className={`rounded-lg p-2 transition-colors ${userVote === "up"
                ? "bg-green-100 text-green-700"
                : "hover:bg-neutral-100 text-neutral-600"
                }`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <span className={`text-sm font-semibold ${netVotes > 0 ? "text-green-600" : netVotes < 0 ? "text-red-600" : "text-neutral-600"
              }`}>
              {netVotes > 0 ? "+" : ""}{netVotes}
            </span>
            <button
              onClick={() => handleVote("down")}
              className={`rounded-lg p-2 transition-colors ${userVote === "down"
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
              <MarkdownRenderer content={response.content} />
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

function CommentCard({ comment }: { comment: Comment }) {
  const [upvotes, setUpvotes] = useState(comment.upvotes || 0);
  const [downvotes, setDownvotes] = useState(comment.downvotes || 0);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  const handleVote = (type: "up" | "down") => {
    const delta = type === "up" ? 1 : -1;
    if (type === "up") setUpvotes((s) => s + 1);
    else setDownvotes((s) => s + 1);
    setUserVote(type);
    voteComment(comment._id, delta).catch(() => {
      if (type === "up") setUpvotes((s) => s - 1);
      else setDownvotes((s) => s - 1);
      setUserVote(null);
    });
  };

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-neutral-900">{comment.authorUsername || "Anonymous"}</div>
            <div className="text-xs text-neutral-500">{new Date(comment.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button onClick={() => handleVote("up")} className={`rounded-lg p-2 ${userVote === "up" ? "bg-green-100 text-green-700" : "hover:bg-neutral-100 text-neutral-600"}`}>▲</button>
            <div className="text-sm font-semibold">{upvotes - downvotes}</div>
            <button onClick={() => handleVote("down")} className={`rounded-lg p-2 ${userVote === "down" ? "bg-red-100 text-red-700" : "hover:bg-neutral-100 text-neutral-600"}`}>▼</button>
          </div>
        </div>
        <p className="mt-3 text-sm text-neutral-700 leading-relaxed">{comment.content}</p>
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
  const [problem, setProblem] = useState<Problem | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [newResponse, setNewResponse] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    let mounted = true;
    getProblem(problemId)
      .then((p) => {
        if (!mounted) return;
        setProblem(p as Problem);
        setProblemVotes((p as any).votes || 0);
      })
      .catch(() => { });

    listResponses(problemId)
      .then((r) => {
        if (!mounted) return;
        setResponses(r as Response[]);
      })
      .catch(() => { });


    listComments(problemId)
      .then((c) => {
        if (!mounted) return;
        setComments(c as Comment[]);
      })
      .catch(() => { });

    // find course info
    listCourses()
      .then((courses) => {
        if (!mounted) return;
        const found = (courses as Course[]).find((c) => c.courseCode === (problem?.courseCode || ""));
        if (found) setCourse(found);
      })
      .catch(() => { });

    return () => {
      mounted = false;
    };
  }, [problemId]);

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

  // Sort responses
  const sortedResponses = [...responses].sort((a, b) => {
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
        <Header />
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
      <Header />

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
                  className={`rounded-lg p-2 transition-colors ${userProblemVote === "up"
                    ? "bg-green-100 text-green-700"
                    : "hover:bg-neutral-100 text-neutral-600"
                    }`}
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className={`text-lg font-bold ${problemVotes > (problem?.votes || 0) ? "text-green-600" :
                  problemVotes < (problem?.votes || 0) ? "text-red-600" :
                    "text-neutral-900"
                  }`}>
                  {problemVotes}
                </span>
                <button
                  onClick={() => handleProblemVote("down")}
                  className={`rounded-lg p-2 transition-colors ${userProblemVote === "down"
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

            <p className="mt-4 text-neutral-700">
              <MarkdownRenderer content={problem.description} />
            </p>

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
              {sortedResponses.length} {sortedResponses.length === 1 ? 'Response' : 'Responses'}
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
            {auth.isAuthenticated ? (
              <button
                onClick={() => setShowResponseForm((s) => !s)}
                className="rounded-lg bg-uofc-red px-4 py-2 text-sm font-medium text-white hover:bg-uofc-darkred"
              >
                {showResponseForm ? 'Cancel' : 'Add Response'}
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-uofc-red px-4 py-2 text-sm font-medium text-white hover:bg-uofc-darkred"
              >
                Add Response
              </Link>
            )}
          </div>
        </div>

        {showResponseForm && auth.isAuthenticated && (
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-neutral-900">Add a response</h3>
              <p className="mt-1 text-sm text-neutral-600">Share what you learned, tips for solving similar problems, or common pitfalls to avoid.</p>
              <textarea
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                rows={5}
                className="mt-4 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none"
                placeholder="Write your reflection..."
              />
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => {
                    if (!newResponse.trim()) return;
                    setPosting(true);
                    createResponse({ problemId, content: newResponse.trim() })
                      .then((created) => {
                        setResponses((prev) => [created as Response, ...prev]);
                        setNewResponse("");
                        setShowResponseForm(false);
                      })
                      .catch((err) => alert(err.message || String(err)))
                      .finally(() => setPosting(false));
                  }}
                  className="rounded-lg bg-uofc-red px-4 py-2 text-sm font-medium text-white hover:bg-uofc-darkred"
                >
                  Post Response
                </button>
                <button onClick={() => setShowResponseForm(false)} className="text-sm text-neutral-600">Cancel</button>
              </div>
            </div>
          </Card>
        )}

        {sortedResponses.length === 0 ? (
          <Card>
            <div className="p-12 text-center">
              <p className="text-neutral-600">No responses yet. Be the first to share your insights!</p>
              {!auth.isAuthenticated ? (
                <Link
                  to="/login"
                  className="mt-4 inline-block rounded-lg bg-uofc-red px-6 py-3 text-sm font-medium text-white hover:bg-uofc-darkred"
                >
                  Add Response
                </Link>
              ) : (
                <button
                  onClick={() => setShowResponseForm(true)}
                  className="mt-4 inline-block rounded-lg bg-uofc-red px-6 py-3 text-sm font-medium text-white hover:bg-uofc-darkred"
                >
                  Add Response
                </button>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedResponses.map((response) => (
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
            {auth.isAuthenticated ? (
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => setShowResponseForm(true)}
                  className="inline-block rounded-lg bg-uofc-red px-6 py-3 text-sm font-medium text-white hover:bg-uofc-darkred"
                >
                  Contribute a Reflection
                </button>
                <span className="text-sm text-neutral-600">You are signed in as <strong>{auth.user?.username || auth.user?.email}</strong></span>
              </div>
            ) : (
              <Link
                to="/login"
                className="mt-4 inline-block rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Login to Contribute
              </Link>
            )}
          </div>
        </Card>
      </section>

      {/* Comments Section */}
      <section className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</h2>
            <p className="mt-1 text-sm text-neutral-600">Short clarifying remarks and quick notes about the problem</p>
          </div>
        </div>

        {comments.length === 0 ? (
          <Card>
            <div className="p-8 text-center">
              <p className="text-neutral-600">No comments yet.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => <CommentCard key={c._id} comment={c} />)}
          </div>
        )}

        <Card>
          <div className="p-6">
            <h3 className="font-semibold text-neutral-900">Add a comment</h3>
            <p className="mt-1 text-sm text-neutral-600">Share a short clarification or tip — keep comments brief and respectful.</p>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="mt-4 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none"
              placeholder="Write a short comment..."
            />
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => {
                  if (!auth.isAuthenticated) {
                    // Don't redirect automatically; show login prompt
                    alert('Please log in to post comments. Visit the Login page to continue.');
                    return;
                  }
                  if (!newComment.trim()) return;
                  setPosting(true);
                  createComment({ problemId, content: newComment.trim() })
                    .then((created) => {
                      setComments((prev) => [created as Comment, ...prev]);
                      setNewComment("");
                    })
                    .catch((err) => {
                      alert(err.message || String(err));
                    })
                    .finally(() => setPosting(false));
                }}
                className="rounded-lg bg-uofc-red px-4 py-2 text-sm font-medium text-white hover:bg-uofc-darkred"
                disabled={posting || !auth.isAuthenticated}
              >
                {posting ? 'Posting...' : 'Post Comment'}
              </button>
              {!auth.isAuthenticated && (
                <Link to="/login" className="text-sm text-neutral-600 hover:underline">Login to comment</Link>
              )}
            </div>
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
