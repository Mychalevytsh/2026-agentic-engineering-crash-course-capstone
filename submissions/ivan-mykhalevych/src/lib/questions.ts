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

  // ---------- junior (more) ----------
  {
    id: "j6",
    level: "junior",
    topic: "Collections",
    text: "Which of these collections does not allow duplicate elements?",
    options: ["ArrayList", "HashSet", "LinkedList", "ArrayDeque"],
    correctIndex: 1,
    explanation:
      "A Set rejects duplicates, as decided by equals() and hashCode(). Lists and deques accept repeated elements.",
  },
  {
    id: "j7",
    level: "junior",
    topic: "Strings",
    text: "What happens when you call toUpperCase() on a String?",
    options: [
      "It modifies the original string in place",
      "It returns a new string object",
      "It throws an UnsupportedOperationException",
      "It converts only the first character",
    ],
    correctIndex: 1,
    explanation:
      "Strings are immutable. Methods such as toUpperCase() return a new String and leave the original unchanged.",
  },
  {
    id: "j8",
    level: "junior",
    topic: "Basics",
    text: "What is the correct signature of the standard main method?",
    options: [
      "public static void main(String[] args)",
      "public void main(String[] args)",
      "static public int main(String[] args)",
      "public static main(String[] args)",
    ],
    correctIndex: 0,
    explanation:
      "The JVM looks for a public static void main(String[]) method. It must be static so no instance is needed, and it returns nothing.",
  },
  {
    id: "j9",
    level: "junior",
    topic: "OOP",
    text: "What is method overloading?",
    options: [
      "Calling a method from itself",
      "Same signature in a subclass",
      "Hiding a method with a field",
      "Same name, different parameter lists",
    ],
    correctIndex: 3,
    explanation:
      "Overloading means several methods share a name but differ in parameters. Redefining an inherited method with the same signature is overriding.",
  },
  {
    id: "j10",
    level: "junior",
    topic: "Basics",
    text: "What does the break statement do inside a loop?",
    options: [
      "Skips to the next iteration",
      "Restarts the loop from zero",
      "Exits the nearest enclosing loop",
      "Stops the whole program run",
    ],
    correctIndex: 2,
    explanation:
      "break leaves the innermost loop (or switch). continue is the statement that skips to the next iteration.",
  },

  // ---------- middle (more) ----------
  {
    id: "m6",
    level: "middle",
    topic: "Collections",
    text: "Which Map implementation keeps its keys in sorted order?",
    options: ["HashMap", "TreeMap", "LinkedHashMap", "WeakHashMap"],
    correctIndex: 1,
    explanation:
      "TreeMap keeps keys sorted by natural order or a Comparator. LinkedHashMap keeps insertion order, and HashMap makes no ordering promise.",
  },
  {
    id: "m7",
    level: "middle",
    topic: "Exceptions",
    text: "What does a try-with-resources statement do?",
    options: [
      "Closes resources automatically at the end",
      "Retries the block until it succeeds",
      "Catches every exception silently",
      "Runs the block on another thread",
    ],
    correctIndex: 0,
    explanation:
      "Resources that implement AutoCloseable are closed automatically when the block ends, even if an exception is thrown.",
  },
  {
    id: "m8",
    level: "middle",
    topic: "OOP",
    text: "What is the contract between equals() and hashCode()?",
    options: [
      "Equal hash codes imply equal objects",
      "hashCode() must be unique per object",
      "They must be overridden separately",
      "Equal objects must have equal hash codes",
    ],
    correctIndex: 3,
    explanation:
      "If a.equals(b) is true, both must return the same hashCode(). The reverse is not required: different objects may collide.",
  },
  {
    id: "m9",
    level: "middle",
    topic: "Generics",
    text: "What does type erasure mean for Java generics?",
    options: [
      "Types are checked only at runtime",
      "Primitive types are boxed automatically",
      "Generic type information is removed after compilation",
      "Generics are replaced by Object fields",
    ],
    correctIndex: 2,
    explanation:
      "The compiler checks generic types and then erases them, so at runtime a List<String> and a List<Integer> are the same class.",
  },
  {
    id: "m10",
    level: "middle",
    topic: "Concurrency",
    text: "How does Callable differ from Runnable?",
    options: [
      "Callable returns a result and can throw",
      "Runnable is only for daemon threads",
      "Callable cannot be used with executors",
      "Runnable always runs in a thread pool",
    ],
    correctIndex: 0,
    explanation:
      "Callable.call() returns a value and may throw checked exceptions. Runnable.run() returns nothing and cannot throw checked exceptions.",
  },

  // ---------- senior (more) ----------
  {
    id: "s6",
    level: "senior",
    topic: "JVM",
    text: "Where does modern HotSpot keep class metadata?",
    options: ["Metaspace", "Java heap", "Thread stack", "Code cache"],
    correctIndex: 0,
    explanation:
      "Since Java 8, class metadata lives in Metaspace, which uses native memory. It replaced the old permanent generation.",
  },
  {
    id: "s7",
    level: "senior",
    topic: "JVM",
    text: "What is the main goal of the G1 garbage collector?",
    options: [
      "Running without any stop-the-world phases",
      "Predictable pause times on large heaps",
      "Compressing the bytecode on disk",
      "Zero memory usage by the application",
    ],
    correctIndex: 1,
    explanation:
      "G1 splits the heap into regions and collects the most profitable ones first, aiming to meet a target pause time. It still has short stop-the-world phases.",
  },
  {
    id: "s8",
    level: "senior",
    topic: "Concurrency",
    text: "What is a classic cause of a deadlock?",
    options: [
      "Using too many daemon threads",
      "Calling wait() inside a loop",
      "Threads taking locks in different orders",
      "Reading a volatile field twice",
    ],
    correctIndex: 2,
    explanation:
      "If thread A holds lock 1 and waits for lock 2 while thread B holds lock 2 and waits for lock 1, neither can proceed. A fixed global lock order prevents it.",
  },
  {
    id: "s9",
    level: "senior",
    topic: "Design",
    text: "Why is composition often preferred over inheritance?",
    options: [
      "It makes objects faster to create",
      "It removes the need for interfaces",
      "It lets you extend several classes",
      "It reduces coupling to a parent class",
    ],
    correctIndex: 3,
    explanation:
      "Inheritance ties a subclass to its parent's implementation. Composition lets you swap behaviour behind an interface without that tight coupling.",
  },
  {
    id: "s10",
    level: "senior",
    topic: "Spring",
    text: "What is the default scope of a Spring bean?",
    options: ["prototype", "singleton", "request", "session"],
    correctIndex: 1,
    explanation:
      "By default Spring creates one shared instance per container (singleton). Mutable state in singleton beans therefore needs care across threads.",
  },
];

export function getQuestions(level: Level): Question[] {
  return QUESTION_BANK.filter((q) => q.level === level);
}
