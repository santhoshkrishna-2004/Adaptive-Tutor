export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  difficulty: "easy" | "medium" | "hard"
  topic: string
}

export interface QuizData {
  title: string
  questions: QuizQuestion[]
  subject: string
  topic: string
}

// Comprehensive question database organized by subject and topic
const questionDatabase: Record<string, Record<string, QuizQuestion[]>> = {
  "Data Structures": {
    Arrays: [
      {
        id: 1,
        question: "What is the time complexity of accessing an element in an array by index?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: "O(1)",
        explanation: "Array elements can be accessed directly using their index, which is a constant time operation.",
        difficulty: "easy",
        topic: "Arrays",
      },
      {
        id: 2,
        question: "Which operation is most expensive in a dynamic array?",
        options: ["Access", "Search", "Insertion at end", "Insertion at beginning"],
        correctAnswer: "Insertion at beginning",
        explanation: "Inserting at the beginning requires shifting all existing elements, making it O(n).",
        difficulty: "medium",
        topic: "Arrays",
      },
    ],
    "Linked Lists": [
      {
        id: 3,
        question: "What is the main advantage of linked lists over arrays?",
        options: ["Faster access", "Dynamic size", "Better cache locality", "Less memory usage"],
        correctAnswer: "Dynamic size",
        explanation: "Linked lists can grow and shrink during runtime, unlike fixed-size arrays.",
        difficulty: "easy",
        topic: "Linked Lists",
      },
      {
        id: 4,
        question: "What is the time complexity of inserting a node at the beginning of a singly linked list?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: "O(1)",
        explanation: "Inserting at the beginning only requires updating the head pointer.",
        difficulty: "medium",
        topic: "Linked Lists",
      },
    ],
    Stacks: [
      {
        id: 5,
        question: "Which principle does a stack follow?",
        options: ["FIFO", "LIFO", "Random Access", "Priority Based"],
        correctAnswer: "LIFO",
        explanation: "Stack follows Last In First Out (LIFO) principle.",
        difficulty: "easy",
        topic: "Stacks",
      },
      {
        id: 6,
        question: "Which of the following applications uses stack data structure?",
        options: ["Breadth First Search", "Function call management", "Shortest path algorithms", "Hash tables"],
        correctAnswer: "Function call management",
        explanation: "Function calls are managed using a call stack to keep track of function execution.",
        difficulty: "medium",
        topic: "Stacks",
      },
    ],
    Queues: [
      {
        id: 7,
        question: "Which principle does a queue follow?",
        options: ["LIFO", "FIFO", "Random Access", "Priority Based"],
        correctAnswer: "FIFO",
        explanation: "Queue follows First In First Out (FIFO) principle.",
        difficulty: "easy",
        topic: "Queues",
      },
      {
        id: 8,
        question: "In a circular queue, what happens when rear reaches the end of the array?",
        options: ["Queue becomes full", "Error occurs", "Rear wraps around to the beginning", "Queue is reset"],
        correctAnswer: "Rear wraps around to the beginning",
        explanation: "In a circular queue, the rear pointer wraps around to utilize the space efficiently.",
        difficulty: "medium",
        topic: "Queues",
      },
    ],
    Trees: [
      {
        id: 9,
        question: "What is the maximum number of children a node can have in a binary tree?",
        options: ["1", "2", "3", "Unlimited"],
        correctAnswer: "2",
        explanation: "In a binary tree, each node can have at most 2 children (left and right).",
        difficulty: "easy",
        topic: "Trees",
      },
      {
        id: 10,
        question: "What is the height of a complete binary tree with n nodes?",
        options: ["log₂(n)", "⌊log₂(n)⌋", "⌈log₂(n+1)⌉", "n"],
        correctAnswer: "⌊log₂(n)⌋",
        explanation: "The height of a complete binary tree with n nodes is floor(log₂(n)).",
        difficulty: "hard",
        topic: "Trees",
      },
    ],
  },
  Algorithms: {
    Sorting: [
      {
        id: 11,
        question: "What is the best case time complexity of Quick Sort?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctAnswer: "O(n log n)",
        explanation: "Quick Sort has O(n log n) time complexity in the best and average cases.",
        difficulty: "medium",
        topic: "Sorting",
      },
      {
        id: 12,
        question: "Which sorting algorithm is stable?",
        options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
        correctAnswer: "Merge Sort",
        explanation: "Merge Sort maintains the relative order of equal elements, making it stable.",
        difficulty: "medium",
        topic: "Sorting",
      },
    ],
    Searching: [
      {
        id: 13,
        question: "What is the prerequisite for binary search?",
        options: [
          "Array should be large",
          "Array should be sorted",
          "Array should have unique elements",
          "Array should be dynamic",
        ],
        correctAnswer: "Array should be sorted",
        explanation: "Binary search requires the array to be sorted to work correctly.",
        difficulty: "easy",
        topic: "Searching",
      },
      {
        id: 14,
        question: "What is the time complexity of binary search?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
        correctAnswer: "O(log n)",
        explanation: "Binary search eliminates half of the search space in each iteration.",
        difficulty: "easy",
        topic: "Searching",
      },
    ],
    "Graph Algorithms": [
      {
        id: 15,
        question: "Which algorithm is used to find the shortest path in an unweighted graph?",
        options: ["Dijkstra's", "Bellman-Ford", "BFS", "DFS"],
        correctAnswer: "BFS",
        explanation: "BFS finds the shortest path in terms of number of edges in unweighted graphs.",
        difficulty: "medium",
        topic: "Graph Algorithms",
      },
      {
        id: 16,
        question: "What is the time complexity of Dijkstra's algorithm using a binary heap?",
        options: ["O(V²)", "O(E log V)", "O(V log V)", "O(E + V)"],
        correctAnswer: "O(E log V)",
        explanation: "Using a binary heap, Dijkstra's algorithm has O(E log V) time complexity.",
        difficulty: "hard",
        topic: "Graph Algorithms",
      },
    ],
  },
  "Database Systems": {
    "SQL Basics": [
      {
        id: 17,
        question: "Which SQL command is used to retrieve data from a database?",
        options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
        correctAnswer: "SELECT",
        explanation: "SELECT statement is used to query and retrieve data from database tables.",
        difficulty: "easy",
        topic: "SQL Basics",
      },
      {
        id: 18,
        question: "What does the WHERE clause do in SQL?",
        options: ["Sorts results", "Groups results", "Filters results", "Joins tables"],
        correctAnswer: "Filters results",
        explanation: "WHERE clause is used to filter records based on specified conditions.",
        difficulty: "easy",
        topic: "SQL Basics",
      },
    ],
    Normalization: [
      {
        id: 19,
        question: "What is the main purpose of database normalization?",
        options: ["Increase speed", "Reduce redundancy", "Add more tables", "Improve security"],
        correctAnswer: "Reduce redundancy",
        explanation: "Normalization eliminates data redundancy and ensures data integrity.",
        difficulty: "medium",
        topic: "Normalization",
      },
      {
        id: 20,
        question: "Which normal form eliminates transitive dependencies?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        correctAnswer: "3NF",
        explanation: "Third Normal Form (3NF) eliminates transitive functional dependencies.",
        difficulty: "hard",
        topic: "Normalization",
      },
    ],
  },
  "Computer Networks": {
    "OSI Model": [
      {
        id: 21,
        question: "How many layers are there in the OSI model?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7",
        explanation:
          "The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.",
        difficulty: "easy",
        topic: "OSI Model",
      },
      {
        id: 22,
        question: "Which layer of OSI model handles routing?",
        options: ["Physical", "Data Link", "Network", "Transport"],
        correctAnswer: "Network",
        explanation: "The Network layer (Layer 3) is responsible for routing packets between networks.",
        difficulty: "medium",
        topic: "OSI Model",
      },
    ],
    "TCP/IP": [
      {
        id: 23,
        question: "What does TCP stand for?",
        options: [
          "Transfer Control Protocol",
          "Transmission Control Protocol",
          "Transport Control Protocol",
          "Terminal Control Protocol",
        ],
        correctAnswer: "Transmission Control Protocol",
        explanation: "TCP stands for Transmission Control Protocol, a reliable transport protocol.",
        difficulty: "easy",
        topic: "TCP/IP",
      },
      {
        id: 24,
        question: "Which protocol is connectionless?",
        options: ["TCP", "UDP", "HTTP", "FTP"],
        correctAnswer: "UDP",
        explanation: "UDP (User Datagram Protocol) is connectionless and does not guarantee delivery.",
        difficulty: "medium",
        topic: "TCP/IP",
      },
    ],
  },
  "Thermodynamics I": {
    "Laws of Thermodynamics": [
      {
        id: 25,
        question: "What does the First Law of Thermodynamics state?",
        options: [
          "Energy cannot be created or destroyed",
          "Entropy always increases",
          "Heat flows from hot to cold",
          "Work equals heat",
        ],
        correctAnswer: "Energy cannot be created or destroyed",
        explanation:
          "The First Law states that energy is conserved - it can only be converted from one form to another.",
        difficulty: "easy",
        topic: "Laws of Thermodynamics",
      },
      {
        id: 26,
        question: "Which process has zero heat transfer?",
        options: ["Isothermal", "Adiabatic", "Isobaric", "Isochoric"],
        correctAnswer: "Adiabatic",
        explanation: "In an adiabatic process, no heat is transferred to or from the system.",
        difficulty: "medium",
        topic: "Laws of Thermodynamics",
      },
    ],
    "Heat Engines": [
      {
        id: 27,
        question: "What is the efficiency of a Carnot engine operating between 300K and 600K?",
        options: ["25%", "50%", "75%", "100%"],
        correctAnswer: "50%",
        explanation: "Carnot efficiency = 1 - (T_cold/T_hot) = 1 - (300/600) = 0.5 or 50%",
        difficulty: "hard",
        topic: "Heat Engines",
      },
    ],
  },
  "Strength of Materials": {
    "Stress and Strain": [
      {
        id: 28,
        question: "What is Hooke's Law?",
        options: [
          "Stress = Strain × Young's Modulus",
          "Force = Mass × Acceleration",
          "Stress = Force / Area",
          "Strain = Change in length / Original length",
        ],
        correctAnswer: "Stress = Strain × Young's Modulus",
        explanation: "Hooke's Law states that stress is directly proportional to strain within the elastic limit.",
        difficulty: "easy",
        topic: "Stress and Strain",
      },
      {
        id: 29,
        question: "What is Poisson's ratio?",
        options: [
          "Longitudinal strain / Lateral strain",
          "Lateral strain / Longitudinal strain",
          "Stress / Strain",
          "Force / Area",
        ],
        correctAnswer: "Lateral strain / Longitudinal strain",
        explanation: "Poisson's ratio is the ratio of lateral strain to longitudinal strain.",
        difficulty: "medium",
        topic: "Stress and Strain",
      },
    ],
  },
  "Digital Electronics": {
    "Logic Gates": [
      {
        id: 30,
        question: "Which gate gives output 1 only when all inputs are 1?",
        options: ["OR", "AND", "NAND", "XOR"],
        correctAnswer: "AND",
        explanation: "AND gate outputs 1 only when all inputs are 1, otherwise it outputs 0.",
        difficulty: "easy",
        topic: "Logic Gates",
      },
      {
        id: 31,
        question: "What is the Boolean expression for NAND gate?",
        options: ["A + B", "A . B", "A + B (with bar)", "A . B (with bar)"],
        correctAnswer: "A . B (with bar)",
        explanation: "NAND gate is the complement of AND gate, so its expression is (A.B)'.",
        difficulty: "medium",
        topic: "Logic Gates",
      },
    ],
  },
}

