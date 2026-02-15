import { Link } from "react-router-dom";
import Header from "../components/Header";
import {
  MOCK_COURSES,
  MOCK_PROBLEMS,
  type Course,
  type Problem,
} from "../data/mockData";

const COURSES: Course[] = MOCK_COURSES.slice(0, 4);
const TOP: Problem[] = MOCK_PROBLEMS.slice(0, 3);

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

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header />


      <section className="mx-auto max-w-6xl px-4 pt-12 pb-8">
        <div className="grid gap-10 md:grid-cols-2 items-start">
          <div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs">
                <span className="h-2 w-2 rounded-full bg-uofc-gold" />
                <span className="text-neutral-700">
                  Built for academic integrity
                </span>
              </div>

              <div>
                <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  Helping you{" "}
                  <span className="text-uofc-red">help yourself</span>
                </h1>
                <p className="mt-3 max-w-xl text-neutral-700 md:text-lg">
                  A crowd-sourced archive of exam-style problems and course
                  information designed to preserve institutional knowledge
                  without posting real exams.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/courses"
                  className="rounded-xl bg-uofc-red px-5 py-3 text-sm font-medium text-white hover:bg-uofc-darkred"
                >
                  Browse Courses
                </Link>
                <Link
                  to="/post"
                  className="rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium hover:bg-neutral-100"
                >
                  Add a Problem
                </Link>
              </div>
            </div>
          </div>

          <div>
            <div className="hidden md:block space-y-6 invisible">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs">
                <span className="h-2 w-2 rounded-full bg-uofc-gold" />
                <span className="text-neutral-700">
                  Built for academic integrity
                </span>
              </div>

              <div>
                <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  Helping you{" "}
                  <span className="text-uofc-red">help yourself</span>
                </h1>
                <p className="mt-3 max-w-xl text-neutral-700 md:text-lg">
                  A crowd-sourced archive of exam-style problems and course
                  information designed to preserve institutional knowledge
                  without posting real exams.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-xl bg-uofc-red px-5 py-3 text-sm font-medium text-white">
                  Browse Courses
                </div>
                <div className="rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-medium">
                  Add a Problem
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-sm font-medium text-uofc-charcoal">
            Academic integrity rules
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-700">
            <li>No exact exam copies or screenshots.</li>
            <li>Only reconstructed problems + what you learned.</li>
            <li>Flagging + moderation included.</li>
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-sm font-medium">Search</p>
          <p className="mt-1 text-sm text-neutral-600">
            Find courses, topics, professors, or patterns (e.g., "DP", "graph
            cut", "scheduling").
          </p>

          <form className="mt-4 flex gap-2" action="/search">
            <input
              name="q"
              placeholder="Search by course code, topic, professor..."
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
            />
            <button
              type="submit"
              className="rounded-xl bg-uofc-red px-4 py-3 text-sm font-medium text-white hover:bg-uofc-darkred"
            >
              Go
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Featured courses</h2>
            <p className="mt-1 text-sm text-neutral-700">
              Start with a few course pages, then expand by semester/professor.
            </p>
          </div>
          <Link
            className="text-sm font-medium underline underline-offset-4"
            to="/courses"
          >
            View all
          </Link>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {COURSES.map((c) => (
            <Link
              key={c._id}
              to={`/course?code=${encodeURIComponent(c.courseCode)}`}
            >
              <Card>
                <div className="p-5 hover:bg-neutral-50">
                  <p className="text-sm font-semibold">{c.courseCode}</p>
                  <p className="mt-1 text-sm text-neutral-700">
                    {c.courseName}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">{c.professor}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {c.tags.slice(0, 4).map((t) => (
                      <TagPill key={t} text={t} />
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-xl font-semibold">Top memories this week</h2>
        <p className="mt-1 text-sm text-neutral-700">
          Highly upvoted reflections + reconstructed problems (not verbatim
          exams).
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {TOP.map((s) => (
            <Card key={s._id}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{s.title}</p>
                    <p className="mt-1 text-xs text-neutral-600">
                      {s.courseCode}
                    </p>
                  </div>
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs">
                    ▲ {s.votes}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <TagPill key={t} text={t} />
                  ))}
                </div>

                <p className="mt-3 text-sm text-neutral-700">{s.takeaway}</p>

                <div className="mt-4 flex gap-2">
                  <Link
                    to="/post"
                    className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-medium hover:bg-neutral-100"
                  >
                    Add your reflection
                  </Link>
                  <Link
                    to="/courses"
                    className="rounded-xl bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800"
                  >
                    Browse more
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
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
