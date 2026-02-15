// Mock data structure matching MongoDB schema for FastAPI integration

export interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
  department: string;
  professor: string;
  semester: string;
  year: number;
  tags: string[];
  description: string;
  difficulty: number;
  enrollmentCount: number;
  problemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Problem {
  _id: string;
  courseId: string;
  courseCode: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  examType: string;
  semester: string;
  year: number;
  authorId: string;
  authorUsername: string;
  votes: number;
  takeaway: string;
  isVerified: boolean;
  isFlagged: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  degree: string;
  yearOfStudy: number;
  contributionCount: number;
  reputation: number;
  joinedAt: string;
}

export interface Response {
  _id: string;
  problemId: string;
  authorId: string;
  authorUsername: string;
  content: string;
  upvotes: number;
  downvotes: number;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Summary {
  _id: string;
  courseId: string;
  courseCode: string;
  title: string;
  content: string;
  authorId: string;
  authorUsername: string;
  votes: number;
  tags: string[];
  topic: string;
  professor: string;
  difficulty: number;
  semester: string;
  year: number;
  createdAt: string;
  updatedAt: string;
}

// Dummy courses data
export const MOCK_COURSES: Course[] = [
  {
    _id: "course_001",
    courseCode: "CPSC 413",
    courseName: "Design & Analysis of Algorithms",
    department: "Computer Science",
    professor: "Dr. Sarah Johnson",
    semester: "Fall",
    year: 2025,
    tags: ["DP", "Graphs", "Greedy", "Proofs", "Complexity"],
    description: "Introduction to algorithm design techniques and complexity analysis",
    difficulty: 8,
    enrollmentCount: 245,
    problemCount: 156,
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2025-12-15T10:30:00Z"
  },
  {
    _id: "course_002",
    courseCode: "CPSC 351",
    courseName: "Theory of Computation",
    department: "Computer Science",
    professor: "Dr. Michael Chen",
    semester: "Winter",
    year: 2026,
    tags: ["Automata", "Decidability", "TMs", "Formal Languages"],
    description: "Theoretical foundations of computer science",
    difficulty: 9,
    enrollmentCount: 189,
    problemCount: 98,
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2026-01-20T14:45:00Z"
  },
  {
    _id: "course_003",
    courseCode: "CPSC 457",
    courseName: "Operating Systems",
    department: "Computer Science",
    professor: "Dr. Emily Rodriguez",
    semester: "Fall",
    year: 2025,
    tags: ["Scheduling", "Memory", "Concurrency", "File Systems"],
    description: "Operating system design and implementation principles",
    difficulty: 7,
    enrollmentCount: 312,
    problemCount: 203,
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2025-12-18T16:20:00Z"
  },
  {
    _id: "course_004",
    courseCode: "CPSC 559",
    courseName: "Distributed Systems",
    department: "Computer Science",
    professor: "Dr. James Kim",
    semester: "Winter",
    year: 2026,
    tags: ["Consistency", "Replication", "Faults", "CAP Theorem"],
    description: "Design and implementation of distributed computing systems",
    difficulty: 9,
    enrollmentCount: 156,
    problemCount: 87,
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2026-01-25T11:10:00Z"
  },
  {
    _id: "course_005",
    courseCode: "CPSC 453",
    courseName: "Computer Graphics",
    department: "Computer Science",
    professor: "Dr. Lisa Anderson",
    semester: "Fall",
    year: 2025,
    tags: ["Rendering", "3D", "OpenGL", "Shaders"],
    description: "Fundamentals of computer graphics and visual computing",
    difficulty: 6,
    enrollmentCount: 198,
    problemCount: 124,
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2025-12-10T09:30:00Z"
  },
  {
    _id: "course_006",
    courseCode: "CPSC 471",
    courseName: "Database Management Systems",
    department: "Computer Science",
    professor: "Dr. Robert Taylor",
    semester: "Winter",
    year: 2026,
    tags: ["SQL", "Normalization", "Transactions", "Indexing"],
    description: "Database design, implementation, and management",
    difficulty: 6,
    enrollmentCount: 278,
    problemCount: 165,
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2026-01-28T13:45:00Z"
  },
  {
    _id: "course_007",
    courseCode: "CPSC 525",
    courseName: "Compiler Design",
    department: "Computer Science",
    professor: "Dr. Patricia Williams",
    semester: "Fall",
    year: 2025,
    tags: ["Parsing", "Optimization", "Code Generation", "Lexical Analysis"],
    description: "Theory and practice of compiler construction",
    difficulty: 10,
    enrollmentCount: 134,
    problemCount: 76,
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2025-12-12T15:20:00Z"
  },
  {
    _id: "course_008",
    courseCode: "CPSC 461",
    courseName: "Machine Learning",
    department: "Computer Science",
    professor: "Dr. David Martinez",
    semester: "Winter",
    year: 2026,
    tags: ["Neural Networks", "Regression", "Classification", "Deep Learning"],
    description: "Introduction to machine learning algorithms and applications",
    difficulty: 7,
    enrollmentCount: 389,
    problemCount: 234,
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2026-02-01T10:15:00Z"
  }
];

// Dummy problems data
export const MOCK_PROBLEMS: Problem[] = [
  {
    _id: "prob_001",
    courseId: "course_001",
    courseCode: "CPSC 413",
    title: "DP: when a greedy-looking choice fails",
    description: "Problem involving choosing between greedy and dynamic programming approaches for optimization",
    tags: ["DP", "Counterexample"],
    difficulty: "Hard",
    examType: "Midterm",
    semester: "Fall",
    year: 2025,
    authorId: "user_001",
    authorUsername: "alex_student",
    votes: 128,
    takeaway: "Write the state definition first; if you can't, it's not DP yet.",
    isVerified: true,
    isFlagged: false,
    createdAt: "2025-10-15T14:30:00Z",
    updatedAt: "2025-11-20T16:45:00Z"
  },
  {
    _id: "prob_002",
    courseId: "course_001",
    courseCode: "CPSC 413",
    title: "Graphs: hidden cut / exchange argument pattern",
    description: "Understanding exchange arguments in graph optimization problems",
    tags: ["Graphs", "Proofs"],
    difficulty: "Medium",
    examType: "Final",
    semester: "Fall",
    year: 2025,
    authorId: "user_002",
    authorUsername: "sam_coder",
    votes: 97,
    takeaway: "Identify what 'must be true' in every optimal solution, then swap.",
    isVerified: true,
    isFlagged: false,
    createdAt: "2025-11-28T10:20:00Z",
    updatedAt: "2025-12-05T12:30:00Z"
  },
  {
    _id: "prob_003",
    courseId: "course_003",
    courseCode: "CPSC 457",
    title: "OS scheduling: starvation pitfall",
    description: "Common scheduling algorithm mistakes that lead to process starvation",
    tags: ["Scheduling"],
    difficulty: "Medium",
    examType: "Midterm",
    semester: "Fall",
    year: 2025,
    authorId: "user_003",
    authorUsername: "jordan_dev",
    votes: 83,
    takeaway: "Always mention fairness assumptions; graders look for it.",
    isVerified: true,
    isFlagged: false,
    createdAt: "2025-10-22T09:15:00Z",
    updatedAt: "2025-11-10T11:25:00Z"
  },
  {
    _id: "prob_004",
    courseId: "course_002",
    courseCode: "CPSC 351",
    title: "Turing machine halting problem proof",
    description: "Constructing a proof by contradiction for the halting problem",
    tags: ["Decidability", "TMs", "Proofs"],
    difficulty: "Hard",
    examType: "Final",
    semester: "Winter",
    year: 2026,
    authorId: "user_001",
    authorUsername: "alex_student",
    votes: 156,
    takeaway: "The diagonal argument is key - assume H exists, then construct contradiction.",
    isVerified: true,
    isFlagged: false,
    createdAt: "2026-01-18T13:40:00Z",
    updatedAt: "2026-01-30T15:50:00Z"
  },
  {
    _id: "prob_005",
    courseId: "course_004",
    courseCode: "CPSC 559",
    title: "CAP theorem trade-offs in practice",
    description: "Real-world examples of choosing between consistency and availability",
    tags: ["Consistency", "CAP Theorem"],
    difficulty: "Medium",
    examType: "Assignment",
    semester: "Winter",
    year: 2026,
    authorId: "user_004",
    authorUsername: "casey_tech",
    votes: 72,
    takeaway: "Network partitions are rare but when they happen, you must choose CP or AP.",
    isVerified: false,
    isFlagged: false,
    createdAt: "2026-01-25T16:20:00Z",
    updatedAt: "2026-02-02T10:15:00Z"
  }
];

// Dummy users data
export const MOCK_USERS: User[] = [
  {
    _id: "user_001",
    username: "alex_student",
    email: "alex@ucalgary.ca",
    degree: "Computer Science",
    yearOfStudy: 3,
    contributionCount: 47,
    reputation: 892,
    joinedAt: "2024-09-01T00:00:00Z"
  },
  {
    _id: "user_002",
    username: "sam_coder",
    email: "sam@ucalgary.ca",
    degree: "Software Engineering",
    yearOfStudy: 4,
    contributionCount: 63,
    reputation: 1245,
    joinedAt: "2024-01-15T00:00:00Z"
  },
  {
    _id: "user_003",
    username: "jordan_dev",
    email: "jordan@ucalgary.ca",
    degree: "Computer Science",
    yearOfStudy: 2,
    contributionCount: 28,
    reputation: 534,
    joinedAt: "2025-01-10T00:00:00Z"
  },
  {
    _id: "user_004",
    username: "casey_tech",
    email: "casey@ucalgary.ca",
    degree: "Data Science",
    yearOfStudy: 3,
    contributionCount: 35,
    reputation: 678,
    joinedAt: "2024-09-05T00:00:00Z"
  }
];

// Dummy responses/reflections data
export const MOCK_RESPONSES: Response[] = [
  {
    _id: "resp_001",
    problemId: "prob_001",
    authorId: "user_002",
    authorUsername: "sam_coder",
    content: "This problem really helped me understand the difference between greedy and DP. I initially tried a greedy approach by always picking the largest available option, but that led to suboptimal results. The key insight is recognizing when you need to consider all possible states rather than just making a locally optimal choice. Building the recurrence relation helped me see why DP was necessary here.",
    upvotes: 45,
    downvotes: 2,
    isAccepted: true,
    createdAt: "2025-10-20T16:30:00Z",
    updatedAt: "2025-10-22T10:15:00Z"
  },
  {
    _id: "resp_002",
    problemId: "prob_001",
    authorId: "user_003",
    authorUsername: "jordan_dev",
    content: "I struggled with this one initially. What helped me was drawing out the state space and seeing that greedy choices could lead us down a path where we miss the optimal solution. The counterexample in the lecture slides was crucial - sometimes the greedy choice blocks you from better options later.",
    upvotes: 28,
    downvotes: 1,
    isAccepted: false,
    createdAt: "2025-10-21T14:45:00Z",
    updatedAt: "2025-10-21T14:45:00Z"
  },
  {
    _id: "resp_003",
    problemId: "prob_001",
    authorId: "user_004",
    authorUsername: "casey_tech",
    content: "Pro tip: Always write out your state definition BEFORE coding. If you can't clearly define what state you're tracking, you probably haven't understood the problem structure yet. For this problem, the state needed to track both position and remaining capacity.",
    upvotes: 67,
    downvotes: 3,
    isAccepted: false,
    createdAt: "2025-10-23T09:20:00Z",
    updatedAt: "2025-11-15T11:30:00Z"
  },
  {
    _id: "resp_004",
    problemId: "prob_001",
    authorId: "user_001",
    authorUsername: "alex_student",
    content: "The time complexity analysis was tricky here. Make sure you understand why memoization reduces it from exponential to polynomial. In the exam, they'll definitely ask you to justify the complexity, not just state it.",
    upvotes: 34,
    downvotes: 0,
    isAccepted: false,
    createdAt: "2025-11-05T13:10:00Z",
    updatedAt: "2025-11-05T13:10:00Z"
  },
  {
    _id: "resp_005",
    problemId: "prob_002",
    authorId: "user_001",
    authorUsername: "alex_student",
    content: "Exchange arguments are all about proving optimality. The pattern is: assume an optimal solution exists that doesn't follow your rule, show you can 'exchange' elements to make it follow your rule without making it worse, conclude that your rule must be in all optimal solutions. Practice identifying what property must hold in ANY optimal solution.",
    upvotes: 89,
    downvotes: 1,
    isAccepted: true,
    createdAt: "2025-12-01T10:30:00Z",
    updatedAt: "2025-12-08T14:20:00Z"
  },
  {
    _id: "resp_006",
    problemId: "prob_002",
    authorId: "user_003",
    authorUsername: "jordan_dev",
    content: "I found it helpful to work backwards - start with the optimal solution and ask 'what must be true about it?' For graph problems, this often relates to cuts, paths, or connectivity. Then prove that swapping elements maintains optimality.",
    upvotes: 42,
    downvotes: 2,
    isAccepted: false,
    createdAt: "2025-12-02T15:45:00Z",
    updatedAt: "2025-12-02T15:45:00Z"
  }
];

// Dummy summaries data
export const MOCK_SUMMARIES: Summary[] = [
  {
    _id: "summ_001",
    courseId: "course_001",
    courseCode: "CPSC 413",
    title: "Dynamic Programming: State Definition & Transitions",
    content: "The most crucial step in solving DP problems is correctly defining your state. Your state must capture all information needed to make future decisions. Common mistakes include: (1) Not identifying independent subproblems, (2) Including unnecessary information in state, (3) Failing to connect state transitions logically. Key pattern: If you're solving the same subproblem multiple times, you likely need memoization. Always sketch the state space before coding - include base cases, transitions, and final answer computation.",
    authorId: "user_001",
    authorUsername: "alex_student",
    votes: 156,
    tags: ["DP", "State", "Foundation"],
    topic: "Dynamic Programming",
    professor: "Dr. Sarah Johnson",
    difficulty: 8,
    semester: "Fall",
    year: 2025,
    createdAt: "2025-10-10T10:00:00Z",
    updatedAt: "2025-12-15T14:30:00Z"
  },
  {
    _id: "summ_002",
    courseId: "course_001",
    courseCode: "CPSC 413",
    title: "Graph Algorithms: MST & Shortest Paths",
    content: "Master the two main graph problem families: (1) Minimum Spanning Trees (Kruskal's/Prim's) - find optimal spanning structure, (2) Shortest Paths (Dijkstra/Bellman-Ford) - find optimal routes. Understand trade-offs: Kruskal's is easier to code, Prim's is better for dense graphs. For shortest paths, use Dijkstra for non-negative weights (greedy works), Bellman-Ford for negative weights. Key insight: Greedy works for MST and shortest paths because of optimal substructure + greedy choice property. Practice proving why the greedy choice is always safe.",
    authorId: "user_002",
    authorUsername: "sam_coder",
    votes: 142,
    tags: ["Graphs", "MST", "ShortestPath"],
    topic: "Graph Algorithms",
    professor: "Dr. Sarah Johnson",
    difficulty: 7,
    semester: "Fall",
    year: 2025,
    createdAt: "2025-11-05T14:20:00Z",
    updatedAt: "2025-12-20T11:15:00Z"
  },
  {
    _id: "summ_003",
    courseId: "course_001",
    courseCode: "CPSC 413",
    title: "Complexity Analysis: Big-O, Big-Theta, Big-Omega",
    content: "Understanding asymptotic notation is essential for algorithm analysis. Big-O (upper bound) tells you the worst case, Big-Omega (lower bound) tells you the best case, Big-Theta (tight bound) tells you the average case. When analyzing DP solutions, account for both time (number of subproblems × work per subproblem) and space (memoization table size). Common complexity pitfall: Not accounting for the cost of operations (e.g., string concatenation can be O(n)). Always clarify: number of subproblems, maximum number of transitions per state, and cost of each operation.",
    authorId: "user_003",
    authorUsername: "jordan_dev",
    votes: 98,
    tags: ["Complexity", "Analysis", "BigO"],
    topic: "Algorithm Analysis",
    professor: "Dr. Sarah Johnson",
    difficulty: 6,
    semester: "Fall",
    year: 2025,
    createdAt: "2025-11-15T09:30:00Z",
    updatedAt: "2025-12-10T16:45:00Z"
  },
  {
    _id: "summ_004",
    courseId: "course_003",
    courseCode: "CPSC 457",
    title: "Process Scheduling: Algorithms & Trade-offs",
    content: "Modern OS scheduling aims to balance CPU utilization, fairness, and response time. Key algorithms: (1) FCFS - simple but can cause convoy effect, (2) SJF - optimal average wait time but requires predicting burst time, (3) Round Robin - fair but context switching overhead, (4) Priority-based - real-time requirements but risk of starvation. Critical concept: Preemptive vs non-preemptive scheduling affects both fairness and performance. In exam answers, always mention fairness considerations and explain why your chosen algorithm provides good trade-offs for the scenario. Remember: no single algorithm is optimal for all workloads.",
    authorId: "user_002",
    authorUsername: "sam_coder",
    votes: 124,
    tags: ["Scheduling", "Performance", "Fairness"],
    topic: "Process Management",
    professor: "Dr. Emily Rodriguez",
    difficulty: 7,
    semester: "Fall",
    year: 2025,
    createdAt: "2025-10-18T13:45:00Z",
    updatedAt: "2025-12-18T10:20:00Z"
  },
  {
    _id: "summ_005",
    courseId: "course_003",
    courseCode: "CPSC 457",
    title: "Memory Management: Paging & Virtual Memory",
    content: "Virtual memory separates logical address space from physical address space. Paging divides both into fixed-size pages/frames. Key components: (1) Page table - maps virtual pages to physical frames, (2) TLB - hardware cache for page table entries (massive performance impact), (3) Page replacement algorithms - LRU is most common but FIFO/Optimal are still important conceptually. Critical failure mode: Thrashing occurs when processes spend more time paging than executing. To minimize page faults, keep working set in memory. When designing memory schemes for exams, discuss spatial/temporal locality and justifyframe allocation decisions.",
    authorId: "user_004",
    authorUsername: "casey_tech",
    votes: 87,
    tags: ["Memory", "Paging", "Virtual"],
    topic: "Memory Management",
    professor: "Dr. Emily Rodriguez",
    difficulty: 8,
    semester: "Fall",
    year: 2025,
    createdAt: "2025-11-02T11:00:00Z",
    updatedAt: "2025-12-22T14:30:00Z"
  },
  {
    _id: "summ_006",
    courseId: "course_002",
    courseCode: "CPSC 351",
    title: "Formal Languages & Automata: DFA to Turing Machines",
    content: "Build intuition for computational models from weakest to strongest: (1) DFA - finite state, can't match parentheses, (2) PDA - single stack, matches balanced parentheses, (3) Turing Machines - unbounded tape, universally computable. Key pattern: Each model extends the previous with more memory/power but becomes harder to design. To prove a language isn't in a class, use pumping lemma or closure properties. To prove decidability/recognition, construct an explicit automaton or TM. Critical insight: Church-Turing thesis claims TMs capture all computable functions - this is foundational to understand why some problems are inherently unsolvable.",
    authorId: "user_001",
    authorUsername: "alex_student",
    votes: 167,
    tags: ["Automata", "Languages", "Computation"],
    topic: "Foundations of Computing",
    professor: "Dr. Michael Chen",
    difficulty: 9,
    semester: "Winter",
    year: 2026,
    createdAt: "2025-12-01T15:30:00Z",
    updatedAt: "2026-01-25T12:00:00Z"
  },
  {
    _id: "summ_007",
    courseId: "course_004",
    courseCode: "CPSC 559",
    title: "Consistency Models in Distributed Systems",
    content: "Understanding consistency models is crucial for distributed system design. Spectrum from weakest to strongest: (1) Eventual Consistency - updates eventually propagate but no guarantees on timing, (2) Causal Consistency - respects causal relationships, (3) Strong Consistency - all nodes see same value immediately. Trade-off: Strong consistency is easier to program but harder to achieve with fault tolerance. Weak consistency enables availability but requires application-level handling of inconsistencies. CAP theorem states you can't have all three (Consistency, Availability, Partition tolerance) - choose your trade-off based on application needs. In exams, always justify consistency choice with specific failure scenarios.",
    authorId: "user_003",
    authorUsername: "jordan_dev",
    votes: 112,
    tags: ["Consistency", "Replication", "CAP"],
    topic: "Distributed Computing",
    professor: "Dr. James Kim",
    difficulty: 9,
    semester: "Winter",
    year: 2026,
    createdAt: "2026-01-10T10:45:00Z",
    updatedAt: "2026-02-05T13:20:00Z"
  },
  {
    _id: "summ_008",
    courseId: "course_004",
    courseCode: "CPSC 559",
    title: "Fault Tolerance: Replication & Consensus",
    content: "Distributed systems must handle failures gracefully. Two main strategies: (1) Replication - maintain copies on multiple nodes, handle inconsistency via consensus protocols (Paxos, Raft), (2) Sharding - partition data across nodes, reduce single-point failures. Consensus algorithms are the foundation: Paxos guarantees safety (consistency) but is complex, Raft is engineering-friendly version of Paxos. Byzantine Fault Tolerance needed only when nodes can actively deceive - more complex, rarely needed. Key metric: system tolerates f failures with 2f+1 (or 3f+1 for Byzantine) nodes. Practice: understand quorum requirements and why they're necessary for safety.",
    authorId: "user_002",
    authorUsername: "sam_coder",
    votes: 89,
    tags: ["Replication", "Consensus", "Faults"],
    topic: "Distributed Computing",
    professor: "Dr. James Kim",
    difficulty: 10,
    semester: "Winter",
    year: 2026,
    createdAt: "2026-01-15T14:15:00Z",
    updatedAt: "2026-02-08T11:30:00Z"
  }
];

// Helper function to simulate API calls (replace with actual FastAPI calls later)
export const api = {
  getCourses: async (): Promise<Course[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_COURSES;
  },
  
  getCourseById: async (id: string): Promise<Course | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_COURSES.find(c => c._id === id) || null;
  },
  
  getCourseByCode: async (code: string): Promise<Course | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_COURSES.find(c => c.courseCode === code) || null;
  },
  
  getProblems: async (): Promise<Problem[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_PROBLEMS;
  },
  
  getProblemsByCourse: async (courseId: string): Promise<Problem[]> => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return MOCK_PROBLEMS.filter(p => p.courseId === courseId);
  },
  
  searchCourses: async (query: string): Promise<Course[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const lowerQuery = query.toLowerCase();
    return MOCK_COURSES.filter(c => 
      c.courseCode.toLowerCase().includes(lowerQuery) ||
      c.courseName.toLowerCase().includes(lowerQuery) ||
      c.professor.toLowerCase().includes(lowerQuery) ||
      c.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },
  
  getProblemById: async (id: string): Promise<Problem | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return MOCK_PROBLEMS.find(p => p._id === id) || null;
  },
  
  getResponsesByProblem: async (problemId: string): Promise<Response[]> => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return MOCK_RESPONSES.filter(r => r.problemId === problemId);
  },

  getSummariesByCourse: async (courseCode: string): Promise<Summary[]> => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return MOCK_SUMMARIES.filter(s => s.courseCode === courseCode);
  }
};
