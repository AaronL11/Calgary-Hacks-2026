import { Link } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { createProblem, listCourses, createSummary } from "../lib/api";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {children}
    </div>
  );
}

export default function Post() {
  const [contentType, setContentType] = useState<"problem" | "summary">("problem");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listCourses();
        if (!mounted) return;
        setCourses(data || []);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    })();
    return () => { mounted = false; };
  }, []);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [professor, setProfessor] = useState("");
  const [tags, setTags] = useState("");
  const [difficulty, setDifficulty] = useState(5);
  const [semester, setSemester] = useState("Fall");
  const [year, setYear] = useState(2026);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        if (contentType === "problem") {
          const payload = {
            courseId: courseId,
            title,
            description,
            tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
            difficulty: String(difficulty),
            examType: "Submission",
          };
          const created = await createProblem(payload);
          alert("Problem submitted successfully.");
          // optionally navigate to created problem page
          console.log("created problem", created);
        } else {
          const payload = {
            courseId: courseId,
            title,
            content: description,
            tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
            professor: professor || undefined,
            difficulty: difficulty || undefined,
            semester: semester || undefined,
            year: year || undefined,
          };
          const created = await createSummary(payload);
          alert("Summary submitted successfully.");
          console.log("created summary", created);
        }
      } catch (err: any) {
        console.error(err);
        alert("Failed to submit: " + (err?.message || err));
      }
    })();
  };

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header />

      <section className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Contribute a Problem / Course Summary
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Share a problem, exam question, or course content summary to help other students learn
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Content Type Selector */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Content Type *
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setContentType("problem")}
                  className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                    contentType === "problem"
                      ? "border-uofc-red bg-uofc-red text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  Problem
                </button>
                <button
                  type="button"
                  onClick={() => setContentType("summary")}
                  className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                    contentType === "summary"
                      ? "border-uofc-red bg-uofc-red text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  Course Summary
                </button>
              </div>
            </div>

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
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
              >
                <option value="">Select a course</option>
                {courses.map((course) => {
                  const id = (course?._id && typeof course._id === "string")
                    ? course._id
                    : course?._id?._id || course?.id || String(course?._id);
                  return (
                    <option key={id} value={id}>
                      {course.courseCode} - {course.courseName}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                {contentType === "problem" ? "Problem" : "Summary"} Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder={contentType === "problem"
                  ? "e.g., DP: when a greedy-looking choice fails"
                  : "e.g., Key concepts from Week 5"}
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
                placeholder={contentType === "problem"
                  ? "Describe the problem and what makes it challenging..."
                  : "Summarize the key concepts and takeaways from this course content..."}
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
              />
            </div>

            {/* Professor (only for summaries) */}
            {contentType === "summary" && (
              <div>
                <label
                  htmlFor="professor"
                  className="block text-sm font-medium text-neutral-900 mb-2"
                >
                  Professor *
                </label>
                <input
                  id="professor"
                  type="text"
                  value={professor}
                  onChange={(e) => setProfessor(e.target.value)}
                  required
                  placeholder="e.g., Dr. Smith"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
                />
              </div>
            )}

            {/* Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            {/* Difficulty */}
            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-neutral-900 mb-2"
              >
                Difficulty (1-10) *
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                required
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-uofc-red focus:ring-2 focus:ring-uofc-red/20"
              >
                <option value={1}>1 - Very Easy</option>
                <option value={2}>2 - Easy</option>
                <option value={3}>3 - Easy</option>
                <option value={4}>4 - Medium</option>
                <option value={5}>5 - Medium</option>
                <option value={6}>6 - Medium</option>
                <option value={7}>7 - Medium</option>
                <option value={8}>8 - Hard</option>
                <option value={9}>9 - Hard</option>
                <option value={10}>10 - Very Hard</option>
              </select>
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
                Submit {contentType === "problem" ? "Problem" : "Summary"}
              </button>
            </div>
          </form>
        </Card>

        <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <h3 className="text-sm font-medium text-blue-900">Guidelines</h3>
          <ul className="mt-2 text-xs text-blue-800 space-y-1 list-disc list-inside">
            <li>Do not upload copyrighted exam materials</li>
            <li>Focus on the pattern or concept, not specific solutions</li>
            <li>Be descriptive in your title</li>
            <li>For summaries: Include the professor to help students find relevant content</li>
            <li>Tag appropriately to help others find similar content</li>
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
