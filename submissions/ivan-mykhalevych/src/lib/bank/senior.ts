import type { Question } from "../types";

export const SENIOR_QUESTIONS: Question[] = [
  {
    id: "s1",
    level: "senior",
    topic: "JVM",
    text: "What usually causes a memory leak in a garbage-collected Java program?",
    options: [
      "Objects that GC cannot reach at all",
      "Forgetting to call free() on objects",
      "Too many short-lived local variables",
      "Objects still referenced but unused",
    ],
    correctIndex: 3,
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
      "Releasing a monitor, then another thread locking it",
      "Calling Thread.sleep() for long enough in both threads",
      "Reading a plain field after a long delay",
      "Calling System.gc() before the read",
    ],
    correctIndex: 0,
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
      "Heavy CPU-bound number crunching loops",
      "Code that keeps every core busy all day",
      "Many tasks that mostly wait on blocking I/O",
      "Code that depends on thread-local caches",
    ],
    correctIndex: 2,
    explanation:
      "Virtual threads make blocking cheap, so they shine with many I/O-bound tasks. They add nothing for CPU-bound work, which is limited by cores.",
  },
  {
    id: "s6",
    level: "senior",
    topic: "JVM",
    text: "Where does modern HotSpot keep class metadata?",
    options: [
      "Young generation",
      "Thread stack",
      "Metaspace",
      "Code cache",
    ],
    correctIndex: 2,
    explanation:
      "Since Java 8, class metadata lives in Metaspace, which uses native memory. It replaced the old permanent generation.",
  },
  {
    id: "s7",
    level: "senior",
    topic: "JVM",
    text: "What is the main goal of the G1 garbage collector?",
    options: [
      "Never pausing the application at all",
      "Compressing the bytecode on disk",
      "Predictable pause times on large heaps",
      "Zero memory usage by the application",
    ],
    correctIndex: 2,
    explanation:
      "G1 splits the heap into regions and collects the most profitable ones first, aiming to meet a target pause time. It still has short stop-the-world phases.",
  },
  {
    id: "s8",
    level: "senior",
    topic: "Concurrency",
    text: "What is a classic cause of a deadlock?",
    options: [
      "Threads taking locks in different orders",
      "Using too many daemon threads",
      "Calling wait() inside a loop",
      "Holding a ReentrantLock for too long",
    ],
    correctIndex: 0,
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
      "It reduces coupling to a parent class",
      "It lets a subclass reach private data",
    ],
    correctIndex: 2,
    explanation:
      "Inheritance ties a subclass to its parent's implementation. Composition lets you swap behaviour behind an interface without that tight coupling.",
  },
  {
    id: "s10",
    level: "senior",
    topic: "Spring",
    text: "What is the default scope of a Spring bean?",
    options: [
      "prototype",
      "request",
      "session",
      "singleton",
    ],
    correctIndex: 3,
    explanation:
      "By default Spring creates one shared instance per container (singleton). Mutable state in singleton beans therefore needs care across threads.",
  },
  {
    id: "s11",
    level: "senior",
    topic: "Concurrency",
    text: "Why is this class not thread-safe?",
    code: `class Counter {
    private int count;

    void increment() {
        count++;
    }
}`,
    options: [
      "count++ is not an atomic operation",
      "int fields cannot be shared between threads",
      "increment() must be declared static to work",
      "count must be final to be visible",
    ],
    correctIndex: 0,
    explanation:
      "count++ is a read, an add and a write. Two threads can interleave those steps and lose updates. Use AtomicInteger or synchronization.",
  },
  {
    id: "s12",
    level: "senior",
    topic: "Basics",
    text: "What does value() return?",
    code: `static int value() {
    try {
        return 1;
    } finally {
        return 2;
    }
}`,
    options: [
      "It returns 1",
      "It returns 2",
      "It throws an exception",
      "It does not compile",
    ],
    correctIndex: 1,
    explanation:
      "A return inside finally overrides the earlier return, so the method returns 2. It compiles, but it is considered bad practice and hides exceptions.",
  },
  {
    id: "s13",
    level: "senior",
    topic: "JVM",
    text: "What does the JIT compiler do?",
    options: [
      "Compiles hot bytecode to machine code",
      "Translates Java source to bytecode",
      "Collects unreachable objects",
      "Verifies class files before loading",
    ],
    correctIndex: 0,
    explanation:
      "The just-in-time compiler watches which methods run often and compiles that bytecode to optimised machine code while the program runs.",
  },
  {
    id: "s14",
    level: "senior",
    topic: "JVM",
    text: "What is parent delegation in class loading?",
    options: [
      "Classes are loaded from the newest jar",
      "Every class is loaded twice for safety",
      "A loader asks its parent first",
      "The child loader skips the parent",
    ],
    correctIndex: 2,
    explanation:
      "A classloader first delegates the request to its parent and only loads the class itself if the parent cannot. This keeps core classes from being replaced.",
  },
  {
    id: "s15",
    level: "senior",
    topic: "JVM",
    text: "Which of these is a garbage collection root?",
    options: [
      "Any object that is large",
      "An object in the old generation",
      "A field of an unreachable object",
      "A live thread's local variable",
    ],
    correctIndex: 3,
    explanation:
      "GC roots, such as local variables on thread stacks and static fields, are the starting points. Everything reachable from them is kept.",
  },
  {
    id: "s16",
    level: "senior",
    topic: "JVM",
    text: "What does the JVM option -Xmx set?",
    options: [
      "The initial stack size",
      "The minimum heap size",
      "The metaspace limit",
      "The maximum heap size",
    ],
    correctIndex: 3,
    explanation:
      "-Xmx sets the largest size the heap may grow to. -Xms sets the initial heap size.",
  },
  {
    id: "s17",
    level: "senior",
    topic: "JVM",
    text: "What does String.intern() do?",
    options: [
      "Copies the string to a new object",
      "Returns the canonical pooled instance",
      "Makes the string immutable",
      "Encrypts the string in memory",
    ],
    correctIndex: 1,
    explanation:
      "intern() returns the one shared instance from the string pool that equals this string, adding it to the pool if it is not there yet.",
  },
  {
    id: "s18",
    level: "senior",
    topic: "JVM",
    text: "When is an object that is held only by a WeakReference collected?",
    options: [
      "Never, until the JVM exits",
      "Only if memory runs out",
      "After exactly one minute",
      "At the next garbage collection",
    ],
    correctIndex: 3,
    explanation:
      "An object reachable only through weak references can be reclaimed at the next collection, which makes them useful for caches.",
  },
  {
    id: "s19",
    level: "senior",
    topic: "JVM",
    text: "What can escape analysis allow the JIT compiler to do?",
    options: [
      "Avoid heap allocation for non-escaping objects",
      "Skip bytecode verification",
      "Load classes in parallel",
      "Remove every synchronized block from the program",
    ],
    correctIndex: 0,
    explanation:
      "If an object never escapes the method, the JIT can avoid allocating it on the heap, and it can drop locks on objects no other thread can see.",
  },
  {
    id: "s20",
    level: "senior",
    topic: "Concurrency",
    text: "What does compare-and-swap (CAS) do?",
    options: [
      "Updates a value only if it is unchanged",
      "Blocks until another thread changes it",
      "Copies a value to another thread",
      "Swaps two threads' priorities",
    ],
    correctIndex: 0,
    explanation:
      "CAS atomically writes a new value only if the current value still equals the expected one. Atomic classes retry in a loop when it fails.",
  },
  {
    id: "s21",
    level: "senior",
    topic: "Concurrency",
    text: "What can ReentrantLock do that synchronized cannot?",
    options: [
      "Lock a method of another JVM",
      "Try to lock with a timeout",
      "Avoid all deadlocks",
      "Run without a monitor",
    ],
    correctIndex: 1,
    explanation:
      "ReentrantLock offers tryLock with a timeout, interruptible locking and fairness options. It does not prevent deadlocks by itself.",
  },
  {
    id: "s22",
    level: "senior",
    topic: "Concurrency",
    text: "Which method chains a transformation onto a CompletableFuture result?",
    options: [
      "thenWait()",
      "thenApply()",
      "onComplete()",
      "andThenRun()",
    ],
    correctIndex: 1,
    explanation:
      "thenApply() maps the result of a completed future to a new value. The other names do not exist on CompletableFuture.",
  },
  {
    id: "s23",
    level: "senior",
    topic: "Concurrency",
    text: "What happens when a ThreadPoolExecutor has a full queue and all threads busy?",
    options: [
      "The oldest task is silently removed",
      "The queue grows without limit",
      "The rejection policy runs",
      "The caller thread always blocks",
    ],
    correctIndex: 2,
    explanation:
      "The executor hands the new task to its RejectedExecutionHandler. The default policy throws a RejectedExecutionException.",
  },
  {
    id: "s24",
    level: "senior",
    topic: "Concurrency",
    text: "Why is count++ unsafe on a volatile int?",
    options: [
      "volatile fields cannot be incremented",
      "volatile only works for objects",
      "volatile writes are always slower",
      "Read, add and write are separate steps",
    ],
    correctIndex: 3,
    explanation:
      "volatile guarantees visibility but not atomicity. Two threads can read the same value, add one, and both write back the same result.",
  },
  {
    id: "s25",
    level: "senior",
    topic: "Memory model",
    text: "Which choice gives safe visibility of an object's fields after construction?",
    options: [
      "Declaring its fields private",
      "Declaring its fields final",
      "Declaring its fields static",
      "Declaring its fields transient",
    ],
    correctIndex: 1,
    explanation:
      "Final fields get initialization safety: once the constructor finishes, every thread that sees the object also sees their correct values.",
  },
  {
    id: "s26",
    level: "senior",
    topic: "Concurrency",
    text: "What can pin a virtual thread to its carrier thread in Java 21?",
    options: [
      "Calling Thread.sleep()",
      "Blocking inside a synchronized block",
      "Reading from a socket",
      "Waiting on a CompletableFuture with join()",
    ],
    correctIndex: 1,
    explanation:
      "While a virtual thread is blocked inside a synchronized block it cannot unmount, so it keeps its carrier thread busy.",
  },
  {
    id: "s27",
    level: "senior",
    topic: "Concurrency",
    text: "Which approach gives a thread-safe lazy singleton with minimal locking?",
    options: [
      "A public static field set from main",
      "The initialization-on-demand holder",
      "A static counter incremented at start-up",
      "Double-checked locking without volatile",
    ],
    correctIndex: 1,
    explanation:
      "A static nested holder class is initialised by the JVM on first use, which is thread-safe without any explicit locking. Double-checked locking without volatile is broken.",
  },
  {
    id: "s28",
    level: "senior",
    topic: "Design",
    text: "Why is the Singleton pattern often criticised?",
    options: [
      "It is slower than every other pattern",
      "It cannot be created without reflection or serialization",
      "It always needs three classes",
      "It hides global state and hurts testing",
    ],
    correctIndex: 3,
    explanation:
      "A singleton is global mutable state in disguise: code depends on it implicitly, which makes it hard to isolate and test.",
  },
  {
    id: "s29",
    level: "senior",
    topic: "Spring",
    text: "What is dependency injection?",
    options: [
      "The container supplies an object's dependencies",
      "An object creates all its own dependencies",
      "A class inherits them from a parent",
      "Dependencies are copied at compile time",
    ],
    correctIndex: 0,
    explanation:
      "With dependency injection the framework builds the collaborators and passes them in, so a class does not create or look them up itself.",
  },
  {
    id: "s30",
    level: "senior",
    topic: "Spring",
    text: "When do you use @Bean instead of @Component?",
    options: [
      "To scan packages for annotated classes",
      "To declare a bean from a method",
      "To mark a class as a test",
      "To make a bean lazy only",
    ],
    correctIndex: 1,
    explanation:
      "@Bean goes on a method inside a configuration class and registers its return value as a bean, which suits classes you cannot annotate.",
  },
  {
    id: "s31",
    level: "senior",
    topic: "Spring",
    text: "What does @Transactional roll back by default?",
    options: [
      "Every exception, even checked ones",
      "Only checked exceptions",
      "Nothing, you must always call rollback()",
      "Unchecked exceptions and errors",
    ],
    correctIndex: 3,
    explanation:
      "By default a transaction rolls back on RuntimeException and Error. Checked exceptions commit unless you configure rollbackFor.",
  },
  {
    id: "s32",
    level: "senior",
    topic: "Spring",
    text: "Which annotation marks a method to run after dependency injection?",
    options: [
      "@PostConstruct",
      "@AfterInject",
      "@AfterConstruct",
      "@AfterPropertiesSet",
    ],
    correctIndex: 0,
    explanation:
      "@PostConstruct runs once the bean has been constructed and its dependencies injected. afterPropertiesSet() belongs to the InitializingBean interface.",
  },
  {
    id: "s33",
    level: "senior",
    topic: "Spring",
    text: "What does prototype scope mean for a Spring bean?",
    options: [
      "One instance per HTTP session",
      "One instance per application",
      "One instance per thread, always",
      "A new instance per injection",
    ],
    correctIndex: 3,
    explanation:
      "A prototype bean is created anew every time it is requested from the container or injected.",
  },
  {
    id: "s34",
    level: "senior",
    topic: "Spring",
    text: "What are Spring profiles used for?",
    options: [
      "Storing user accounts",
      "Enabling beans per environment",
      "Switching the JVM version per environment",
      "Encrypting property files",
    ],
    correctIndex: 1,
    explanation:
      "Profiles let you register different beans or properties for environments such as dev, test and prod.",
  },
  {
    id: "s35",
    level: "senior",
    topic: "JPA",
    text: "What is the N+1 select problem?",
    options: [
      "A query that returns N+1 duplicate rows",
      "A join that scans every table in the database",
      "One query for parents, then one per child",
      "A lock that waits for N+1 transactions",
    ],
    correctIndex: 2,
    explanation:
      "Loading N parents and then lazily loading each one's children triggers one extra query per parent. Fetch joins or batch fetching avoid it.",
  },
  {
    id: "s36",
    level: "senior",
    topic: "JPA",
    text: "When does lazy loading throw a LazyInitializationException?",
    options: [
      "When the entity has no id",
      "When the table is empty",
      "When the session is already closed",
      "When two entities reference each other",
    ],
    correctIndex: 2,
    explanation:
      "A lazy association is loaded on first access, which needs an open session. Touching it after the session closed throws the exception.",
  },
  {
    id: "s37",
    level: "senior",
    topic: "JPA",
    text: "What is the first-level cache in JPA?",
    options: [
      "A cache shared by all application nodes",
      "A per-session cache of loaded entities",
      "A cache of compiled SQL statements",
      "A disk cache of the database file",
    ],
    correctIndex: 1,
    explanation:
      "The persistence context keeps the entities it has loaded, so asking for the same id twice in one session issues only one query.",
  },
  {
    id: "s38",
    level: "senior",
    topic: "JPA",
    text: "What is the default fetch type of @ManyToOne?",
    options: [
      "LAZY",
      "BATCH",
      "EAGER",
      "NONE",
    ],
    correctIndex: 2,
    explanation:
      "Single-valued associations such as @ManyToOne and @OneToOne are eager by default, while collections are lazy. FetchType only has EAGER and LAZY.",
  },
  {
    id: "s39",
    level: "senior",
    topic: "Modern Java",
    text: "What is a record in modern Java?",
    options: [
      "A mutable class with setters",
      "A checked exception type",
      "A concise immutable data carrier",
      "A class that cannot have any methods at all",
    ],
    correctIndex: 2,
    explanation:
      "A record declares its components once and generates the constructor, accessors, equals, hashCode and toString. It can still define extra methods.",
  },
  {
    id: "s40",
    level: "senior",
    topic: "Modern Java",
    text: "What do sealed classes restrict?",
    options: [
      "Which classes may extend them",
      "Which threads may read them",
      "How many instances can exist",
      "Which packages can import them",
    ],
    correctIndex: 0,
    explanation:
      "A sealed class or interface lists its permitted subclasses, so the compiler knows every possible subtype.",
  },
];