// Declare additionalQuestions variable before using it
const additionalQuestions: Record<string, Record<string, QuizQuestion[]>> = {}

// Merge with existing questionDatabase
Object.assign(questionDatabase, additionalQuestions)

// Add this function to generate quizzes for any topic, even if not in database
export function generateAdaptiveQuiz(subject: string, topic: string, difficulty?: string, questionCount = 5): QuizData {
  const subjectQuestions = questionDatabase[subject]
  let availableQuestions: QuizQuestion[] = []

  if (subjectQuestions && topic && subjectQuestions[topic]) {
    // Get questions for specific topic
    availableQuestions = subjectQuestions[topic]
  } else if (subjectQuestions) {
    // Get questions from all topics in the subject
    availableQuestions = Object.values(subjectQuestions).flat()
  } else {
    // Generate questions for the specific topic even if not in database
    availableQuestions = generateTopicQuestions(subject, topic, questionCount)
  }

  // Filter by difficulty if specified
  if (difficulty && difficulty !== "all") {
    availableQuestions = availableQuestions.filter((q) => q.difficulty === difficulty)
  }

  // Shuffle and select questions
  const shuffled = availableQuestions.sort(() => Math.random() - 0.5)
  const selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length))

  // If we don't have enough questions, generate more
  if (selectedQuestions.length < questionCount) {
    const additionalQuestions = generateTopicQuestions(subject, topic, questionCount - selectedQuestions.length)
    selectedQuestions.push(...additionalQuestions)
  }

  return {
    title: `${subject} - ${topic} Quiz`,
    questions: selectedQuestions.slice(0, questionCount),
    subject,
    topic,
  }
}

