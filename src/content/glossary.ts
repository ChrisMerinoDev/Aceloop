import type { GlossaryTerm } from "@/lib/types";

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: "big-o-notation",
    term: "Big-O Notation",
    aliases: ["big-o", "big o", "o(n)", "time complexity"],
    definition:
      "Big-O notation describes how an algorithm's cost (time or memory) grows as the input gets larger, ignoring constant factors and small inputs. Saying a function is O(n) means that doubling the input roughly doubles the work, while O(n^2) means doubling the input quadruples it.",
    whyItExists:
      "Raw benchmark numbers depend on hardware, language, and compiler tricks, which makes it impossible to compare algorithms in a portable way. Engineers needed a machine-independent vocabulary to reason about which approach survives when inputs grow from hundreds to millions. Big-O strips away everything except the growth curve, which is what actually dominates at scale.",
    purpose:
      "It gives you a quick, shared language for predicting whether code will stay fast as data grows, before you ever run it.",
    whenToUse:
      "Use it whenever you compare two approaches to the same problem, especially in interviews where stating the complexity of your solution is expected. Reach for it when reviewing code that loops over data: a nested loop over the same collection is a red flag for O(n^2). Do not obsess over it for tiny, fixed-size inputs where constants matter more than growth.",
    relatedTerms: [
      "Time vs Space Complexity",
      "Hash Map",
      "Dynamic Programming",
    ],
    category: "fundamentals",
  },
  {
    id: "time-vs-space-complexity",
    term: "Time vs Space Complexity",
    aliases: ["space complexity"],
    definition:
      "Time complexity measures how long an algorithm takes as input grows, while space complexity measures how much extra memory it needs. They frequently trade off against each other: you can often make code faster by remembering more, or use less memory by recomputing things.",
    whyItExists:
      "Early computers had brutally limited memory, so an algorithm that was fast but memory-hungry could be unusable. As machines evolved, the constraint flipped in many domains, and engineers needed a framework for reasoning about both axes at once. Treating time and space as separate, measurable dimensions makes the trade-off explicit instead of accidental.",
    purpose:
      "It forces you to name what you are spending (CPU cycles versus RAM) so you can choose the trade-off that fits your constraints.",
    whenToUse:
      "Bring it up whenever you optimize: caching a computed value trades space for time, while streaming a file line-by-line trades time for space. In interviews, always state both complexities, because an O(n) time solution using O(n) space is a different answer from O(n) time with O(1) space. On memory-constrained targets like mobile or embedded devices, weigh the space side more heavily.",
    relatedTerms: ["Big-O Notation", "Memoization", "Two Pointers"],
    category: "fundamentals",
  },
  {
    id: "memoization",
    term: "Memoization",
    aliases: ["memoize", "memoized"],
    definition:
      "Memoization is caching the result of a function call so that calling it again with the same inputs returns the stored answer instead of recomputing it. It only works safely for pure functions, where the same inputs always produce the same output.",
    whyItExists:
      "Many algorithms, especially recursive ones, solve the exact same subproblem over and over: naive recursive Fibonacci recomputes fib(3) an exponential number of times. Throwing away answers you already paid for is pure waste, and memoization was the fix. It converts redundant computation into a single lookup, often turning exponential algorithms into linear ones.",
    purpose:
      "It trades memory for speed by ensuring each unique input is computed exactly once.",
    whenToUse:
      "Use it when a pure, expensive function is called repeatedly with the same arguments, such as overlapping subproblems in recursion or derived data in a UI. In React, useMemo and React.memo apply the same idea to skip re-rendering or re-deriving values. Avoid it when inputs rarely repeat or the function is cheap, because the cache bookkeeping then costs more than it saves.",
    relatedTerms: [
      "Dynamic Programming",
      "Recursion",
      "Time vs Space Complexity",
      "Referential Equality",
    ],
    category: "fundamentals",
  },
  {
    id: "closure",
    term: "Closure",
    aliases: ["closures"],
    definition:
      "A closure is a function bundled together with the variables from the scope where it was defined, so it can keep reading and writing those variables even after the outer function has returned. In JavaScript, every function forms a closure over its surrounding scope automatically.",
    whyItExists:
      "Functions in JavaScript are values that get passed around and called later, often long after their defining context has finished running. Without closures, a callback would lose access to the data it was created with, forcing everything through globals or manual argument threading. Closures let a function carry its context with it, enabling callbacks, private state, and function factories.",
    purpose:
      "Closures give functions durable, private access to the environment they were born in, which is the foundation of encapsulation and callbacks in JavaScript.",
    whenToUse:
      "You use closures constantly whether you name them or not: event handlers, setTimeout callbacks, and array method callbacks all close over outer variables. Deliberately reach for them to create private state, like a counter factory or a module that hides internals. Be careful in React, where a stale closure capturing an old state value inside an effect or timer is one of the most common bugs.",
    relatedTerms: ["Memory Leak", "Debounce vs Throttle", "Event Delegation"],
    category: "javascript",
  },
  {
    id: "hoisting",
    term: "Hoisting",
    aliases: [],
    definition:
      "Hoisting is JavaScript's behavior of registering declarations at the top of their scope before any code runs, so names exist earlier than where they are written. Function declarations are hoisted with their bodies, var is hoisted and initialized to undefined, while let and const are hoisted but unusable until their declaration line (the temporal dead zone).",
    whyItExists:
      "JavaScript engines process a scope in two passes: first they scan for declarations, then they execute statements. This two-pass design let early scripts call functions defined lower in the file, which was convenient for small pages with loose structure. The confusing var behavior is a side effect of that design, and let and const were later added to make premature access an error instead of a silent undefined.",
    purpose:
      "Understanding hoisting explains why some code works before its declaration line and why other code throws a ReferenceError, so you can predict scope behavior instead of guessing.",
    whenToUse:
      "In practice, write code as if hoisting did not exist: declare with const or let before use, and you will never be surprised. Knowing it matters when debugging legacy var-heavy code, answering interview questions about the temporal dead zone, or organizing files where helper function declarations sit below the code that calls them, which is safe and often more readable.",
    relatedTerms: ["Closure", "The Event Loop"],
    category: "javascript",
  },
  {
    id: "the-event-loop",
    term: "The Event Loop",
    aliases: ["event loop"],
    definition:
      "The event loop is the mechanism that lets single-threaded JavaScript handle many things at once: it runs one piece of code to completion, then pulls the next queued callback (a timer, a network response, a click) and runs that. Microtasks like resolved promises always run before the next macrotask like setTimeout.",
    whyItExists:
      "JavaScript was designed to run in the browser on a single thread that also paints the UI, so blocking on a slow operation would freeze the entire page. Instead of threads and locks, the language adopted a model where slow work happens elsewhere and completion callbacks queue up to run later. This trades parallelism for a simple guarantee: your code is never interrupted mid-function by other JavaScript.",
    purpose:
      "It lets a single thread stay responsive by interleaving small units of work instead of blocking on any one of them.",
    whenToUse:
      "Understand it whenever async behavior surprises you: why a setTimeout of 0 still runs after all promise callbacks, why a long synchronous loop freezes the page, or why await splits a function across multiple turns of the loop. Use that knowledge to break heavy computation into chunks or move it to a worker, and to predict the exact ordering of mixed promise and timer code in interviews.",
    relatedTerms: ["Debounce vs Throttle", "Race Condition", "Hoisting"],
    category: "javascript",
  },
  {
    id: "debounce-vs-throttle",
    term: "Debounce vs Throttle",
    aliases: ["debounce", "throttle", "debouncing", "throttling"],
    definition:
      "Debounce and throttle are two strategies for taming a function that fires too often. Debounce waits until the events stop for a quiet period and then runs once; throttle runs at most once per fixed interval no matter how many events arrive.",
    whyItExists:
      "Browser events like scroll, resize, mousemove, and keystrokes can fire dozens of times per second, and naively attaching expensive work (API calls, layout reads) to each one melts performance. Developers needed a way to keep listening to every event while doing the expensive part far less often. Debounce and throttle emerged as the two canonical rate-limiting patterns, each matching a different intent.",
    purpose:
      "They decouple how often an event fires from how often your expensive handler actually runs.",
    whenToUse:
      "Choose debounce when only the final state matters: search-as-you-type API calls, form validation after the user stops typing, or resize handlers that should wait for the drag to finish. Choose throttle when you need steady intermediate updates: scroll position tracking, drag-based animations, or analytics pings. Both are built with closures holding a timer, which makes them a favorite interview implementation question.",
    relatedTerms: ["Closure", "The Event Loop", "Race Condition"],
    category: "javascript",
  },
  {
    id: "reconciliation",
    term: "Reconciliation",
    aliases: [],
    definition:
      "Reconciliation is React's process of comparing the new tree of elements your components return against the previous one, and computing the minimal set of real DOM changes needed to match. It walks both trees, reuses nodes whose type and position match, and destroys and recreates subtrees where the type changed.",
    whyItExists:
      "Directly manipulating the DOM is both slow and error-prone: hand-written update code must track every possible state transition. React's model of re-rendering everything from state on every change is simple to write but would be catastrophically slow if it rebuilt the real DOM each time. Reconciliation bridges the gap, letting you write code as if you rebuild the UI from scratch while React applies only the actual differences.",
    purpose:
      "It lets developers describe UI declaratively while React figures out the cheapest way to update the real DOM.",
    whenToUse:
      "You lean on reconciliation implicitly in every React app, but understanding it matters when performance or state bugs appear. Provide stable keys in lists so React can match items across renders instead of tearing them down; an index key on a reorderable list causes exactly this bug. It also explains why swapping an element type resets all state below it, and why memoized children skip re-rendering only when their props are referentially equal.",
    relatedTerms: ["Referential Equality", "Hydration", "Virtualization"],
    category: "react",
  },
  {
    id: "hydration",
    term: "Hydration",
    aliases: ["hydrate", "hydration mismatch"],
    definition:
      "Hydration is the step where React takes server-rendered HTML already sitting in the browser and attaches event listeners and internal state to it, making the static markup interactive. Instead of building new DOM, React walks the existing nodes and adopts them.",
    whyItExists:
      "Purely client-rendered apps ship a blank page and make users wait for JavaScript before seeing anything, which hurts perceived performance and SEO. Server rendering fixes the blank page, but the resulting HTML is inert with no click handlers or state. Hydration was invented to get both: fast-arriving server HTML that a client bundle then brings to life without rebuilding it.",
    purpose:
      "It connects server-rendered markup to client-side React so users see content immediately and get interactivity shortly after.",
    whenToUse:
      "You deal with hydration whenever you use SSR frameworks like Next.js. The key rule: the first client render must produce the same output as the server, so anything that differs between environments (Date.now, random values, window checks, locale formatting) causes a hydration mismatch warning and can produce broken UI. Handle browser-only values by setting them in useEffect after hydration, and remember that heavy pages can look ready but ignore clicks until hydration finishes.",
    relatedTerms: ["Reconciliation", "Code Splitting"],
    category: "react",
  },
  {
    id: "tree-shaking",
    term: "Tree Shaking",
    aliases: ["tree-shaking"],
    definition:
      "Tree shaking is a build-time optimization where the bundler analyzes import and export statements and drops code that nothing actually uses. Import one function from a large utility library, and only that function (plus its dependencies) ships to the browser.",
    whyItExists:
      "As npm culture took hold, apps began depending on huge libraries while using a sliver of each, and users paid for every unused byte in download and parse time. CommonJS requires were too dynamic to analyze safely, so dead code could not be proven dead. ES modules made imports static and analyzable, which finally let bundlers prove that unused exports are unreachable and delete them.",
    purpose:
      "It keeps bundle size proportional to the code you actually use rather than the code you happen to depend on.",
    whenToUse:
      "Mostly you enable it by writing tree-shakeable code: use ES module syntax, prefer named imports (import { debounce } from a library rather than importing the whole thing), and avoid import side effects. Check that libraries you adopt ship ES modules and mark themselves side-effect-free. When a bundle analyzer shows an entire library included for one helper, broken tree shaking is the first suspect.",
    relatedTerms: ["Code Splitting", "Virtualization"],
    category: "performance",
  },
  {
    id: "idempotency",
    term: "Idempotency",
    aliases: ["idempotent"],
    definition:
      "An operation is idempotent if performing it multiple times has the same effect as performing it once. Setting a user's email to a value is idempotent; appending a row or charging a card is not.",
    whyItExists:
      "Networks fail in an ambiguous way: when a request times out, the client cannot know whether the server processed it, so the only safe recovery is to retry. If the operation is not idempotent, retrying risks double charges and duplicate orders; if it is, retrying is always safe. Idempotency became the cornerstone of reliable distributed systems because it converts a dangerous ambiguity into a harmless one.",
    purpose:
      "It makes retries safe, which is essential because retrying is the only realistic response to an ambiguous network failure.",
    whenToUse:
      "Design any externally-called mutation to be idempotent, typically by accepting a client-generated idempotency key and returning the stored result for a repeated key (this is how Stripe's payment API works). Follow HTTP semantics: PUT and DELETE should be idempotent, POST is not assumed to be. Apply the same thinking to message consumers and job handlers, since queues typically guarantee at-least-once delivery, meaning duplicates will happen.",
    relatedTerms: ["Race Condition", "Memoization"],
    category: "architecture",
  },
  {
    id: "memory-leak",
    term: "Memory Leak",
    aliases: ["memory leaks"],
    definition:
      "A memory leak is memory that a program no longer needs but never releases, so usage grows over time until performance degrades or the process crashes. In garbage-collected languages like JavaScript, leaks happen when unwanted objects remain reachable through some forgotten reference, so the collector cannot free them.",
    whyItExists:
      "The concept exists as a named failure mode because long-running programs made it visible: a script that runs for a second can waste memory freely, but a single-page app open for hours or a server running for months cannot. Garbage collection eliminated manual free() bugs but introduced a subtler version: the collector only frees what is unreachable, and code that accidentally keeps references (listeners, caches, closures, globals) silently defeats it.",
    purpose:
      "Naming and understanding leaks lets you find the forgotten references that keep dead objects alive, keeping long-running apps stable.",
    whenToUse:
      "Suspect a leak when an app gets slower the longer it stays open, or a heap snapshot shows memory climbing across sessions of identical activity. The usual JavaScript culprits: event listeners and intervals never cleaned up, caches that only grow, closures capturing large objects, and detached DOM nodes held by a variable. In React, return cleanup functions from useEffect for every subscription and timer; in the DevTools Memory panel, compare snapshots to find what is accumulating.",
    relatedTerms: ["Closure", "Event Delegation", "Virtualization"],
    category: "performance",
  },
  {
    id: "referential-equality",
    term: "Referential Equality",
    aliases: ["reference equality"],
    definition:
      "Referential equality means two variables point at the exact same object in memory, which is what === checks for objects, arrays, and functions. Two objects with identical contents are still not referentially equal, so {} === {} is false.",
    whyItExists:
      "Comparing objects by contents (deep equality) is expensive and ambiguous, so JavaScript made identity the primitive comparison: cheap, constant-time, and unambiguous. Frameworks then built on this: React and most memoization tools ask 'is this the same reference as last time?' because it is the only comparison fast enough to run on every render.",
    purpose:
      "It provides an O(1) answer to 'did this value change?', which is the foundation of change detection in React and memoization everywhere.",
    whenToUse:
      "It matters most in React: creating a new object, array, or arrow function inline on each render produces a new reference every time, which defeats React.memo, retriggers useEffect dependencies, and invalidates useMemo. Stabilize references with useMemo and useCallback when they feed memoized children or dependency arrays. It also explains why state updates must produce new objects rather than mutate: React detects change by reference, so mutation looks like no change at all.",
    relatedTerms: ["Reconciliation", "Memoization", "Hash Map"],
    category: "javascript",
  },
  {
    id: "virtualization",
    term: "Virtualization",
    aliases: ["windowing", "virtualized list"],
    definition:
      "Virtualization (or windowing) renders only the items of a long list that are currently visible in the viewport, plus a small buffer, while faking the full scroll height with spacing. As the user scrolls, items entering the window are mounted and items leaving it are unmounted.",
    whyItExists:
      "The DOM does not scale: rendering ten thousand rows creates ten thousand sets of nodes that all consume memory and slow every layout and style pass, even though the user can only ever see a handful. Pagination avoids this but breaks the fluid scrolling users expect. Virtualization keeps the DOM size constant regardless of list length by exploiting the fact that off-screen items do not need to exist.",
    purpose:
      "It makes rendering cost proportional to what is visible instead of the total data size, keeping huge lists smooth.",
    whenToUse:
      "Reach for it when a list, table, or feed can grow into the hundreds or thousands of rows and scrolling starts to jank; libraries like react-window or TanStack Virtual handle the math. It is not free: browser find-in-page and accessibility can suffer since off-screen content does not exist, and variable-height rows add complexity. For lists under about a hundred simple items, plain rendering is simpler and fast enough.",
    relatedTerms: ["Reconciliation", "Memory Leak", "Code Splitting"],
    category: "performance",
  },
  {
    id: "code-splitting",
    term: "Code Splitting",
    aliases: ["code-splitting", "lazy loading"],
    definition:
      "Code splitting breaks one large JavaScript bundle into smaller chunks that load on demand, so the browser downloads only the code needed for the current page or interaction. Dynamic import() marks the split points, and frameworks like Next.js split by route automatically.",
    whyItExists:
      "As single-page apps grew, shipping the whole application up front meant users downloaded and parsed code for every route and feature just to see the first screen, and startup time grew with total app size. Most of that code is not needed immediately, and some is never needed at all. Code splitting was the answer: decouple initial load time from total application size by deferring code until the moment it is used.",
    purpose:
      "It makes initial load pay only for the current screen, deferring the rest of the app until needed.",
    whenToUse:
      "Split along natural seams: routes first (the highest-value split), then heavy components that are conditionally shown, like modals, chart libraries, and rich text editors. In React, wrap lazy components in Suspense with a sensible fallback, and consider prefetching likely-next chunks on hover or idle to hide the load. Avoid splitting tiny modules, since each chunk adds a network round trip that can cost more than it saves.",
    relatedTerms: ["Tree Shaking", "Hydration", "Virtualization"],
    category: "performance",
  },
  {
    id: "race-condition",
    term: "Race Condition",
    aliases: ["race conditions"],
    definition:
      "A race condition is a bug where the outcome depends on the unpredictable timing or ordering of concurrent operations, so the same code sometimes works and sometimes fails. A classic frontend example: two search requests fire, the older one resolves last, and stale results overwrite fresh ones.",
    whyItExists:
      "The term names a failure mode that is inherent to concurrency: as soon as two operations overlap in time and share state, their interleaving becomes a hidden input to your program. Nobody designed races on purpose; the concept exists because these bugs are timing-dependent, rarely reproduce in testing, and needed a name and a toolbox (locks, atomic operations, cancellation) to be fought systematically.",
    purpose:
      "Recognizing the pattern lets you design timing out of the equation, so correctness does not depend on which operation happens to finish first.",
    whenToUse:
      "Look for races anywhere responses can arrive out of order: autocomplete and search UIs (fix with AbortController or by ignoring stale responses), useEffect fetches racing component unmount, and double-clicked submit buttons firing duplicate mutations. On the backend, read-modify-write sequences on shared data race under load; fix with transactions, atomic operations, or optimistic locking. Any 'works on my machine, fails in production under load' bug should raise this suspicion.",
    relatedTerms: ["Idempotency", "The Event Loop", "Debounce vs Throttle"],
    category: "architecture",
  },
  {
    id: "event-delegation",
    term: "Event Delegation",
    aliases: [],
    definition:
      "Event delegation is attaching a single event listener to a common ancestor instead of one listener per child, using event bubbling to catch events from all descendants and event.target to identify which child was involved. One listener on a list handles clicks for every item, including items added later.",
    whyItExists:
      "Attaching a listener to each of hundreds of elements wastes memory and setup time, and worse, breaks silently for elements added after the listeners were bound, a constant problem in dynamic UIs. Since the DOM already propagates events upward through ancestors, developers realized one ancestor listener could observe everything below it. Delegation turned bubbling from a quirk into the standard pattern for dynamic content.",
    purpose:
      "It handles events for many elements, including future ones, with one listener, reducing memory use and eliminating rebinding bugs.",
    whenToUse:
      "Use it for large or dynamic collections: tables, lists, and menus where rows come and go, attaching one listener to the container and checking event.target.closest to find the relevant item. It is also an interview staple for explaining bubbling versus capturing. Note that React delegates automatically at the root, so hand-rolled delegation matters mainly in vanilla JavaScript; watch out for events like focus and blur that do not bubble.",
    relatedTerms: ["The Event Loop", "Memory Leak", "Closure"],
    category: "javascript",
  },
  {
    id: "hash-map",
    term: "Hash Map",
    aliases: ["hash table", "hashmap", "dictionary"],
    definition:
      "A hash map stores key-value pairs and retrieves any value by key in O(1) average time, by running the key through a hash function that computes where to store it. In JavaScript this is Map (or plain objects for string keys); other languages call it a dictionary or hash table.",
    whyItExists:
      "Finding an item in an unsorted list takes O(n) scanning, and even sorted structures take O(log n); neither is good enough when lookup is the hot operation. The insight was to compute the location from the key itself: hash the key to an array index and jump straight there, resolving occasional collisions locally. That turns search, insert, and delete into constant-time operations on average.",
    purpose:
      "It provides near-instant lookup, insertion, and deletion by key, making it the default answer whenever you need to find things fast.",
    whenToUse:
      "Reach for a hash map any time an algorithm asks 'have I seen this before?' or 'what value goes with this key?': counting frequencies, detecting duplicates, grouping items, or caching results. It is the single most common way to trade O(n) space for dropping a nested loop, turning O(n^2) into O(n), as in the classic Two Sum problem. Prefer Map over plain objects when keys are not strings or when you need reliable iteration and size.",
    relatedTerms: ["Big-O Notation", "Memoization", "Referential Equality"],
    category: "fundamentals",
  },
  {
    id: "recursion",
    term: "Recursion",
    aliases: ["recursive"],
    definition:
      "Recursion is a technique where a function solves a problem by calling itself on smaller pieces of that problem, stopping at a base case simple enough to answer directly. Each call waits on its sub-calls, and the answers combine as the calls unwind.",
    whyItExists:
      "Many structures are self-similar: a directory contains directories, a tree node has child trees, and a JSON object nests objects. Iterative code for these requires manually managing a stack of pending work, which is exactly what the language's call stack already does. Recursion exists to let the code's shape mirror the data's shape, making self-similar problems dramatically simpler to express.",
    purpose:
      "It reduces a big problem to smaller copies of itself, letting the call stack manage the bookkeeping that an explicit stack would otherwise require.",
    whenToUse:
      "Use it for naturally nested data (trees, graphs, nested objects) and for divide-and-conquer algorithms like merge sort and binary search variants. Always define the base case first, and confirm every recursive call moves toward it, or you will overflow the stack. For very deep inputs, JavaScript's limited call stack can force a rewrite to iteration with an explicit stack; and when sub-calls repeat the same inputs, add memoization.",
    relatedTerms: ["Memoization", "Dynamic Programming", "Big-O Notation"],
    category: "fundamentals",
  },
  {
    id: "dynamic-programming",
    term: "Dynamic Programming",
    aliases: ["dp"],
    definition:
      "Dynamic programming solves complex problems by breaking them into overlapping subproblems, solving each subproblem once, and storing the results for reuse. It comes in two styles: top-down (recursion plus memoization) and bottom-up (filling a table from the smallest cases upward).",
    whyItExists:
      "Some problems have naive recursive solutions that take exponential time purely because they solve identical subproblems astronomically many times; Fibonacci and edit distance are classic examples. Richard Bellman formalized the fix in the 1950s for optimization problems: if a problem has overlapping subproblems and optimal answers built from optimal sub-answers, storing each result once collapses exponential work to polynomial.",
    purpose:
      "It turns exponential brute-force recursion into polynomial time by guaranteeing every distinct subproblem is computed exactly once.",
    whenToUse:
      "Suspect DP when a problem asks for a count of ways, a minimum or maximum over choices, or a yes/no over combinations, and a brute-force recursion would branch at every step: climbing stairs, coin change, longest common subsequence, knapsack. The workflow: write the recursive relation, identify what parameters define a subproblem, memoize, and optionally convert to a bottom-up table. If subproblems never repeat, DP adds nothing; plain recursion or a greedy approach may suffice.",
    relatedTerms: [
      "Memoization",
      "Recursion",
      "Time vs Space Complexity",
      "Big-O Notation",
    ],
    category: "fundamentals",
  },
  {
    id: "two-pointers",
    term: "Two Pointers",
    aliases: ["two-pointer"],
    definition:
      "Two pointers is a pattern that walks two indices through a sequence, most often starting from both ends and moving inward, or moving at different speeds. By deciding which pointer to advance based on the current values, you examine the array in a single pass instead of checking every pair.",
    whyItExists:
      "Many array problems seem to require comparing all pairs of elements, an O(n^2) proposition. When the data has structure, typically being sorted, checking every pair is wasteful: the comparison at the current pair tells you which pointer's movement could possibly help, so entire regions of pairs can be skipped safely. The pattern crystallized as a reusable way to exploit that ordering.",
    purpose:
      "It replaces nested loops with a single coordinated pass, cutting O(n^2) pair-checking down to O(n) with O(1) extra space.",
    whenToUse:
      "Use it on sorted arrays for pair-sum problems (converging pointers: too small, move left pointer right; too big, move right pointer left), for in-place operations like reversing or removing duplicates (reader and writer pointers), and for palindrome checks. The fast and slow variant detects cycles in linked lists. If the array is unsorted and sorting is too costly, a hash map is usually the alternative tool for pair problems.",
    relatedTerms: ["Sliding Window", "Hash Map", "Big-O Notation"],
    category: "fundamentals",
  },
  {
    id: "sliding-window",
    term: "Sliding Window",
    aliases: ["sliding-window"],
    definition:
      "Sliding window maintains a contiguous range over a sequence, expanding one end and shrinking the other as it moves, while incrementally updating a running answer (a sum, a count, a character map). Windows can be fixed-size or grow and shrink to satisfy a condition.",
    whyItExists:
      "Problems about the best contiguous subarray or substring naively require re-examining every possible range, and recomputing each range from scratch is O(n^2) or worse. But adjacent windows overlap almost entirely: sliding by one only adds one element and removes one. The pattern exists to exploit that overlap, updating the previous answer in O(1) instead of rebuilding it.",
    purpose:
      "It computes answers over all contiguous ranges in one pass by reusing the work of the previous window instead of recomputing.",
    whenToUse:
      "Reach for it when the problem says contiguous: maximum sum of k consecutive elements (fixed window), longest substring without repeating characters, or smallest subarray meeting a sum (variable window, expand right until valid, shrink left while it stays valid). Pair the window with a hash map of counts when tracking characters or frequencies. It does not apply when the answer can be non-contiguous; that territory usually belongs to dynamic programming.",
    relatedTerms: ["Two Pointers", "Hash Map", "Dynamic Programming"],
    category: "fundamentals",
  },
];
