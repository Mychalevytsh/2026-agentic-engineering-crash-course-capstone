import type { Level, Question } from "./types";

export const QUESTION_BANK: Question[] = [
  // ---------- junior ----------
  {
    id: "j1",
    level: "junior",
    topic: "Strings",
    text: "What does == compare when applied to two String variables?",
    options: [
      "The characters of both strings",
      "The lengths of both strings",
      "The object references of both",
      "The hash codes of both strings",
    ],
    correctIndex: 2,
    explanation:
      "== compares references. Use equals() to compare the characters; two equal strings may still be different objects.",
  },
  {
    id: "j2",
    level: "junior",
    topic: "OOP",
    text: "Which keyword prevents a class from being extended?",
    options: ["final", "static", "native", "abstract"],
    correctIndex: 0,
    explanation:
      "A final class cannot be subclassed. An abstract class, by contrast, exists only to be extended.",
  },
  {
    id: "j3",
    level: "junior",
    topic: "Basics",
    text: "What is the default value of an int instance field?",
    options: ["null value", "zero (0)", "minus one", "not a number"],
    correctIndex: 1,
    explanation:
      "Instance fields get default values: 0 for int, false for boolean, null for references. Local variables get none.",
  },
  {
    id: "j4",
    level: "junior",
    topic: "Collections",
    text: "Which operation is fastest on an ArrayList compared to a LinkedList?",
    options: [
      "Inserting at the head",
      "Removing the first item",
      "Inserting in the middle",
      "Reading an item by index",
    ],
    correctIndex: 3,
    explanation:
      "ArrayList is backed by an array, so get(index) is O(1). LinkedList must walk the nodes, which is O(n).",
  },
  {
    id: "j5",
    level: "junior",
    topic: "Basics",
    text: "What does the static modifier on a method mean?",
    options: [
      "It belongs to the class, not an instance",
      "It cannot be overridden by anyone ever",
      "It runs once at program startup time",
      "It is only visible inside its package",
    ],
    correctIndex: 0,
    explanation:
      "A static method is called on the class itself and has no this reference, so it cannot use instance fields directly.",
  },

  // ---------- middle ----------
  {
    id: "m1",
    level: "middle",
    topic: "Collections",
    text: "Two different keys in a HashMap have the same hashCode(). What happens?",
    options: [
      "The second put throws an error",
      "The first entry is overwritten",
      "Both share a bucket; equals() decides",
      "The map rehashes until they differ",
    ],
    correctIndex: 2,
    explanation:
      "Colliding keys are stored in the same bucket (a list, or a tree when long). equals() is used to tell them apart.",
  },
  {
    id: "m2",
    level: "middle",
    topic: "Exceptions",
    text: "Which of these is a checked exception?",
    options: [
      "NullPointerException",
      "IOException",
      "IllegalStateException",
      "ClassCastException",
    ],
    correctIndex: 1,
    explanation:
      "IOException extends Exception, so the compiler forces you to handle or declare it. The others are RuntimeExceptions.",
  },
  {
    id: "m3",
    level: "middle",
    topic: "Concurrency",
    text: "What does the volatile keyword guarantee for a field?",
    options: [
      "Atomic updates for compound operations",
      "Mutual exclusion between all threads",
      "Visibility of writes to other threads",
      "That the value is never cached at all",
    ],
    correctIndex: 2,
    explanation:
      "volatile gives visibility and ordering, not atomicity: count++ on a volatile field is still a race.",
  },
  {
    id: "m4",
    level: "middle",
    topic: "Streams",
    text: "When does the filter() step of a Java stream actually run?",
    options: [
      "Only when a terminal operation is called",
      "Immediately when filter() is invoked",
      "When the stream is first created",
      "On a separate thread right away",
    ],
    correctIndex: 0,
    explanation:
      "Intermediate operations are lazy. Nothing is processed until a terminal operation such as collect() or forEach().",
  },
  {
    id: "m5",
    level: "middle",
    topic: "OOP",
    text: "Which statement about interfaces since Java 8 is true?",
    options: [
      "They cannot declare any constants",
      "They can hold instance fields",
      "They must have a public constructor",
      "They can have default methods",
    ],
    correctIndex: 3,
    explanation:
      "Java 8 added default and static methods to interfaces. Interfaces still cannot hold instance state or constructors.",
  },

  // ---------- senior ----------
  {
    id: "s1",
    level: "senior",
    topic: "JVM",
    text: "What usually causes a memory leak in a garbage-collected Java program?",
    options: [
      "Objects that GC cannot reach at all",
      "Forgetting to call free() on objects",
      "Objects still referenced but unused",
      "Too many short-lived local variables",
    ],
    correctIndex: 2,
    explanation:
      "GC only frees unreachable objects. Forgotten references, such as in static caches or listeners, keep dead data alive.",
  },
  {
    id: "s2",
    level: "senior",
    topic: "Concurrency",
    text: "How does ConcurrentHashMap mainly avoid a single global lock?",
    options: [
      "It locks or CASes per bin instead",
      "It copies the whole map on each write",
      "It allows only one writing thread",
      "It disables all locking for readers",
    ],
    correctIndex: 0,
    explanation:
      "Modern ConcurrentHashMap uses CAS for empty bins and synchronizes on the first node of a bin, so writers to different bins do not block each other.",
  },
  {
    id: "s3",
    level: "senior",
    topic: "Memory model",
    text: "Which action creates a happens-before edge between two threads?",
    options: [
      "Calling Thread.sleep() in both threads",
      "Releasing a monitor, then another thread locking it",
      "Reading a plain field after a long delay",
      "Calling System.gc() before the read",
    ],
    correctIndex: 1,
    explanation:
      "An unlock of a monitor happens-before every later lock of the same monitor. Sleeping or waiting for time gives no such guarantee.",
  },
  {
    id: "s4",
    level: "senior",
    topic: "Spring",
    text: "Why might @Transactional be ignored when a method calls another method in the same class?",
    options: [
      "Transactions only work on static methods",
      "The annotation is only read at compile time",
      "The database driver disables nested calls",
      "The call bypasses the Spring proxy",
    ],
    correctIndex: 3,
    explanation:
      "Spring applies transactions through a proxy. A self-invocation goes straight to this, so the proxy and its advice never run.",
  },
  {
    id: "s5",
    level: "senior",
    topic: "Concurrency",
    text: "For which workload are Java 21 virtual threads the best fit?",
    options: [
      "Many tasks that mostly wait on blocking I/O",
      "Heavy CPU-bound number crunching loops",
      "Tasks that must never be pre-empted at all",
      "Code that depends on thread-local caches",
    ],
    correctIndex: 0,
    explanation:
      "Virtual threads make blocking cheap, so they shine with many I/O-bound tasks. They add nothing for CPU-bound work, which is limited by cores.",
  },
];

export function getQuestions(level: Level): Question[] {
  return QUESTION_BANK.filter((q) => q.level === level);
}
