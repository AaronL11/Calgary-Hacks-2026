from datetime import datetime
from typing import List


MOCK_COURSES = [
    {
        "courseCode": "CPSC 413",
        "courseName": "Design & Analysis of Algorithms",
        "department": "Computer Science",
        "professor": "Dr. Sarah Johnson",
        "semester": "Fall",
        "year": 2025,
        "tags": ["DP", "Graphs", "Greedy", "Proofs", "Complexity"],
        "description": "Introduction to algorithm design techniques and complexity analysis",
        "difficulty": 8,
        "enrollmentCount": 245,
        "problemCount": 156,
        "createdAt": "2024-09-01T00:00:00Z",
        "updatedAt": "2025-12-15T10:30:00Z",
    },
    {
        "courseCode": "CPSC 351",
        "courseName": "Theory of Computation",
        "department": "Computer Science",
        "professor": "Dr. Michael Chen",
        "semester": "Winter",
        "year": 2026,
        "tags": ["Automata", "Decidability", "TMs", "Formal Languages"],
        "description": "Theoretical foundations of computer science",
        "difficulty": 9,
        "enrollmentCount": 189,
        "problemCount": 98,
        "createdAt": "2025-01-05T00:00:00Z",
        "updatedAt": "2026-01-20T14:45:00Z",
    },
    {
        "courseCode": "CPSC 457",
        "courseName": "Operating Systems",
        "department": "Computer Science",
        "professor": "Dr. Emily Rodriguez",
        "semester": "Fall",
        "year": 2025,
        "tags": ["Scheduling", "Memory", "Concurrency", "File Systems"],
        "description": "Operating system design and implementation principles",
        "difficulty": 7,
        "enrollmentCount": 312,
        "problemCount": 203,
        "createdAt": "2024-09-01T00:00:00Z",
        "updatedAt": "2025-12-18T16:20:00Z",
    },
]


MOCK_PROBLEMS = [
    {
        "title": "DP: when a greedy-looking choice fails",
        "description": "Problem involving choosing between greedy and dynamic programming approaches for optimization",
        "tags": ["DP", "Counterexample"],
        "difficulty": "Hard",
        "examType": "Midterm",
        "semester": "Fall",
        "year": 2025,
        "authorUsername": "alex_student",
        "votes": 128,
        "takeaway": "Write the state definition first; if you can't, it's not DP yet.",
        "isVerified": True,
        "isFlagged": False,
        "createdAt": "2025-10-15T14:30:00Z",
        "updatedAt": "2025-11-20T16:45:00Z",
    },
    {
        "title": "Graphs: hidden cut / exchange argument pattern",
        "description": "Understanding exchange arguments in graph optimization problems",
        "tags": ["Graphs", "Proofs"],
        "difficulty": "Medium",
        "examType": "Final",
        "semester": "Fall",
        "year": 2025,
        "authorUsername": "sam_coder",
        "votes": 97,
        "takeaway": "Identify what 'must be true' in every optimal solution, then swap.",
        "isVerified": True,
        "isFlagged": False,
        "createdAt": "2025-11-28T10:20:00Z",
        "updatedAt": "2025-12-05T12:30:00Z",
    },
]


def _parse_dt(s: str):
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except Exception:
        return datetime.utcnow()


async def seed_db(app):
    db = app.state.db
    # Seed users minimal (only usernames used in problems)
    users = [
        {"username": "alex_student", "email": "alex@ucalgary.ca", "degree": "Computer Science", "joinedAt": _parse_dt("2024-09-01T00:00:00Z")},
        {"username": "sam_coder", "email": "sam@ucalgary.ca", "degree": "Software Engineering", "joinedAt": _parse_dt("2024-01-15T00:00:00Z")},
    ]

    # Insert users if none
    try:
        if await db.users.count_documents({}) == 0:
            await db.users.insert_many(users)

        # Seed courses if none
        if await db.courses.count_documents({}) == 0:
            docs = []
            for c in MOCK_COURSES:
                doc = c.copy()
                doc["createdAt"] = _parse_dt(doc.get("createdAt"))
                doc["updatedAt"] = _parse_dt(doc.get("updatedAt"))
                docs.append(doc)
            res = await db.courses.insert_many(docs)

            # Create some problems linked to the first two inserted courses
            inserted_ids = list(res.inserted_ids)
            problems = []
            for i, p in enumerate(MOCK_PROBLEMS):
                problem = p.copy()
                problem["courseId"] = inserted_ids[min(i, len(inserted_ids) - 1)]
                problem["createdAt"] = _parse_dt(problem.get("createdAt"))
                problem["updatedAt"] = _parse_dt(problem.get("updatedAt"))
                problems.append(problem)
            if problems:
                await db.problems.insert_many(problems)
    except Exception:
        import logging

        logging.getLogger("uvicorn.error").exception("Seeding DB failed")
