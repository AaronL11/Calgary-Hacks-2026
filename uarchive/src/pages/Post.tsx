import { Link } from "react-router-dom";
import { useState } from "react";
import { MOCK_COURSES } from "../data/mockData";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

export default function Post() {
  const [courseCode, setCourseCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Medium",
  );
  const [examType, setExamType] = useState("");
  const [semester, setSemester] = useState("Fall");
  const [year, setYear] = useState(2026);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log({
      courseCode,
      title,
      description,
      tags: tags.split(",").map((t) => t.trim()),
      difficulty,
      examType,
      semester,
      year,
    });
  };

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

      <section className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Contribute a Problem</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Share a problem or exam question to help other students learn
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Course Code */}
            <div>
              <label
                htmlFor="courseCode"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Course Code *
              </label>
              <select
                id="courseCode"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
              >
                <option value="">Select a course</option>
                {MOCK_COURSES.map((course) => (
                  <option key={course._id} value={course.courseCode}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Problem Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., DP: when a greedy-looking choice fails"
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                placeholder="Describe the problem and what makes it challenging..."
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
              />
            </div>

            {/* Exam Type and Term */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="examType"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Exam Type *
                </label>
                <input
                  id="examType"
                  type="text"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  required
                  placeholder="e.g., Midterm, Final, Assignment"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
                />
              </div>

              <div>
                <label
                  htmlFor="semester"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Semester *
                </label>
                <select
                  id="semester"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
                >
                  <option value="Fall">Fall</option>
                  <option value="Winter">Winter</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
            </div>

            {/* Year and Difficulty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Year *
                </label>
                <input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                  required
                  min="2020"
                  max="2030"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
                />
              </div>

              <div>
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Difficulty *
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")
                  }
                  required
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Tags
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., DP, Graphs, Proofs (comma-separated)"
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Separate tags with commas
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <Link
                to="/courses"
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-lg bg-uofc-red px-6 py-2 text-sm font-medium text-white hover:bg-uofc-darkred transition-colors"
              >
                Submit Problem
              </button>
            </div>
          </form>
        </Card>

        <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <h3 className="text-sm font-medium text-blue-900">Guidelines</h3>
          <ul className="mt-2 text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Do not upload copyrighted exam materials</li>
            <li>Focus on the pattern or concept, not specific solutions</li>
            <li>Be descriptive in your problem title</li>
            <li>Tag appropriately to help others find similar problems</li>
          </ul>
        </div>
      </section>

      <footer className="border-t border-neutral-200 bg-white mt-12">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600">
          UArchive is built for integrity-first pattern learning. No copyrighted
          exam uploads.
        </div>
      </footer>
    </main>
  );
}