// Generate questions for any topic
function generateTopicQuestions(subject: string, topic: string, count: number): QuizQuestion[] {
  const questions: QuizQuestion[] = []

  // Basic question templates that can be adapted to any topic
  const questionTemplates = [
    {
      template: `What is the main purpose of ${topic}?`,
      options: [
        `To solve specific problems in ${subject}`,
        `To make ${subject} more complex`,
        `To replace traditional methods`,
        `To confuse students`,
      ],
      correctAnswer: `To solve specific problems in ${subject}`,
      explanation: `${topic} is designed to address specific challenges and problems within ${subject}.`,
      difficulty: "easy" as const,
    },
    {
      template: `Which of the following is a key characteristic of ${topic}?`,
      options: [
        "High efficiency and performance",
        "Unnecessary complexity",
        "Limited applicability",
        "Obsolete methodology",
      ],
      correctAnswer: "High efficiency and performance",
      explanation: `${topic} is typically designed for efficiency and optimal performance in ${subject}.`,
      difficulty: "medium" as const,
    },
    {
      template: `What is the time complexity typically associated with ${topic}?`,
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctAnswer: "O(n)",
      explanation: `The time complexity depends on the specific implementation of ${topic}.`,
      difficulty: "hard" as const,
    },
    {
      template: `In which scenario would you most likely use ${topic}?`,
      options: [
        `When working with ${subject} problems`,
        "When avoiding ${subject}",
        "Only in theoretical discussions",
        "Never in practical applications",
      ],
      correctAnswer: `When working with ${subject} problems`,
      explanation: `${topic} is most applicable when dealing with practical problems in ${subject}.`,
      difficulty: "medium" as const,
    },
  ]

  for (let i = 0; i < count; i++) {
    const template = questionTemplates[i % questionTemplates.length]
    questions.push({
      id: Date.now() + i,
      question: template.template,
      options: template.options,
      correctAnswer: template.correctAnswer,
      explanation: template.explanation,
      difficulty: template.difficulty,
      topic: topic,
    })
  }

  return questions
}

