import { Link } from "react-router-dom";
import { MOCK_COURSES, type Course } from "../data/mockData";
import Header from "../components/Header";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <Link to={`/course?code=${encodeURIComponent(course.courseCode)}`}>
      <Card>
        <div className="p-5 transition-colors hover:bg-neutral-50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-neutral-900">
                {course.courseCode}
              </h3>
              <p className="mt-1 text-sm text-neutral-700">
                {course.courseName}
              </p>
            </div>
            <div className="rounded-lg bg-uofc-red px-2 py-1 text-xs font-semibold text-white">
              {course.problemCount}
            </div>
          </div>

          <p className="mt-3 text-xs text-neutral-600 line-clamp-2">
            {course.description}
          </p>
        </div>
      </Card>
    </Link>
  );
}

export default function Courses() {
  const courses = MOCK_COURSES;

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header />

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Browse Courses</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Explore course content summaries and problems
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
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