// Update the main generateQuiz function to use the adaptive generator
export function generateQuiz(subject: string, topic?: string, difficulty?: string, questionCount = 5): QuizData {
  if (topic) {
    return generateAdaptiveQuiz(subject, topic, difficulty, questionCount)
  }

  // Original logic for when no specific topic is provided
  const subjectQuestions = questionDatabase[subject]

  if (!subjectQuestions) {
    return {
      title: `${subject} Quiz`,
      questions: getDefaultQuestions(questionCount),
      subject,
      topic: topic || "General",
    }
  }

  let availableQuestions: QuizQuestion[] = Object.values(subjectQuestions).flat()

  if (difficulty && difficulty !== "all") {
    availableQuestions = availableQuestions.filter((q) => q.difficulty === difficulty)
  }

  const shuffled = availableQuestions.sort(() => Math.random() - 0.5)
  const selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length))

  if (selectedQuestions.length < questionCount) {
    const remaining = getDefaultQuestions(questionCount - selectedQuestions.length)
    selectedQuestions.push(...remaining)
  }

  return {
    title: `${subject} Quiz`,
    questions: selectedQuestions,
    subject,
    topic: topic || "General",
  }
}

function getDefaultQuestions(count: number): QuizQuestion[] {
  const defaultQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "What is the time complexity of binary search?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctAnswer: "O(log n)",
      explanation: "Binary search eliminates half of the search space in each iteration.",
      difficulty: "medium",
      topic: "General",
    },
    {
      id: 2,
      question: "Which data structure uses LIFO principle?",
      options: ["Queue", "Stack", "Array", "Tree"],
      correctAnswer: "Stack",
      explanation: "Stack follows Last In First Out (LIFO) principle.",
      difficulty: "easy",
      topic: "General",
    },
    {
      id: 3,
      question: "What does SQL stand for?",
      options: [
        "Structured Query Language",
        "Simple Query Language",
        "Standard Query Language",
        "System Query Language",
      ],
      correctAnswer: "Structured Query Language",
      explanation: "SQL stands for Structured Query Language, used for managing databases.",
      difficulty: "easy",
      topic: "General",
    },
  ]

  return defaultQuestions.slice(0, count)
}

export function getAvailableTopics(subject: string): string[] {
  const subjectQuestions = questionDatabase[subject]
  return subjectQuestions ? Object.keys(subjectQuestions) : []
}

export function getSubjects(): string[] {
  return Object.keys(questionDatabase)
}
