import type { Question } from "@/lib/types";

export const dsaQuestions: Question[] = [
  // ─────────────────────────────── LEVEL 1 ───────────────────────────────
  {
    slug: "two-sum",
    title: "Two Sum",
    category: "dsa",
    difficulty: "easy",
    level: 1,
    pattern: "Hash Map",
    tags: ["array", "hash-map"],
    timeLimitSeconds: 900,
    editorType: "monaco",
    functionName: "twoSum",
    promptMd: `## Two Sum

Given an array of integers *nums* and an integer *target*, return the **indices** of the two numbers that add up to *target*.

You may assume each input has **exactly one solution**, and you may not use the same element twice. Return the answer with the smaller index first.

### Example 1

~~~
Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9
~~~

### Example 2

~~~
Input:  nums = [3, 2, 4], target = 6
Output: [1, 2]
Explanation: nums[1] + nums[2] = 2 + 4 = 6
~~~

### Example 3

~~~
Input:  nums = [3, 3], target = 6
Output: [0, 1]
~~~

### Constraints

- 2 <= nums.length <= 10^4
- -10^9 <= nums[i], target <= 10^9
- Exactly one valid answer exists.

**Follow-up:** can you do it in a single pass, in O(n) time?`,
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]} indices of the two numbers, smaller index first
 */
function twoSum(nums, target) {
  // your code
}`,
    solutionCode: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    solutionMd: `## Optimal: one-pass hash map — O(n)

Walk the array once. For each element, ask: *what number would complete the pair?* That is need = target - nums[i]. If we have already seen that number, we are done. Otherwise, record the current number and its index in a map and keep going.

~~~js
function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}
~~~

Because we check the map **before** inserting the current element, we can never accidentally pair an element with itself, and duplicates like [3, 3] work naturally: the first 3 is in the map by the time we reach the second.

- **Time:** O(n) — one pass, O(1) average per map operation.
- **Space:** O(n) for the map.`,
    lessonMd: `**Intuition.** The problem asks for a *pair* with a fixed sum. Every pair-with-property problem invites the same first question: for a given element, what exactly is its required partner? Here the partner is fully determined: it must equal target - nums[i]. So the real task is not "search all pairs" — it is "for each element, look up one specific value fast."

**Brute force.** Two nested loops: for each i, scan every j > i and test nums[i] + nums[j] === target. That is O(n^2) time and O(1) space. For n = 10^4 that is ~50 million comparisons — workable but wasteful, and it fails larger inputs.

**Optimization steps.** The inner loop is doing a *membership query*: "does value v exist somewhere to my right (or left)?" Any time a linear scan answers a membership question, replace it with a hash structure. Step 1: put every value → index in a Map (one pass). Step 2: for each i, look up target - nums[i] in O(1). You can even fuse the two passes: check the map first, then insert the current element. The one-pass version also elegantly dodges the "don't reuse the same element" trap, because the current element is never in the map when we query.

**Why the optimal works.** When we stand at index i and the partner was seen earlier, the map returns it instantly. If the partner appears *later*, we will find the current element in the map when we eventually stand on the partner. Every valid pair has a "second" element, so the pair is always detected exactly when we visit that second element.

**Complexity.** Time O(n): each element is processed once with O(1) average hash operations. Space O(n): the map can hold up to n entries.

**Common pitfalls.**
- Inserting into the map *before* checking, which lets an element pair with itself when target is exactly twice its value.
- Returning values instead of indices.
- Sorting first destroys the original indices — if you sort, you must remember the original positions.

**The transferable pattern: Hash Map complement lookup.** Whenever a nested loop exists only to *find* something (a complement, a duplicate, a previous occurrence), a hash map converts the O(n) inner search into an O(1) lookup, dropping the whole algorithm from O(n^2) to O(n). You will reuse this exact move in Contains Duplicate, Valid Anagram, Group Anagrams, and dozens of interview problems.`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], hidden: false, label: "classic pair at front" },
      { input: [[3, 2, 4], 6], expected: [1, 2], hidden: false, label: "pair not at start" },
      { input: [[3, 3], 6], expected: [0, 1], hidden: false, label: "duplicate values" },
      { input: [[1, 2, 3, 4], 7], expected: [2, 3], hidden: true, label: "pair at end" },
      { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], hidden: true, label: "all negatives" },
      { input: [[0, 4, 3, 0], 0], expected: [0, 3], hidden: true, label: "zeros as the pair" },
      { input: [[5, 75, 25], 100], expected: [1, 2], hidden: true, label: "larger values" },
      { input: [[1, 6], 7], expected: [0, 1], hidden: true, label: "minimum length array" },
      { input: [[-3, 4, 3, 90], 0], expected: [0, 2], hidden: true, label: "negative plus positive" },
      { input: [[2, 5, 5, 11], 10], expected: [1, 2], hidden: true, label: "duplicate mid-array" },
    ],
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    category: "dsa",
    difficulty: "easy",
    level: 1,
    pattern: "Stack",
    tags: ["stack", "string"],
    timeLimitSeconds: 900,
    editorType: "monaco",
    functionName: "isValid",
    promptMd: `## Valid Parentheses

Given a string *s* containing only the characters ( ) [ ] { }, determine if the input string is **valid**.

A string is valid when:

1. Open brackets are closed by the **same type** of bracket.
2. Open brackets are closed in the **correct order**.
3. Every close bracket has a corresponding open bracket.

An empty string is considered valid.

### Example 1

~~~
Input:  s = "()"
Output: true
~~~

### Example 2

~~~
Input:  s = "()[]{}"
Output: true
~~~

### Example 3

~~~
Input:  s = "([)]"
Output: false
Explanation: the ( is closed by ) while [ is still open — wrong order.
~~~

### Constraints

- 0 <= s.length <= 10^4
- s consists only of the characters ( ) [ ] { }`,
    starterCode: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // your code
}`,
    solutionCode: `function isValid(s) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else if (stack.pop() !== pairs[ch]) {
      return false;
    }
  }
  return stack.length === 0;
}`,
    solutionMd: `## Optimal: stack — O(n)

Push every opening bracket. When a closing bracket arrives, the *most recently opened* bracket must be its partner — exactly what a stack's pop gives you.

~~~js
function isValid(s) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else if (stack.pop() !== pairs[ch]) {
      return false;
    }
  }
  return stack.length === 0;
}
~~~

Two failure modes are both handled: a closer with no matching opener (pop on an empty array returns undefined, which never equals an opener), and leftover openers at the end (final length check).

- **Time:** O(n) — one pass.
- **Space:** O(n) worst case (all openers).`,
    lessonMd: `**Intuition.** Brackets nest. The bracket that must close *next* is always the one that opened *most recently* — a last-in-first-out relationship. Whenever "most recent unfinished thing" governs correctness, a stack is the natural data structure.

**Brute force.** Repeatedly scan the string and delete adjacent matched pairs like () or [] until nothing changes; valid iff the string becomes empty. Each sweep is O(n) and you may need O(n) sweeps: O(n^2) time. It works, but it re-reads the same characters over and over.

**Optimization steps.** Notice what the repeated-deletion process is really doing: a closing bracket always annihilates the nearest unmatched opener to its left. Instead of physically deleting, *remember* unmatched openers in a stack. Each character is then touched exactly once: openers get pushed; closers pop and compare. A small lookup table mapping each closer to its expected opener keeps the comparison to one line instead of three if-chains.

**Why the optimal works.** Invariant: at any point, the stack holds exactly the currently-unclosed openers, innermost on top. A closer is legal iff it matches the top. If it matches, that pair is resolved and the invariant is restored. If it does not match (or the stack is empty), no future characters can repair the violation — order is already broken — so returning false immediately is safe. At the end, an empty stack means every opener found its closer.

**Complexity.** Time O(n): each character is pushed and popped at most once. Space O(n): a string of all openers like ((((( fills the stack.

**Common pitfalls.**
- Forgetting the final stack.length === 0 check — "(((" would wrongly pass.
- Not handling a closer arriving on an empty stack — ")(" or "]" must fail, not crash. In JS, pop() on an empty array returns undefined, and undefined !== "(" handles it for free, but only if you compare rather than blindly index.
- Only counting brackets: counters cannot catch "([)]" because counts balance while order is wrong.

**The transferable pattern: Stack for most-recent-open context.** Any "properly nested" structure — HTML tags, expression parsing, undo histories, DFS call frames, matching quotes — reduces to pushing context when something opens and popping to validate when it closes. Recognizing "the answer depends on the most recent unresolved item" is the trigger to reach for a stack.`,
    testCases: [
      { input: ["()"], expected: true, hidden: false, label: "single pair" },
      { input: ["()[]{}"], expected: true, hidden: false, label: "three siblings" },
      { input: ["(]"], expected: false, hidden: false, label: "wrong closer type" },
      { input: ["([)]"], expected: false, hidden: true, label: "interleaved (wrong order)" },
      { input: ["{[]}"], expected: true, hidden: true, label: "nested pairs" },
      { input: [""], expected: true, hidden: true, label: "empty string" },
      { input: ["("], expected: false, hidden: true, label: "lone opener" },
      { input: ["]"], expected: false, hidden: true, label: "lone closer" },
      { input: ["(("], expected: false, hidden: true, label: "unclosed openers" },
      { input: ["(())"], expected: true, hidden: true, label: "deep nesting" },
      { input: ["){"], expected: false, hidden: true, label: "closer before opener" },
    ],
  },
  {
    slug: "reverse-string",
    title: "Reverse String",
    category: "dsa",
    difficulty: "easy",
    level: 1,
    pattern: "Two Pointers",
    tags: ["string", "two-pointers"],
    timeLimitSeconds: 900,
    editorType: "monaco",
    functionName: "reverseString",
    promptMd: `## Reverse String

Given a string *s*, return a new string with the characters in **reverse order**.

Do it the interview way: treat the string as an array of characters and swap ends with **two pointers**, rather than calling a built-in reverse.

### Example 1

~~~
Input:  s = "hello"
Output: "olleh"
~~~

### Example 2

~~~
Input:  s = "Hannah"
Output: "hannaH"
~~~

### Example 3

~~~
Input:  s = ""
Output: ""
~~~

### Constraints

- 0 <= s.length <= 10^5
- s consists of printable ASCII characters.`,
    starterCode: `/**
 * @param {string} s
 * @return {string} the reversed string
 */
function reverseString(s) {
  // your code
}`,
    solutionCode: `function reverseString(s) {
  const chars = s.split("");
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    const tmp = chars[left];
    chars[left] = chars[right];
    chars[right] = tmp;
    left++;
    right--;
  }
  return chars.join("");
}`,
    solutionMd: `## Optimal: two pointers — O(n)

Strings are immutable in JavaScript, so split into a character array, swap symmetric positions moving two pointers toward each other, then join.

~~~js
function reverseString(s) {
  const chars = s.split("");
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    const tmp = chars[left];
    chars[left] = chars[right];
    chars[right] = tmp;
    left++;
    right--;
  }
  return chars.join("");
}
~~~

The loop condition left < right stops correctly for both even lengths (pointers cross) and odd lengths (pointers meet on the middle character, which needs no swap).

- **Time:** O(n).
- **Space:** O(n) for the char array (O(1) extra if the input were already a mutable array).`,
    lessonMd: `**Intuition.** Reversal is a symmetry: character 0 trades places with character n-1, character 1 with n-2, and so on. That phrasing immediately suggests walking inward from both ends simultaneously — the classic two-pointer sweep.

**Brute force.** Build the result by prepending: for each character, do result = ch + result. Each prepend copies the whole accumulated string (strings are immutable), so total work is 1 + 2 + ... + n = O(n^2). Easy to write, quadratic to run — a classic hidden-cost trap.

**Optimization steps.** First improvement: iterate from the end and *append* into an array, then join — O(n). The interview-standard refinement is the in-place mindset: convert to a char array, keep a left pointer at 0 and a right pointer at the last index, swap, and move both inward until they meet. Same O(n) time, but it demonstrates you can mutate in place with O(1) extra space when the input is already an array — which is exactly how LeetCode poses this problem.

**Why the optimal works.** After k iterations, the outermost k characters on each side are in final position, and the untouched middle section is exactly what remains to reverse — the same subproblem, smaller. The loop condition left < right ends things at the right moment: with an odd length, the middle character faces itself and correctly stays put; with an even length, the pointers cross after the last needed swap.

**Complexity.** Time O(n): n/2 swaps plus the split/join passes. Space O(n) in JavaScript because strings are immutable and we need the char array; the swapping itself uses O(1) extra memory.

**Common pitfalls.**
- Using left <= right — harmless here (the middle swaps with itself) but sloppy, and in problems where the pointers must not overlap it becomes a real bug.
- Forgetting JS strings are immutable and trying s[i] = x, which silently does nothing.
- The += prepend approach passing small tests but timing out on large inputs.
- Off-by-one on right: it starts at length - 1, not length.

**The transferable pattern: Two Pointers (converging).** Two indices starting at opposite ends and moving toward each other, doing O(1) work per step, solve a surprising range of problems: palindrome checks, Container With Most Water, 2-sum on a sorted array, Dutch-flag partitioning, and Trapping Rain Water later in this game. Whenever the answer involves symmetric positions or shrinking a window from both ends, think converging pointers.`,
    testCases: [
      { input: ["hello"], expected: "olleh", hidden: false, label: "odd length" },
      { input: ["Hannah"], expected: "hannaH", hidden: false, label: "mixed case, even length" },
      { input: [""], expected: "", hidden: true, label: "empty string" },
      { input: ["a"], expected: "a", hidden: true, label: "single character" },
      { input: ["ab"], expected: "ba", hidden: true, label: "two characters" },
      { input: ["racecar"], expected: "racecar", hidden: true, label: "palindrome" },
      { input: ["12345"], expected: "54321", hidden: true, label: "digits" },
      { input: ["a b"], expected: "b a", hidden: true, label: "contains space" },
      { input: ["AbC"], expected: "CbA", hidden: true, label: "case preserved" },
    ],
  },
  {
    slug: "fizz-buzz-pro",
    title: "FizzBuzz Pro",
    category: "dsa",
    difficulty: "easy",
    level: 1,
    pattern: "Arrays",
    tags: ["math", "simulation"],
    timeLimitSeconds: 900,
    editorType: "monaco",
    functionName: "fizzBuzz",
    promptMd: `## FizzBuzz Pro

Given an integer *n*, return a string array *answer* (1-indexed) of length *n* where:

- answer[i] = "FizzBuzz" if i is divisible by 3 **and** 5
- answer[i] = "Fizz" if i is divisible by 3 only
- answer[i] = "Buzz" if i is divisible by 5 only
- answer[i] = the number i as a string otherwise

If n is 0, return an empty array.

### Example 1

~~~
Input:  n = 3
Output: ["1", "2", "Fizz"]
~~~

### Example 2

~~~
Input:  n = 5
Output: ["1", "2", "Fizz", "4", "Buzz"]
~~~

### Example 3

~~~
Input:  n = 15
Output: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
~~~

### Constraints

- 0 <= n <= 10^4`,
    starterCode: `/**
 * @param {number} n
 * @return {string[]}
 */
function fizzBuzz(n) {
  // your code
}`,
    solutionCode: `function fizzBuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push("FizzBuzz");
    else if (i % 3 === 0) out.push("Fizz");
    else if (i % 5 === 0) out.push("Buzz");
    else out.push(String(i));
  }
  return out;
}`,
    solutionMd: `## Solution: single pass with ordered checks — O(n)

The only trap in FizzBuzz is check order: the "divisible by both" case must be tested **first**, otherwise the divisible-by-3 branch swallows every multiple of 15.

~~~js
function fizzBuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push("FizzBuzz");
    else if (i % 3 === 0) out.push("Fizz");
    else if (i % 5 === 0) out.push("Buzz");
    else out.push(String(i));
  }
  return out;
}
~~~

Testing i % 15 is equivalent to i % 3 === 0 && i % 5 === 0 because 3 and 5 are coprime, so their least common multiple is 15.

- **Time:** O(n).
- **Space:** O(n) for the output (O(1) auxiliary).`,
    lessonMd: `**Intuition.** This is a pure mapping problem: each number 1..n maps independently to one of four strings based on divisibility. There is nothing to search or optimize across elements — the whole game is expressing overlapping conditions in the right precedence order.

**Brute force.** There is no meaningfully slower approach; a single loop is already the algorithm. The "brute force vs optimal" axis here is about *code structure*: four independent if statements (buggy — a multiple of 15 would push three entries), string concatenation tricks, or a clean if/else-if chain. The naive four-independent-ifs version is the classic first bug.

**Optimization steps.** Step 1: recognize that the conditions overlap — divisible by 15 implies divisible by 3 and by 5 — so branches must be mutually exclusive, checked from most specific to least specific. Step 2: since gcd(3, 5) = 1, "divisible by both" collapses to i % 15 === 0, one check instead of two. An elegant alternative that scales to more rules: build the word by concatenation — start with an empty string, append "Fizz" if i % 3 === 0, append "Buzz" if i % 5 === 0, and fall back to String(i) if still empty. That version needs no combined case at all and extends gracefully if an interviewer adds "Jazz for multiples of 7."

**Why the optimal works.** With mutually exclusive ordered branches, exactly one push happens per number, and the most specific rule wins — matching the specification precisely. The concatenation variant works because the combined word "FizzBuzz" is literally the two words in order.

**Complexity.** Time O(n) — constant work per number. Space O(n) for the required output array; auxiliary space is O(1).

**Common pitfalls.**
- Checking % 3 before % 15, so 15 prints "Fizz" instead of "FizzBuzz".
- Pushing the number itself instead of String(i) — the expected output is an array of strings, and a deep-equal comparison will fail on 4 vs "4".
- Looping from 0 or to n-1; FizzBuzz is 1-indexed and inclusive of n.
- Not handling n = 0 (should return [] — a loop that never runs does this for free).

**The transferable pattern: ordered condition mapping.** When output rules overlap, order branches from most specific to most general, or compose the answer additively. This shows up in real code constantly: HTTP route matching, CSS specificity, pattern matching, validation pipelines. FizzBuzz is trivial; the discipline of "make overlapping cases mutually exclusive, most specific first" is not.`,
    testCases: [
      { input: [3], expected: ["1", "2", "Fizz"], hidden: false, label: "first fizz" },
      { input: [5], expected: ["1", "2", "Fizz", "4", "Buzz"], hidden: false, label: "first buzz" },
      { input: [15], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"], hidden: false, label: "first fizzbuzz" },
      { input: [1], expected: ["1"], hidden: true, label: "n = 1" },
      { input: [0], expected: [], hidden: true, label: "n = 0 (empty)" },
      { input: [2], expected: ["1", "2"], hidden: true, label: "no fizz yet" },
      { input: [6], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz"], hidden: true, label: "two fizzes" },
      { input: [10], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz"], hidden: true, label: "two buzzes" },
    ],
  },
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    category: "dsa",
    difficulty: "easy",
    level: 1,
    pattern: "Hash Map",
    tags: ["array", "hash-set"],
    timeLimitSeconds: 900,
    editorType: "monaco",
    functionName: "containsDuplicate",
    promptMd: `## Contains Duplicate

Given an integer array *nums*, return true if any value appears **at least twice**, and false if every element is distinct.

### Example 1

~~~
Input:  nums = [1, 2, 3, 1]
Output: true
Explanation: 1 appears at indices 0 and 3.
~~~

### Example 2

~~~
Input:  nums = [1, 2, 3, 4]
Output: false
~~~

### Example 3

~~~
Input:  nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]
Output: true
~~~

### Constraints

- 0 <= nums.length <= 10^5
- -10^9 <= nums[i] <= 10^9`,
    starterCode: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function containsDuplicate(nums) {
  // your code
}`,
    solutionCode: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}`,
    solutionMd: `## Optimal: hash set — O(n)

Track everything seen so far in a Set. The moment a value repeats, we know the answer — return early.

~~~js
function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}
~~~

A tidy one-liner alternative — new Set(nums).size !== nums.length — is also O(n) but always processes the whole array; the loop version short-circuits on the first duplicate.

- **Time:** O(n) average.
- **Space:** O(n) for the set.`,
    lessonMd: `**Intuition.** A duplicate exists exactly when some element has *already been seen* by the time we reach it. So scan left to right, maintaining a memory of everything seen so far, and ask one question per element: "have I seen you before?" The only decision is what data structure makes that question fast.

**Brute force.** Compare every pair: nested loops checking nums[i] === nums[j] for j > i. O(n^2) time, O(1) space. At n = 10^5 that is ~5 billion comparisons — far too slow.

**Optimization steps.** Middle ground: sort first. Duplicates become neighbors, so one linear scan comparing adjacent elements finds them — O(n log n) time, and it mutates or copies the input. The final step: the inner question is pure *membership*, and hash sets answer membership in O(1) average. One pass, check-then-insert, return true immediately on a hit. This is the same "replace search with lookup" move as Two Sum, in its purest form.

**Why the optimal works.** Loop invariant: before processing index i, the set contains exactly the distinct values of nums[0..i-1]. If nums[i] is in the set, a previous index held the same value — a duplicate, proven. If we finish the loop, every element was absent from the set at its turn, meaning all values are pairwise distinct. Early return is safe because one duplicate is all the problem asks about.

**Complexity.** Time O(n) average (hash operations are O(1) amortized). Space O(n) worst case — all elements distinct means the set grows to size n. The sorting approach trades that memory for O(n log n) time; mentioning the tradeoff is exactly what interviewers want to hear.

**Common pitfalls.**
- Adding to the set before checking — with check-after-insert you must compare sizes instead, which is easy to fumble.
- Using an object as the set: numeric keys become strings, which happens to work for integers but breaks the moment values are mixed types; Set has no such coercion.
- Forgetting the empty array and single-element cases — both are trivially false, and the loop handles them naturally, but your tests should prove it.

**The transferable pattern: Hash Set for seen-before queries.** "Have I encountered this before?" powers cycle detection (Linked List Cycle, Happy Number), de-duplication, visited-tracking in graph traversal (you will use it in Number of Islands), and sliding-window uniqueness checks. Whenever your algorithm's history matters only as a membership question, a set gives you that history at O(1) per query.`,
    testCases: [
      { input: [[1, 2, 3, 1]], expected: true, hidden: false, label: "duplicate at ends" },
      { input: [[1, 2, 3, 4]], expected: false, hidden: false, label: "all distinct" },
      { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true, hidden: false, label: "many duplicates" },
      { input: [[]], expected: false, hidden: true, label: "empty array" },
      { input: [[1]], expected: false, hidden: true, label: "single element" },
      { input: [[-1, -1]], expected: true, hidden: true, label: "negative duplicate" },
      { input: [[0, 0]], expected: true, hidden: true, label: "zeros" },
      { input: [[1000000, 999999, 1000000]], expected: true, hidden: true, label: "large values" },
      { input: [[3, 7, 2, 9]], expected: false, hidden: true, label: "distinct unsorted" },
    ],
  },
  // ─────────────────────────────── LEVEL 2 ───────────────────────────────
  {
    slug: "binary-search",
    title: "Binary Search",
    category: "dsa",
    difficulty: "easy",
    level: 2,
    pattern: "Binary Search",
    tags: ["array", "binary-search"],
    timeLimitSeconds: 900,
    editorType: "monaco",
    functionName: "search",
    promptMd: `## Binary Search

Given a **sorted** (ascending) array of distinct integers *nums* and an integer *target*, return the index of *target* if it exists, or -1 otherwise.

Your algorithm must run in **O(log n)** time.

### Example 1

~~~
Input:  nums = [-1, 0, 3, 5, 9, 12], target = 9
Output: 4
~~~

### Example 2

~~~
Input:  nums = [-1, 0, 3, 5, 9, 12], target = 2
Output: -1
~~~

### Example 3

~~~
Input:  nums = [5], target = 5
Output: 0
~~~

### Constraints

- 0 <= nums.length <= 10^4
- All values are unique and sorted ascending.
- -10^4 <= nums[i], target <= 10^4`,
    starterCode: `/**
 * @param {number[]} nums  sorted ascending, distinct
 * @param {number} target
 * @return {number} index of target, or -1
 */
function search(nums, target) {
  // your code
}`,
    solutionCode: `function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    solutionMd: `## Optimal: classic binary search — O(log n)

Maintain an inclusive search window [lo, hi] that is guaranteed to contain the target if it exists. Compare the middle element and discard the half that cannot contain the target.

~~~js
function search(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
~~~

Key details: the loop runs while lo <= hi (inclusive bounds), and both updates skip past mid (mid + 1 / mid - 1), which guarantees the window shrinks every iteration — no infinite loops.

- **Time:** O(log n) — the window halves each step.
- **Space:** O(1).`,
    lessonMd: `**Intuition.** Sorted order is information. If the middle element is smaller than the target, then *everything* to its left is also smaller — the entire left half is eliminated by one comparison. Repeating that halving finds the target in logarithmic time, the same reason you can find a word in a physical dictionary in seconds.

**Brute force.** Linear scan: check each element until found — O(n). Correct, and even optimal for *unsorted* data, but it ignores the one precondition the problem hands you. The problem explicitly demands O(log n), which is the interviewer saying "use the sortedness."

**Optimization steps.** Define an inclusive window [lo, hi] where the target must live if present. Step 1: probe the middle, mid = floor((lo + hi) / 2). Step 2: three-way compare — equal means done; nums[mid] < target means the answer can only be right of mid, so lo = mid + 1; otherwise hi = mid - 1. Step 3: loop while lo <= hi; if the window empties, the target is absent. Every detail earns its keep: inclusive bounds pair with lo <= hi, and the ±1 updates ensure strict progress.

**Why the optimal works.** Invariant: if target exists in nums, its index is always within [lo, hi]. Each comparison preserves the invariant while discarding roughly half the window — the discarded half provably cannot contain the target because the array is sorted. Since the window shrinks by at least one each iteration (mid is always excluded from the next window), termination is guaranteed; after k steps the window has at most n / 2^k elements, so at most ~log2(n) + 1 iterations run.

**Complexity.** Time O(log n). Space O(1) iterative (a recursive version costs O(log n) stack).

**Common pitfalls.**
- while (lo < hi) with inclusive bounds silently skips single-element windows — the classic missed-last-element bug.
- lo = mid or hi = mid (without the ±1) can loop forever on two-element windows.
- In fixed-width languages, lo + hi can overflow; the safe form is lo + (hi - lo) / 2. JS numbers make this a non-issue here, but say it out loud in interviews.
- Off-by-one on the initial hi: it is length - 1 for inclusive bounds.

**The transferable pattern: Binary Search on a monotonic predicate.** The deep version of this pattern is not "find a value in a sorted array" — it is "find the boundary where a monotonic condition flips." That generalization solves first/last occurrence, search in rotated arrays, Koko Eating Bananas, and "minimum capacity to ship packages" style problems: if you can phrase a yes/no question whose answers look like NNNNYYYY over the search space, binary search finds the flip point in O(log n) probes.`,
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, hidden: false, label: "target in right half" },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, hidden: false, label: "target absent" },
      { input: [[5], 5], expected: 0, hidden: false, label: "single element hit" },
      { input: [[5], -5], expected: -1, hidden: true, label: "single element miss" },
      { input: [[], 3], expected: -1, hidden: true, label: "empty array" },
      { input: [[1, 2, 3, 4, 5], 1], expected: 0, hidden: true, label: "first element" },
      { input: [[1, 2, 3, 4, 5], 5], expected: 4, hidden: true, label: "last element" },
      { input: [[1, 3, 5, 7, 9, 11], 7], expected: 3, hidden: true, label: "even-length array" },
      { input: [[2, 4], 4], expected: 1, hidden: true, label: "two elements" },
      { input: [[-10, -3, 0, 8], -3], expected: 1, hidden: true, label: "negative target" },
    ],
  },
  {
    slug: "merge-sorted-arrays",
    title: "Merge Sorted Arrays",
    category: "dsa",
    difficulty: "easy",
    level: 2,
    pattern: "Two Pointers",
    tags: ["array", "two-pointers", "sorting"],
    timeLimitSeconds: 900,
    editorType: "monaco",
    functionName: "mergeSorted",
    promptMd: `## Merge Sorted Arrays

Given two integer arrays *a* and *b*, each sorted in **ascending** order, return a single new array containing all elements of both, in ascending order.

Do not simply concatenate and sort — merge them in **linear time** using two pointers, the same way merge sort combines halves.

### Example 1

~~~
Input:  a = [1, 2, 4], b = [1, 3, 4]
Output: [1, 1, 2, 3, 4, 4]
~~~

### Example 2

~~~
Input:  a = [], b = [0]
Output: [0]
~~~

### Example 3

~~~
Input:  a = [4, 5, 6], b = [1, 2, 3]
Output: [1, 2, 3, 4, 5, 6]
~~~

### Constraints

- 0 <= a.length, b.length <= 10^5
- Both inputs are sorted ascending; duplicates may appear within and across arrays.`,
    starterCode: `/**
 * @param {number[]} a  sorted ascending
 * @param {number[]} b  sorted ascending
 * @return {number[]} merged sorted array
 */
function mergeSorted(a, b) {
  // your code
}`,
    solutionCode: `function mergeSorted(a, b) {
  const out = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      out.push(a[i]);
      i++;
    } else {
      out.push(b[j]);
      j++;
    }
  }
  while (i < a.length) {
    out.push(a[i]);
    i++;
  }
  while (j < b.length) {
    out.push(b[j]);
    j++;
  }
  return out;
}`,
    solutionMd: `## Optimal: two-pointer merge — O(n + m)

Keep one pointer per array. Repeatedly take the smaller front element, then drain whichever array has leftovers.

~~~js
function mergeSorted(a, b) {
  const out = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      out.push(a[i]);
      i++;
    } else {
      out.push(b[j]);
      j++;
    }
  }
  while (i < a.length) {
    out.push(a[i]);
    i++;
  }
  while (j < b.length) {
    out.push(b[j]);
    j++;
  }
  return out;
}
~~~

Using <= (not <) when comparing keeps the merge **stable**: ties take from *a* first.

- **Time:** O(n + m) — each element is examined once.
- **Space:** O(n + m) for the output.`,
    lessonMd: `**Intuition.** Both arrays are already sorted, so at any moment the smallest *remaining* element overall must be at the front of one of the two arrays — there are only two candidates. Compare the two fronts, take the smaller, repeat. Sorted inputs reduce a global question ("what comes next?") to a two-way comparison.

**Brute force.** Concatenate and sort: [...a, ...b].sort((x, y) => x - y). Correct in one line, but O((n+m) log(n+m)) — it throws away the fact that the inputs are already sorted and re-derives order from scratch. Interviewers ask this problem precisely to see whether you exploit given structure.

**Optimization steps.** Step 1: maintain index i into a and j into b; the merged output is built by repeatedly appending the smaller of a[i] and b[j] and advancing that pointer only. Step 2: when either array is exhausted, the other's remaining elements are all larger than everything emitted so far *and* already sorted among themselves — append them wholesale with a drain loop. Step 3 (polish): break ties with <= so equal elements from a go first, making the merge stable — irrelevant for plain numbers, essential when merging records by key.

**Why the optimal works.** Invariant: out is sorted and contains exactly the elements a[0..i-1] and b[0..j-1]; furthermore every element in out is <= both a[i] and b[j]. Appending the smaller front preserves both claims: it is >= the last emitted element (by the invariant) and <= everything still unconsumed (fronts are minima of sorted remainders). Induction carries this to completion, so the final array is fully sorted.

**Complexity.** Time O(n + m): each iteration permanently consumes one element and there are n + m elements. Space O(n + m) for the result; auxiliary space is O(1).

**Common pitfalls.**
- Forgetting the drain loops — [1, 2, 3] merged with [10] would drop the tail.
- Advancing *both* pointers on a tie, which silently drops duplicates ([1,1] + [1] must produce three 1s).
- Using shift() to consume fronts: shift is O(n) in JS arrays, quietly degrading the merge to O(n^2). Use indices.
- Comparator-free .sort() in the brute force sorts lexicographically — [10, 2, 1] territory.

**The transferable pattern: Two Pointers (parallel merge).** One pointer per sorted sequence, always consuming the smallest front, is the engine inside merge sort, external sorting of files too big for memory, merging K sorted lists (with a heap picking among K fronts), interval-list intersections, and database merge joins. Whenever multiple sorted streams must combine into one sorted stream, this is the move.`,
    testCases: [
      { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4], hidden: false, label: "interleaved with ties" },
      { input: [[], [0]], expected: [0], hidden: false, label: "first array empty" },
      { input: [[4, 5, 6], [1, 2, 3]], expected: [1, 2, 3, 4, 5, 6], hidden: false, label: "b entirely first" },
      { input: [[], []], expected: [], hidden: true, label: "both empty" },
      { input: [[1], []], expected: [1], hidden: true, label: "second array empty" },
      { input: [[1, 2, 3], [4, 5, 6]], expected: [1, 2, 3, 4, 5, 6], hidden: true, label: "a entirely first" },
      { input: [[-5, 0, 5], [-10, 10]], expected: [-10, -5, 0, 5, 10], hidden: true, label: "negatives" },
      { input: [[1, 1, 1], [1, 1]], expected: [1, 1, 1, 1, 1], hidden: true, label: "all duplicates" },
      { input: [[2], [1, 3]], expected: [1, 2, 3], hidden: true, label: "single vs pair" },
    ],
  },
  {
    slug: "best-time-to-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    category: "dsa",
    difficulty: "easy",
    level: 2,
    pattern: "Greedy",
    tags: ["array", "greedy", "dynamic-programming"],
    timeLimitSeconds: 900,
    editorType: "monaco",
    functionName: "maxProfit",
    promptMd: `## Best Time to Buy and Sell Stock

You are given an array *prices* where prices[i] is the price of a stock on day i.

You want to maximize profit by choosing **one day to buy** and a **later day to sell**. Return the maximum profit achievable. If no profitable transaction exists, return 0.

### Example 1

~~~
Input:  prices = [7, 1, 5, 3, 6, 4]
Output: 5
Explanation: buy on day 1 (price 1), sell on day 4 (price 6). Profit = 6 - 1 = 5.
Note that buying at 7 and selling at 1 is not allowed — you must buy before you sell.
~~~

### Example 2

~~~
Input:  prices = [7, 6, 4, 3, 1]
Output: 0
Explanation: prices only fall; doing nothing is best.
~~~

### Example 3

~~~
Input:  prices = [2, 1, 4]
Output: 3
~~~

### Constraints

- 0 <= prices.length <= 10^5
- 0 <= prices[i] <= 10^4`,
    starterCode: `/**
 * @param {number[]} prices
 * @return {number} maximum profit (0 if none)
 */
function maxProfit(prices) {
  // your code
}`,
    solutionCode: `function maxProfit(prices) {
  let minPrice = Infinity;
  let best = 0;
  for (const p of prices) {
    if (p < minPrice) {
      minPrice = p;
    } else if (p - minPrice > best) {
      best = p - minPrice;
    }
  }
  return best;
}`,
    solutionMd: `## Optimal: one pass, track the minimum so far — O(n)

For each day, the best possible sale on that day uses the **cheapest price seen before it**. So sweep once, carrying two values: the minimum price so far and the best profit so far.

~~~js
function maxProfit(prices) {
  let minPrice = Infinity;
  let best = 0;
  for (const p of prices) {
    if (p < minPrice) {
      minPrice = p;
    } else if (p - minPrice > best) {
      best = p - minPrice;
    }
  }
  return best;
}
~~~

A new low can never itself be a profitable sell day (profit would be negative), which is why the two updates can live in an if/else.

- **Time:** O(n).
- **Space:** O(1).`,
    lessonMd: `**Intuition.** A transaction is a (buy day, sell day) pair with buy before sell. Fix the sell day: the best partner is obviously the *lowest price before it*. If we sweep left to right while remembering the running minimum, every day can evaluate its best possible profit in O(1).

**Brute force.** Try every pair: for each buy day i, for each sell day j > i, compute prices[j] - prices[i] and keep the max. O(n^2) time. At n = 10^5, that is ~5 billion operations — a guaranteed timeout, and a guaranteed follow-up question in interviews.

**Optimization steps.** The inner loop recomputes something with massive overlap: "the minimum of prices[0..j-1]" barely changes as j advances — it can only decrease when a new low appears. So hoist it into a running variable. Step 1: carry minPrice = cheapest price seen so far. Step 2: for each new price, either it is a new low (update minPrice) or it is a potential sell (candidate profit p - minPrice; update best if larger). One pass, two variables. This is simultaneously a greedy algorithm and a collapsed DP: best[i] = max(best[i-1], prices[i] - min[i-1]) with both arrays squeezed into scalars.

**Why the optimal works.** For every sell day j, at the moment we process j, minPrice equals the true minimum of all earlier prices — so the candidate profit computed at j is the best achievable with sell day j. Taking the max of those candidates over all j covers every legal transaction exactly once. The buy-before-sell constraint is enforced structurally: minPrice only ever contains prices from strictly earlier iterations or the current new low (which yields profit 0, never wrongly counted).

**Complexity.** Time O(n), one pass. Space O(1) — two scalars.

**Common pitfalls.**
- Answering max(prices) - min(prices): wrong when the max comes *before* the min (e.g. [7, 1] — answer is 0, not 6). Order matters; this is the whole problem.
- Returning a negative number when prices only fall — the floor is 0 (skip the transaction).
- Updating best before minPrice with a same-day buy-sell of 0 confusing the logic; the if/else structure sidesteps it.
- Empty or single-day input must return 0 (no complete transaction possible).

**The transferable pattern: running extreme (prefix min/max).** Sweeping while maintaining a running best-so-far converts "for each position, the best partner among everything before me" from O(n) per position to O(1). The same skeleton powers Maximum Subarray (Kadane), water trapping variants, and any problem of the shape "best pair where the left element wants to be extreme."`,
    testCases: [
      { input: [[7, 1, 5, 3, 6, 4]], expected: 5, hidden: false, label: "classic case" },
      { input: [[7, 6, 4, 3, 1]], expected: 0, hidden: false, label: "strictly falling" },
      { input: [[2, 1, 4]], expected: 3, hidden: false, label: "low after start" },
      { input: [[1, 2]], expected: 1, hidden: true, label: "two days rising" },
      { input: [[]], expected: 0, hidden: true, label: "empty array" },
      { input: [[5]], expected: 0, hidden: true, label: "single day" },
      { input: [[3, 3, 3]], expected: 0, hidden: true, label: "flat prices" },
      { input: [[2, 4, 1, 7]], expected: 6, hidden: true, label: "better buy later" },
      { input: [[1, 2, 3, 4, 5]], expected: 4, hidden: true, label: "strictly rising" },
      { input: [[9, 1, 9]], expected: 8, hidden: true, label: "high before the low" },
    ],
  },
  {
    slug: "valid-anagram",
    title: "Valid Anagram",
    category: "dsa",
    difficulty: "easy",
    level: 2,
    pattern: "Hash Map",
    tags: ["string", "hash-map", "counting"],
    timeLimitSeconds: 900,
    editorType: "monaco",
    functionName: "isAnagram",
    promptMd: `## Valid Anagram

Given two strings *s* and *t*, return true if *t* is an **anagram** of *s* — that is, *t* uses exactly the same characters as *s* with exactly the same frequencies, in any order.

### Example 1

~~~
Input:  s = "anagram", t = "nagaram"
Output: true
~~~

### Example 2

~~~
Input:  s = "rat", t = "car"
Output: false
~~~

### Example 3

~~~
Input:  s = "aacc", t = "ccac"
Output: false
Explanation: same length and same character set, but "aacc" has two a's while "ccac" has only one.
~~~

### Constraints

- 0 <= s.length, t.length <= 5 * 10^4
- s and t consist of lowercase English letters.`,
    starterCode: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
function isAnagram(s, t) {
  // your code
}`,
    solutionCode: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Map();
  for (const ch of s) {
    count.set(ch, (count.get(ch) || 0) + 1);
  }
  for (const ch of t) {
    const c = count.get(ch);
    if (!c) return false;
    count.set(ch, c - 1);
  }
  return true;
}`,
    solutionMd: `## Optimal: frequency counting — O(n)

Anagram means identical character multiset. Count characters of *s* up, then count characters of *t* down; any counter that would go negative (or a missing character) means "not an anagram."

~~~js
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Map();
  for (const ch of s) {
    count.set(ch, (count.get(ch) || 0) + 1);
  }
  for (const ch of t) {
    const c = count.get(ch);
    if (!c) return false;
    count.set(ch, c - 1);
  }
  return true;
}
~~~

The length guard is what lets a single map suffice: with equal lengths, "no counter goes negative" already implies "every counter ends at zero."

- **Time:** O(n).
- **Space:** O(k) where k is the alphabet size — effectively O(1) for lowercase letters.`,
    lessonMd: `**Intuition.** Order is irrelevant to anagrams — only *how many of each character* matters. So the real object being compared is not two strings but two frequency tables (multisets). Two strings are anagrams iff their tables are identical.

**Brute force.** Generate every permutation of s and check whether any equals t. O(n!) — hopeless beyond a dozen characters, but worth naming because it clarifies what we are avoiding: we never need to *arrange* characters, only *count* them.

**Optimization steps.** Step 1 (good): sort both strings and compare — anagrams sort to the identical string. O(n log n), three lines, a perfectly respectable interview answer. Step 2 (better): skip the arranging entirely. Build a count map from s in one pass. Then walk t decrementing; if a character is missing or its count is already zero, fail immediately. Add the O(1) length check up front: unequal lengths can never be anagrams, and with equal lengths a single decrementing pass is a complete proof — no second "verify all zeros" sweep needed. For a fixed lowercase alphabet, an array of 26 counters indexed by character code is an even leaner variant of the same idea.

**Why the optimal works.** After counting s, the map states exactly how many of each character t must supply. Each character of t consumes one unit. If t ever demands a character s cannot supply, the multisets differ — fail. If t finishes without failing, it consumed |t| units total from a pool of |s| units, and since |s| = |t|, the pool is exactly emptied: every count is zero, so the tables match perfectly.

**Complexity.** Time O(n) — two linear passes. Space O(k) for k distinct characters, bounded by the alphabet (26 here), so effectively constant.

**Common pitfalls.**
- Skipping the length check and only testing "no counter goes negative" — then s = "aab", t = "aa" would wrongly pass. The length guard is load-bearing.
- Checking only that both strings share the same character *set* — "aacc" vs "ccac" shows counts matter, not just membership.
- if (!c) doing double duty is intentional: it catches both undefined (never seen) and 0 (exhausted); if that feels too clever, write the two checks explicitly.

**The transferable pattern: frequency counting (Hash Map as multiset).** Reducing "same up to rearrangement" to "same counts" underlies Group Anagrams (counts as a grouping key), permutation-in-string sliding windows, ransom-note problems, and Top K Frequent Elements. When order does not matter, do not compare sequences — compare histograms.`,
    testCases: [
      { input: ["anagram", "nagaram"], expected: true, hidden: false, label: "classic anagram" },
      { input: ["rat", "car"], expected: false, hidden: false, label: "different letters" },
      { input: ["aacc", "ccac"], expected: false, hidden: false, label: "same letters, wrong counts" },
      { input: ["a", "a"], expected: true, hidden: true, label: "single identical char" },
      { input: ["a", "b"], expected: false, hidden: true, label: "single different char" },
      { input: ["ab", "a"], expected: false, hidden: true, label: "different lengths" },
      { input: ["", ""], expected: true, hidden: true, label: "both empty" },
      { input: ["listen", "silent"], expected: true, hidden: true, label: "listen/silent" },
      { input: ["aabb", "abab"], expected: true, hidden: true, label: "repeated pairs" },
      { input: ["ab", "ba"], expected: true, hidden: true, label: "simple swap" },
    ],
  },
  // ─────────────────────────────── LEVEL 3 ───────────────────────────────
  {
    slug: "max-subarray",
    title: "Maximum Subarray",
    category: "dsa",
    difficulty: "medium",
    level: 3,
    pattern: "Dynamic Programming",
    tags: ["array", "dynamic-programming", "kadane"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "maxSubArray",
    promptMd: `## Maximum Subarray

Given an integer array *nums*, find the **contiguous subarray** (containing at least one number) with the largest sum, and return that sum.

### Example 1

~~~
Input:  nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
Output: 6
Explanation: the subarray [4, -1, 2, 1] has the largest sum, 6.
~~~

### Example 2

~~~
Input:  nums = [1]
Output: 1
~~~

### Example 3

~~~
Input:  nums = [5, 4, -1, 7, 8]
Output: 23
Explanation: the whole array is best.
~~~

### Constraints

- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4

**Follow-up:** solve it in O(n) with O(1) extra space (Kadane's algorithm).`,
    starterCode: `/**
 * @param {number[]} nums
 * @return {number} the maximum subarray sum
 */
function maxSubArray(nums) {
  // your code
}`,
    solutionCode: `function maxSubArray(nums) {
  let best = nums[0];
  let current = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}`,
    solutionMd: `## Optimal: Kadane's algorithm — O(n)

Sweep once, tracking *current* = the best sum of a subarray **ending exactly at this index**. At each element, either extend the previous best run or abandon it and start fresh — whichever is larger.

~~~js
function maxSubArray(nums) {
  let best = nums[0];
  let current = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}
~~~

The recurrence current = max(nums[i], current + nums[i]) says: a negative running sum is dead weight — dragging it forward can only hurt, so restart. best records the peak of current across the sweep.

- **Time:** O(n).
- **Space:** O(1).`,
    lessonMd: `**Intuition.** Every subarray *ends* somewhere. If, for each index i, we knew the best sum among subarrays ending exactly at i, the global answer would just be the max of those n values. And that per-index quantity has a beautiful recursive structure: the best subarray ending at i either extends the best one ending at i-1, or starts fresh at i — nothing else is possible.

**Brute force.** Enumerate all O(n^2) subarrays; with a running sum per start index that is O(n^2) time (O(n^3) if you naively re-sum each subarray). At n = 10^5, quadratic is billions of operations — too slow. A divide-and-conquer split (best-left, best-right, best-crossing) achieves O(n log n) and is a nice mention, but Kadane beats it.

**Optimization steps.** Define endingHere[i] = max sum of a subarray ending at i. Recurrence: endingHere[i] = max(nums[i], endingHere[i-1] + nums[i]) — extend or restart. That is a one-dimensional DP, and since each entry depends only on the previous one, the whole array collapses to a single scalar, current. Track the running maximum in best. Two variables, one pass — that collapse from "table" to "two scalars" is the signature Kadane move.

**Why the optimal works.** The case split is exhaustive: a maximal subarray ending at i either has length 1 (start fresh) or length > 1 (its prefix is a subarray ending at i-1, and it must be the *best* such one, else swapping in the better prefix improves the total — a cut-and-paste argument). Equivalently and more intuitively: carrying a negative running sum into the next element can only lower it, so the moment current goes negative, restarting is optimal. Since every subarray ends at some index, max over all current values covers every candidate.

**Complexity.** Time O(n), single pass, two comparisons per element. Space O(1).

**Common pitfalls.**
- Initializing best to 0 instead of nums[0] — an all-negative array like [-3, -1, -2] must return -1, not 0. The subarray must be non-empty.
- Confusing "restart when current < 0" with "restart when nums[i] < 0" — negative *elements* are fine to keep if the running sum stays positive.
- Returning the subarray indices question unprepared: interviewers often extend to "return the actual subarray"; track a start index that resets whenever you restart.

**The transferable pattern: DP on "best ending here."** Parameterizing by "best structure ending at position i" and reducing to extend-or-restart appears in Best Time to Buy/Sell Stock, Maximum Product Subarray (track max *and* min because negatives flip), Longest Increasing Run, and House Robber's cousin problems. When a problem says "contiguous" and "maximum," think Kadane before anything fancier.`,
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, hidden: false, label: "classic mixed signs" },
      { input: [[1]], expected: 1, hidden: false, label: "single element" },
      { input: [[5, 4, -1, 7, 8]], expected: 23, hidden: false, label: "whole array wins" },
      { input: [[-1]], expected: -1, hidden: true, label: "single negative" },
      { input: [[-2, -1]], expected: -1, hidden: true, label: "two negatives" },
      { input: [[-5, -3, -8]], expected: -3, hidden: true, label: "all negatives" },
      { input: [[1, 2, 3]], expected: 6, hidden: true, label: "all positives" },
      { input: [[8, -19, 5, -4, 20]], expected: 21, hidden: true, label: "restart mid-array" },
      { input: [[0, 0, 0]], expected: 0, hidden: true, label: "all zeros" },
      { input: [[3, -2, 5, -1]], expected: 6, hidden: true, label: "keep small dips" },
    ],
  },
  {
    slug: "group-anagrams",
    title: "Group Anagrams",
    category: "dsa",
    difficulty: "medium",
    level: 3,
    pattern: "Hash Map",
    tags: ["string", "hash-map", "sorting"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "groupAnagrams",
    resultOrder: "any",
    promptMd: `## Group Anagrams

Given an array of strings *strs*, group the **anagrams** together. Return the groups as an array of arrays. You may return the groups (and the strings within each group) in **any order**.

### Example 1

~~~
Input:  strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [["eat","tea","ate"], ["tan","nat"], ["bat"]]
~~~

### Example 2

~~~
Input:  strs = [""]
Output: [[""]]
~~~

### Example 3

~~~
Input:  strs = ["a"]
Output: [["a"]]
~~~

### Constraints

- 0 <= strs.length <= 10^4
- 0 <= strs[i].length <= 100
- strs[i] consists of lowercase English letters.`,
    starterCode: `/**
 * @param {string[]} strs
 * @return {string[][]} anagram groups, any order
 */
function groupAnagrams(strs) {
  // your code
}`,
    solutionCode: `function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const key = s.split("").sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return Array.from(groups.values());
}`,
    solutionMd: `## Optimal: canonical key + hash map — O(n · k log k)

Two strings are anagrams iff they are equal *after sorting their characters*. That sorted form is a **canonical key**: use it to bucket strings in a map.

~~~js
function groupAnagrams(strs) {
  const groups = new Map();
  for (const s of strs) {
    const key = s.split("").sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return Array.from(groups.values());
}
~~~

For n strings of length up to k: sorting each key costs O(k log k), so the total is O(n · k log k). An O(n · k) refinement builds the key from a 26-slot character-count signature (e.g. "1a0b2c...") instead of sorting.

- **Time:** O(n · k log k) (or O(n · k) with count keys).
- **Space:** O(n · k) for the buckets.`,
    lessonMd: `**Intuition.** "Group things that are equivalent" is a bucketing problem. The hard part is that anagram-equivalence is not plain string equality — "eat" and "tea" look different. The unlock: find a **canonical form** that is *identical exactly for equivalent items*. For anagrams, sorting the characters does it: every anagram of "eat" sorts to "aet". Once equivalence becomes equality, a hash map does the grouping for free.

**Brute force.** For each string, compare it against every existing group's representative with an isAnagram check (O(k) with counting). That is O(n^2 · k) pairwise comparisons in the worst case — 10^8+ character operations at the given constraints. The waste: we keep re-answering "are these two equivalent?" instead of assigning each string a fingerprint once.

**Optimization steps.** Step 1: canonicalize each string once — sortedForm = chars sorted and rejoined — O(k log k) per string. Step 2: map from canonical key → array of original strings; append each string to its bucket. Step 3: emit the map's values. To shave the log factor, replace sorting with a frequency signature: count the 26 letters and build a key like "1#0#2#..." (delimiters matter — without them, counts like 1,12 and 11,2 can collide). That is O(k) per string and the same map machinery.

**Why the optimal works.** Correctness reduces to one biconditional: canonical(a) === canonical(b) iff a and b are anagrams. Sorting is order-insensitive and preserves multiplicity, so equal multisets sort identically; conversely, identical sorted forms are literally the same multiset. Therefore each bucket contains exactly one full anagram class — no false merges, no split classes.

**Complexity.** Time O(n · k log k) with sorted keys, O(n · k) with count keys. Space O(n · k): every input string is stored in some bucket, plus keys.

**Common pitfalls.**
- Concatenating counts without a delimiter, creating ambiguous keys.
- Using summed character codes or products as the key — collisions abound ("ad" and "bc" share a sum).
- Forgetting that the empty string is a valid input forming its own group.
- Assuming output order matters — it does not here, but read the harness rules; this question compares with order-insensitive (canonicalized) equality.

**The transferable pattern: canonicalization + Hash Map bucketing.** Reduce an equivalence relation to string equality via a canonical representative, then bucket. The same trick groups points by normalized slope (Max Points on a Line), deduplicates permutations, detects isomorphic strings via structural encodings, and shows up in real systems as normalization before hashing (URLs, JSON, file paths). If you can canonicalize, you can group in linear passes.`,
    testCases: [
      { input: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]], hidden: false, label: "classic three groups" },
      { input: [[""]], expected: [[""]], hidden: false, label: "single empty string" },
      { input: [["a"]], expected: [["a"]], hidden: false, label: "single char" },
      { input: [["ab", "ba", "abc"]], expected: [["ab", "ba"], ["abc"]], hidden: true, label: "prefix non-anagram" },
      { input: [[]], expected: [], hidden: true, label: "empty input" },
      { input: [["abc", "bca", "cab", "xyz"]], expected: [["abc", "bca", "cab"], ["xyz"]], hidden: true, label: "one big group plus loner" },
      { input: [["aa", "bb", "aa"]], expected: [["aa", "aa"], ["bb"]], hidden: true, label: "duplicate strings" },
      { input: [["cat", "tac", "act", "dog", "god"]], expected: [["cat", "tac", "act"], ["dog", "god"]], hidden: true, label: "two groups" },
    ],
  },
  {
    slug: "longest-substring-no-repeat",
    title: "Longest Substring Without Repeating Characters",
    category: "dsa",
    difficulty: "medium",
    level: 3,
    pattern: "Sliding Window",
    tags: ["string", "sliding-window", "hash-map"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "lengthOfLongestSubstring",
    promptMd: `## Longest Substring Without Repeating Characters

Given a string *s*, find the length of the **longest substring** (contiguous) that contains no repeating characters.

### Example 1

~~~
Input:  s = "abcabcbb"
Output: 3
Explanation: the answer is "abc", length 3.
~~~

### Example 2

~~~
Input:  s = "bbbbb"
Output: 1
~~~

### Example 3

~~~
Input:  s = "pwwkew"
Output: 3
Explanation: the answer is "wke". Note "pwke" is a subsequence, not a substring.
~~~

### Constraints

- 0 <= s.length <= 5 * 10^4
- s consists of printable ASCII characters.`,
    starterCode: `/**
 * @param {string} s
 * @return {number} length of the longest substring with all unique chars
 */
function lengthOfLongestSubstring(s) {
  // your code
}`,
    solutionCode: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let start = 0;
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= start) {
      start = lastSeen.get(ch) + 1;
    }
    lastSeen.set(ch, i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}`,
    solutionMd: `## Optimal: sliding window with last-seen jump — O(n)

Maintain a window [start, i] that always contains unique characters. When s[i] was already seen **inside the window**, jump start directly past its previous occurrence.

~~~js
function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let start = 0;
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= start) {
      start = lastSeen.get(ch) + 1;
    }
    lastSeen.set(ch, i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}
~~~

The guard lastSeen.get(ch) >= start is critical: an occurrence *before* the current window is stale and must not shrink the window (test "abba" catches this).

- **Time:** O(n) — each index visited once; start only moves forward.
- **Space:** O(min(n, alphabet)) for the map.`,
    lessonMd: `**Intuition.** We want the longest *contiguous* stretch with all-unique characters. Uniqueness has a monotone flavor: if a window has a repeat, every larger window containing it also has a repeat; if a window is clean, all its sub-windows are clean. That monotonicity is the green light for a sliding window: grow the right edge greedily, and move the left edge only as far as needed to restore validity.

**Brute force.** Check every substring for uniqueness: O(n^2) substrings times O(n) to verify = O(n^3), improvable to O(n^2) by extending each start until the first repeat. At n = 5·10^4, quadratic (~2.5 billion steps) still times out. The waste: adjacent windows share almost all their characters, yet we re-scan from scratch.

**Optimization steps.** Step 1 (two pointers + set): keep a window in a Set; on a duplicate at i, remove characters from the left until the duplicate disappears. Each character enters and leaves the window at most once — amortized O(n). Step 2 (last-seen jump): instead of shuffling the left edge one step at a time, store each character's most recent index. When s[i] repeats *inside* the window, teleport start to lastSeen + 1 in one assignment. Same asymptotics, tighter constant, and one subtle guard: ignore occurrences left of start — they are outside the window and stale.

**Why the optimal works.** Invariant: [start, i] never contains a repeat. When s[i] collides with a previous in-window occurrence at index p, every valid window ending at i must begin after p — so start = p + 1 is the *largest* valid window ending at i, not just *a* valid one. Because we record the best window at every i, and every optimal substring ends at some index, the maximum is found. start never moves backward, which is both the correctness guard and the linear-time argument.

**Complexity.** Time O(n): one forward pass, O(1) map work per character. Space O(min(n, alphabet size)).

**Common pitfalls.**
- Missing the >= start guard: on "abba", the final "a" would drag start backward to 1, wrongly counting "ba...a". Expected answer is 2.
- Computing length as i - start (off by one); it is i - start + 1.
- Solving for sub*sequences* — "pwwkew" answering 4 ("pwke") means you ignored contiguity.
- Forgetting the empty string returns 0.

**The transferable pattern: Sliding Window (variable size).** When a problem asks for the longest/shortest *contiguous* run satisfying a constraint that is monotone under shrinking, run two pointers: advance the right edge, restore validity by advancing the left, record candidates. The same engine solves Minimum Window Substring, Longest Repeating Character Replacement, Fruit Into Baskets, and subarray-sum problems with positive numbers.`,
    testCases: [
      { input: ["abcabcbb"], expected: 3, hidden: false, label: "classic abc" },
      { input: ["bbbbb"], expected: 1, hidden: false, label: "all same char" },
      { input: ["pwwkew"], expected: 3, hidden: false, label: "repeat mid-string" },
      { input: [""], expected: 0, hidden: true, label: "empty string" },
      { input: ["a"], expected: 1, hidden: true, label: "single char" },
      { input: ["au"], expected: 2, hidden: true, label: "two unique" },
      { input: ["dvdf"], expected: 3, hidden: true, label: "jump start correctly" },
      { input: ["abba"], expected: 2, hidden: true, label: "stale last-seen trap" },
      { input: ["tmmzuxt"], expected: 5, hidden: true, label: "reuse char left of window" },
      { input: ["aab"], expected: 2, hidden: true, label: "repeat at front" },
    ],
  },
  {
    slug: "product-except-self",
    title: "Product of Array Except Self",
    category: "dsa",
    difficulty: "medium",
    level: 3,
    pattern: "Arrays",
    tags: ["array", "prefix-product"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "productExceptSelf",
    promptMd: `## Product of Array Except Self

Given an integer array *nums*, return an array *answer* such that answer[i] equals the product of **all elements of nums except nums[i]**.

You must solve it in **O(n)** time **without using division**.

### Example 1

~~~
Input:  nums = [1, 2, 3, 4]
Output: [24, 12, 8, 6]
~~~

### Example 2

~~~
Input:  nums = [-1, 1, 0, -3, 3]
Output: [0, 0, 9, 0, 0]
~~~

### Example 3

~~~
Input:  nums = [2, 3]
Output: [3, 2]
~~~

### Constraints

- 1 <= nums.length <= 10^5
- -30 <= nums[i] <= 30
- The product of any prefix or suffix fits in a standard number.

**Follow-up:** can you do it with O(1) extra space (output array not counted)?`,
    starterCode: `/**
 * @param {number[]} nums
 * @return {number[]} products of all elements except self
 */
function productExceptSelf(nums) {
  // your code
}`,
    solutionCode: `function productExceptSelf(nums) {
  const n = nums.length;
  const out = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    out[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    out[i] *= suffix;
    suffix *= nums[i];
  }
  return out;
}`,
    solutionMd: `## Optimal: prefix × suffix sweeps — O(n), no division

The product of everything except index i is (product of everything left of i) × (product of everything right of i). Compute both with two sweeps, folding them into the output array.

~~~js
function productExceptSelf(nums) {
  const n = nums.length;
  const out = new Array(n).fill(1);
  let prefix = 1;
  for (let i = 0; i < n; i++) {
    out[i] = prefix;      // product of nums[0..i-1]
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    out[i] *= suffix;     // multiply by product of nums[i+1..]
    suffix *= nums[i];
  }
  return out;
}
~~~

After the first pass, out[i] holds the left product; the second pass multiplies in the right product using a single running scalar — that is the O(1) extra space trick.

- **Time:** O(n) — two passes.
- **Space:** O(1) auxiliary (output array excluded).`,
    lessonMd: `**Intuition.** "Everything except me" splits cleanly at *me*: the elements before i and the elements after i. So answer[i] = leftProduct(i) × rightProduct(i). Both families of values have overlapping structure — leftProduct(i+1) is just leftProduct(i) × nums[i] — which screams *prefix computation*: build them incrementally instead of from scratch.

**Brute force.** For each i, loop over the whole array skipping i and multiply: O(n^2). At n = 10^5 that is 10^10 multiplications — hopeless. The obvious "fix," dividing the total product by nums[i], is explicitly banned and genuinely broken: one zero in the array makes the total product 0 and division meaningless, and two zeros break even the careful zero-counting workaround's elegance.

**Optimization steps.** Step 1: precompute two arrays — pre[i] = product of nums[0..i-1] (with pre[0] = 1) and suf[i] = product of nums[i+1..] (with suf[n-1] = 1). Each fills in one pass by extending the previous entry. Then answer[i] = pre[i] × suf[i]. O(n) time, O(n) extra space. Step 2 (space squeeze): the suffix array is consumed strictly right-to-left, one value per index — so it never needs to exist as an array. Write the prefix products into the output first, then sweep from the right multiplying by a running suffix scalar. Two passes, one output array, two scalars.

**Why the optimal works.** The empty product is 1 — that is why the boundaries initialize to 1 and why a single-element array correctly yields [1]. By induction, after pass one out[i] is exactly the product of all elements strictly left of i; the running suffix at step i of pass two is exactly the product of all elements strictly right of i. Their product multiplies every element except nums[i] exactly once. Zeros need no special-casing: they simply propagate through the prefixes and suffixes correctly.

**Complexity.** Time O(n). Auxiliary space O(1) beyond the required output.

**Common pitfalls.**
- Using division — fails on zeros and fails the interview constraint.
- Initializing boundary products to 0 instead of 1 (the empty product), zeroing everything.
- Multiplying nums[i] itself into the wrong side — prefix must update *after* writing out[i]; suffix likewise.
- Believing the "two zeros" case needs handling — the sweep handles it (everything becomes 0) automatically; test [0, 0] to convince yourself.

**The transferable pattern: prefix/suffix precomputation.** When each position needs an aggregate over "everything to my left" and "everything to my right," compute running aggregates from each end. The identical skeleton solves Trapping Rain Water (max-from-left/right), candy distribution, "best split point" problems, and range-sum queries via prefix sums. Aggregates that compose incrementally (sum, product, max, min) are all fair game.`,
    testCases: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], hidden: false, label: "classic ascending" },
      { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0], hidden: false, label: "contains one zero" },
      { input: [[2, 3]], expected: [3, 2], hidden: false, label: "two elements" },
      { input: [[1, 1, 1]], expected: [1, 1, 1], hidden: true, label: "all ones" },
      { input: [[0, 0]], expected: [0, 0], hidden: true, label: "two zeros" },
      { input: [[5]], expected: [1], hidden: true, label: "single element (empty product)" },
      { input: [[2, 4, 6]], expected: [24, 12, 8], hidden: true, label: "even numbers" },
      { input: [[-1, -2, -3]], expected: [6, 3, 2], hidden: true, label: "all negatives" },
      { input: [[1, 0]], expected: [0, 1], hidden: true, label: "zero at the end" },
    ],
  },
  // ─────────────────────────────── LEVEL 4 ───────────────────────────────
  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    category: "dsa",
    difficulty: "medium",
    level: 4,
    pattern: "Greedy",
    tags: ["array", "sorting", "intervals"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "mergeIntervals",
    promptMd: `## Merge Intervals

Given an array of *intervals* where intervals[i] = [start_i, end_i], merge all **overlapping** intervals and return an array of non-overlapping intervals covering exactly the same points, sorted by start.

Two intervals [a, b] and [c, d] overlap when they share at least one point — touching endpoints count ([1, 4] and [4, 5] merge into [1, 5]).

### Example 1

~~~
Input:  intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: [1,3] and [2,6] overlap, merging into [1,6].
~~~

### Example 2

~~~
Input:  intervals = [[1,4],[4,5]]
Output: [[1,5]]
~~~

### Example 3

~~~
Input:  intervals = [[6,8],[1,9],[2,4],[4,7]]
Output: [[1,9]]
~~~

### Constraints

- 0 <= intervals.length <= 10^4
- intervals[i].length == 2
- 0 <= start_i <= end_i <= 10^4
- Input is **not** guaranteed to be sorted.`,
    starterCode: `/**
 * @param {number[][]} intervals
 * @return {number[][]} merged intervals sorted by start
 */
function mergeIntervals(intervals) {
  // your code
}`,
    solutionCode: `function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);
  const out = [sorted[0].slice()];
  for (let i = 1; i < sorted.length; i++) {
    const last = out[out.length - 1];
    if (sorted[i][0] <= last[1]) {
      last[1] = Math.max(last[1], sorted[i][1]);
    } else {
      out.push(sorted[i].slice());
    }
  }
  return out;
}`,
    solutionMd: `## Optimal: sort by start, then one greedy sweep — O(n log n)

After sorting by start, any interval that overlaps the current merged block must be its immediate successor. So sweep once: either extend the last block or start a new one.

~~~js
function mergeIntervals(intervals) {
  if (intervals.length === 0) return [];
  const sorted = intervals.slice().sort((a, b) => a[0] - b[0]);
  const out = [sorted[0].slice()];
  for (let i = 1; i < sorted.length; i++) {
    const last = out[out.length - 1];
    if (sorted[i][0] <= last[1]) {
      last[1] = Math.max(last[1], sorted[i][1]);
    } else {
      out.push(sorted[i].slice());
    }
  }
  return out;
}
~~~

The Math.max on the end matters: an interval can be fully swallowed by the block (e.g. [2,3] inside [1,10]) and must not shrink it.

- **Time:** O(n log n) for the sort; the sweep is O(n).
- **Space:** O(n) for the sorted copy and output.`,
    lessonMd: `**Intuition.** Overlap is awkward to reason about when intervals are in arbitrary order — any interval might overlap any other. Sorting by start imposes a timeline: as you sweep left to right, an interval can only merge with the block you are *currently* building, never with an earlier, already-closed one. Sorting converts a global tangle into a local, pairwise decision.

**Brute force.** Repeatedly scan all pairs; whenever two intervals overlap, replace them with their union; loop until no pair overlaps. Each sweep is O(n^2) and a merge can enable further merges, so worst case is O(n^3)-ish. Correct but chaotic — and the difficulty of *proving* it terminates cleanly is itself a hint that order is missing.

**Optimization steps.** Step 1: sort by start — O(n log n). Step 2: sweep with a "current block": for each interval, compare its start with the block's end. Overlap (start <= end, touching counts per this problem) → extend the block's end to max(blockEnd, intervalEnd). Gap → the block can never grow again (all remaining starts are even larger), so commit it and start a new block. The Math.max is not decoration: sorted by start says nothing about ends, and [1,10],[2,3] must not shrink the block to 3.

**Why the optimal works.** Key lemma: after sorting, if interval i does not overlap the current block, then no later interval overlaps that block either — later starts are >= start_i, which already exceeds the block's end. So committing the block early is safe, which is the greedy exchange argument in miniature. Conversely, every actual overlap is detected because the overlapping interval is adjacent to the block in sorted order when processed. Each output interval is thus a maximal union of overlapping inputs.

**Complexity.** Time O(n log n), dominated by sorting. Space O(n) (sorted copy + output; O(log n) if sorting in place is allowed).

**Common pitfalls.**
- Sorting with the default comparator — .sort() without a comparator compares stringified arrays; always pass (a, b) => a[0] - b[0].
- Using < instead of <= for the overlap test when touching intervals should merge (this problem says they should — read the spec each time, some variants differ).
- Setting last[1] = sorted[i][1] without Math.max — fails on contained intervals.
- Mutating the caller's arrays: slice the input and the intervals you push (defensive copying), or state the mutation explicitly in an interview.

**The transferable pattern: sort + linear sweep over intervals.** Impose order, then make one local decision per element against the running state. This exact frame solves Insert Interval, Non-overlapping Intervals (min removals), Meeting Rooms I/II, and employee free-time problems. Almost every interval question begins with "sort by start (or end) and sweep" — knowing *which* endpoint to sort by is usually the whole puzzle.`,
    testCases: [
      { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]], hidden: false, label: "classic partial overlap" },
      { input: [[[1, 4], [4, 5]]], expected: [[1, 5]], hidden: false, label: "touching endpoints" },
      { input: [[[6, 8], [1, 9], [2, 4], [4, 7]]], expected: [[1, 9]], hidden: false, label: "unsorted, all merge" },
      { input: [[[1, 4], [2, 3]]], expected: [[1, 4]], hidden: true, label: "contained interval" },
      { input: [[]], expected: [], hidden: true, label: "empty input" },
      { input: [[[5, 7]]], expected: [[5, 7]], hidden: true, label: "single interval" },
      { input: [[[3, 4], [1, 2]]], expected: [[1, 2], [3, 4]], hidden: true, label: "disjoint, needs sort" },
      { input: [[[1, 10], [2, 3], [4, 5]]], expected: [[1, 10]], hidden: true, label: "multiple contained" },
      { input: [[[1, 2], [2, 3], [3, 4]]], expected: [[1, 4]], hidden: true, label: "chain of touches" },
    ],
  },
  {
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    category: "dsa",
    difficulty: "medium",
    level: 4,
    pattern: "Linked List",
    tags: ["linked-list", "pointers"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "reverseList",
    promptMd: `## Reverse Linked List

Given the *head* of a singly linked list, reverse the list and return the new head.

In this game, a list node is a **plain object**: an object with a numeric *val* and a *next* field pointing to the next node or null. For example, the list 1 → 2 → 3 is:

~~~js
{ val: 1, next: { val: 2, next: { val: 3, next: null } } }
~~~

An empty list is null. Your function receives the head object (or null) and must return the head of the reversed list.

### Example 1

~~~
Input:  1 → 2 → 3
Output: 3 → 2 → 1
~~~

### Example 2

~~~
Input:  1
Output: 1
~~~

### Example 3

~~~
Input:  (empty list, head = null)
Output: null
~~~

### Constraints

- 0 <= list length <= 5000
- -5000 <= val <= 5000

**Follow-up:** you can reverse iteratively or recursively — can you do both?`,
    starterCode: `/**
 * A list node is { val: number, next: object|null }.
 * @param {object|null} head
 * @return {object|null} head of the reversed list
 */
function reverseList(head) {
  // your code
}`,
    solutionCode: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    solutionMd: `## Optimal: iterative three-pointer reversal — O(n)

Walk the list once, flipping each node's *next* pointer to face backward. Three references do all the work: the reversed portion's head (prev), the node being flipped (curr), and a saved handle to the rest (next).

~~~js
function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const next = curr.next;  // save the rest before we cut it off
    curr.next = prev;        // flip the arrow
    prev = curr;             // reversed list grows by one
    curr = next;             // step into the rest
  }
  return prev;
}
~~~

When curr hits null, prev is the last original node — the new head. The empty list works with zero special-casing: the loop never runs and prev is null.

- **Time:** O(n).
- **Space:** O(1) (the recursive version costs O(n) stack).`,
    lessonMd: `**Intuition.** A singly linked list is a chain of one-way arrows. Reversing the list means flipping every arrow. The catch: the moment you flip a node's arrow backward, you lose your only route forward — a singly linked list has no way back *or* re-forward. So the whole algorithm is really about *saving the forward reference before you overwrite it*.

**Brute force.** Copy all values into an array, reverse the array, then either build a fresh list or write values back — O(n) time but O(n) extra space, and it dodges the actual skill being tested (pointer surgery). A recursive version — reverse the tail, then hook head onto the end — is elegant but hides O(n) stack frames, which can overflow on long lists.

**Optimization steps.** The in-place iterative approach maintains two lists at once: prev heads the already-reversed prefix, curr heads the untouched remainder. Each iteration performs a fixed four-step dance: (1) save next = curr.next — the lifeline to the rest of the list; (2) flip curr.next = prev; (3) advance prev = curr; (4) advance curr = next. Order is everything: save before you flip, flip before you advance. When curr runs off the end, prev holds the new head.

**Why the optimal works.** Loop invariant: at the top of each iteration, prev is the head of a correctly-reversed list containing exactly the nodes already processed, and curr heads the untouched suffix in original order; the two lists partition all nodes. Each iteration moves one node from the front of the suffix onto the front of the reversed prefix, preserving the invariant. When the suffix empties, the reversed prefix is the entire list. Empty and single-node lists satisfy the invariant trivially — no special cases needed.

**Complexity.** Time O(n): each node is visited exactly once with O(1) pointer work. Space O(1): three references, no matter the list length.

**Common pitfalls.**
- Flipping before saving: curr.next = prev first, and the rest of the list is garbage-collected out from under you.
- Returning head (now the *tail*) or curr (now null) instead of prev.
- Initializing prev to head instead of null — the original head must become the tail, so its next must be null.
- In interviews: forgetting to mention the recursive alternative and its O(n) stack cost.

**The transferable pattern: in-place pointer manipulation with a saved successor.** The save–flip–advance dance is the atom of linked-list surgery. It reappears in Reverse Linked List II (reverse a sublist), swap-nodes-in-pairs, palindrome-list checks (reverse half, compare), and reorder-list. Master the invariant "prev = done, curr = todo" and every variant becomes bookkeeping.`,
    testCases: [
      { input: [{ val: 1, next: { val: 2, next: { val: 3, next: null } } }], expected: { val: 3, next: { val: 2, next: { val: 1, next: null } } }, hidden: false, label: "three nodes" },
      { input: [null], expected: null, hidden: false, label: "empty list" },
      { input: [{ val: 1, next: null }], expected: { val: 1, next: null }, hidden: false, label: "single node" },
      { input: [{ val: 1, next: { val: 2, next: null } }], expected: { val: 2, next: { val: 1, next: null } }, hidden: true, label: "two nodes" },
      { input: [{ val: 1, next: { val: 2, next: { val: 3, next: { val: 4, next: { val: 5, next: null } } } } }], expected: { val: 5, next: { val: 4, next: { val: 3, next: { val: 2, next: { val: 1, next: null } } } } }, hidden: true, label: "five nodes" },
      { input: [{ val: 0, next: { val: -1, next: null } }], expected: { val: -1, next: { val: 0, next: null } }, hidden: true, label: "negative values" },
      { input: [{ val: 7, next: { val: 7, next: { val: 7, next: null } } }], expected: { val: 7, next: { val: 7, next: { val: 7, next: null } } }, hidden: true, label: "all equal values" },
      { input: [{ val: 4, next: { val: 3, next: { val: 2, next: { val: 1, next: null } } } }], expected: { val: 1, next: { val: 2, next: { val: 3, next: { val: 4, next: null } } } }, hidden: true, label: "descending to ascending" },
    ],
  },
  {
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    category: "dsa",
    difficulty: "medium",
    level: 4,
    pattern: "Dynamic Programming",
    tags: ["dynamic-programming", "fibonacci"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "climbStairs",
    promptMd: `## Climbing Stairs

You are climbing a staircase with *n* steps. Each move, you can climb either **1** or **2** steps. In how many **distinct ways** can you reach the top?

### Example 1

~~~
Input:  n = 2
Output: 2
Explanation: 1+1 or 2.
~~~

### Example 2

~~~
Input:  n = 3
Output: 3
Explanation: 1+1+1, 1+2, 2+1.
~~~

### Example 3

~~~
Input:  n = 4
Output: 5
Explanation: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2.
~~~

### Constraints

- 1 <= n <= 45`,
    starterCode: `/**
 * @param {number} n
 * @return {number} number of distinct ways to climb n steps
 */
function climbStairs(n) {
  // your code
}`,
    solutionCode: `function climbStairs(n) {
  let a = 1; // ways to reach current step (starts as ways(0))
  let b = 1; // ways(1)
  for (let i = 0; i < n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return a;
}`,
    solutionMd: `## Optimal: bottom-up DP with two variables — O(n)

The last move onto step n came from step n-1 (a 1-step) or step n-2 (a 2-step), and those two groups are disjoint. So ways(n) = ways(n-1) + ways(n-2) — the Fibonacci recurrence with ways(0) = ways(1) = 1.

~~~js
function climbStairs(n) {
  let a = 1; // ways(i)
  let b = 1; // ways(i + 1)
  for (let i = 0; i < n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return a;
}
~~~

Each loop iteration slides the (ways(i), ways(i+1)) window up one step; after n slides, a holds ways(n).

- **Time:** O(n).
- **Space:** O(1) — the full DP table collapses to two variables because the recurrence only looks back two steps.`,
    lessonMd: `**Intuition.** Count problems love the question: *what was the last move?* Any route to step n ends with either a 1-step from n-1 or a 2-step from n-2. Those two families are disjoint (different last move) and exhaustive (no other moves exist), so the counts simply add: ways(n) = ways(n-1) + ways(n-2). Recognizing that decomposition is recognizing dynamic programming.

**Brute force.** Direct recursion on the recurrence: climb(n) = climb(n-1) + climb(n-2) with base cases. Correct, but the call tree recomputes the same subproblems exponentially — climb(5) computes climb(3) twice, climb(2) three times; total work is O(2^n). At n = 45 that is trillions of calls. The problem is not the recurrence; it is the *re-solving*.

**Optimization steps.** Step 1 — memoization (top-down): cache each computed climb(k) in a map; every subproblem is solved once, O(n) time, O(n) space for cache plus recursion stack. Step 2 — tabulation (bottom-up): fill dp[0..n] iteratively from the base cases; same O(n)/O(n) but no recursion. Step 3 — state collapse: dp[i] depends only on the previous *two* entries, so keep just two rolling variables and slide them upward n times. O(n) time, O(1) space. This three-step ladder (recursion → memo → table → rolling window) is *the* canonical DP refinement sequence; practice narrating it.

**Why the optimal works.** The recurrence is a bijection argument: routes to n split perfectly by their final move into routes-to-(n-1) and routes-to-(n-2), so addition counts every route exactly once. Base cases anchor it: ways(0) = 1 (the empty route — one way to be at the bottom), ways(1) = 1. The rolling variables maintain the invariant "(a, b) = (ways(i), ways(i+1))" which survives each slide by construction.

**Complexity.** Time O(n); space O(1). (An O(log n) matrix-exponentiation solution exists — a fun flex, rarely expected.)

**Common pitfalls.**
- Base case confusion: ways(0) = 1, not 0 — the empty climb is a valid way. Getting this wrong shifts the whole sequence.
- Overwriting a before using it in the sum — compute next first (or use destructuring).
- Recomputing with plain recursion and timing out at n around 40.
- Off-by-one: verify against small hand-counted cases (n = 2 → 2, n = 3 → 3, n = 4 → 5) before trusting the loop.

**The transferable pattern: 1-D Dynamic Programming (Fibonacci-style).** "Count/optimize over sequences of choices where state = position" with a fixed lookback collapses to a rolling window. House Robber, Min Cost Climbing Stairs, Decode Ways, and tiling problems are all this same skeleton with a different combine step. When you see "how many ways to reach the end," write the last-move recurrence first.`,
    testCases: [
      { input: [2], expected: 2, hidden: false, label: "two steps" },
      { input: [3], expected: 3, hidden: false, label: "three steps" },
      { input: [1], expected: 1, hidden: false, label: "single step" },
      { input: [4], expected: 5, hidden: true, label: "four steps" },
      { input: [5], expected: 8, hidden: true, label: "five steps" },
      { input: [6], expected: 13, hidden: true, label: "six steps" },
      { input: [10], expected: 89, hidden: true, label: "ten steps" },
      { input: [20], expected: 10946, hidden: true, label: "twenty steps" },
      { input: [30], expected: 1346269, hidden: true, label: "thirty steps" },
      { input: [45], expected: 1836311903, hidden: true, label: "max constraint (n = 45)" },
    ],
  },
  {
    slug: "coin-change",
    title: "Coin Change",
    category: "dsa",
    difficulty: "medium",
    level: 4,
    pattern: "Dynamic Programming",
    tags: ["dynamic-programming", "bfs"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "coinChange",
    promptMd: `## Coin Change

You are given an array *coins* of distinct coin denominations and an integer *amount*.

Return the **fewest number of coins** needed to make up *amount* exactly. If it cannot be made, return -1. You have an infinite supply of every coin.

### Example 1

~~~
Input:  coins = [1, 2, 5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1.
~~~

### Example 2

~~~
Input:  coins = [2], amount = 3
Output: -1
~~~

### Example 3

~~~
Input:  coins = [1], amount = 0
Output: 0
Explanation: zero coins make amount 0.
~~~

### Constraints

- 1 <= coins.length <= 12
- 1 <= coins[i] <= 10^4
- 0 <= amount <= 10^4

**Warning:** greedy (always take the biggest coin) is wrong for arbitrary denominations — try coins = [1, 3, 4] with amount 6.`,
    starterCode: `/**
 * @param {number[]} coins  distinct denominations
 * @param {number} amount
 * @return {number} fewest coins to make amount, or -1
 */
function coinChange(coins, amount) {
  // your code
}`,
    solutionCode: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const coin of coins) {
    for (let a = coin; a <= amount; a++) {
      if (dp[a - coin] + 1 < dp[a]) {
        dp[a] = dp[a - coin] + 1;
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    solutionMd: `## Optimal: bottom-up DP over amounts — O(amount × coins)

Let dp[a] = fewest coins to make amount a. If the last coin used is c, the rest must make a - c optimally — so dp[a] = 1 + min over coins of dp[a - c].

~~~js
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const coin of coins) {
    for (let a = coin; a <= amount; a++) {
      if (dp[a - coin] + 1 < dp[a]) {
        dp[a] = dp[a - coin] + 1;
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
~~~

Infinity marks "unreachable"; it propagates harmlessly through the min (Infinity + 1 is still Infinity) and converts to -1 only at the end.

- **Time:** O(amount × coins.length).
- **Space:** O(amount).`,
    lessonMd: `**Intuition.** Think of amounts 0..amount as nodes in a graph, with an edge from a to a + c for every coin c. "Fewest coins to make amount" is then "shortest path from 0 to amount" where every edge costs 1. That reframing explains everything: why greedy fails (locally big steps can strand you), why BFS works, and why DP works (shortest paths over a DAG of amounts).

**Brute force.** Try every combination recursively: for each coin, recurse on amount - coin and take the min, +1. Exponential — the same subamounts get re-solved astronomically many times. Greedy (always grab the largest coin) is tempting and *wrong*: for coins [1, 3, 4] and amount 6, greedy takes 4+1+1 = 3 coins, but 3+3 = 2 coins is optimal. Greedy only works for special "canonical" coin systems like US currency.

**Optimization steps.** Step 1 — name the subproblem: dp[a] = fewest coins for amount a. Step 2 — recurrence by last coin: dp[a] = 1 + min(dp[a - c]) over coins c <= a; base dp[0] = 0 (zero coins make zero). Step 3 — fill bottom-up from 0 to amount, initializing unreachable amounts to Infinity so min-comparisons work without special cases. The loop order here (coins outer, amounts inner) or the transpose both work for this problem, since we count coins with unlimited reuse. Step 4 — translate Infinity to -1 at the boundary only.

**Why the optimal works.** Optimal substructure: if an optimal solution for a ends with coin c, removing c leaves an optimal solution for a - c (if a cheaper one existed, swapping it in would improve a — contradiction). The recurrence tries all possible last coins, so it cannot miss the optimum, and bottom-up order guarantees every dp[a - c] is final before use. Unreachable amounts stay Infinity because Infinity + 1 never wins a min.

**Complexity.** Time O(amount × number of coins) — the table has amount + 1 cells, each considering every coin. Space O(amount). BFS over amounts gives the same bounds and finds the answer as a level number.

**Common pitfalls.**
- Assuming greedy works — the single most common wrong answer.
- Initializing dp with 0 or -1 instead of Infinity, corrupting the min.
- Forgetting dp[0] = 0, which anchors the whole table.
- Returning Infinity itself instead of -1 for impossible amounts.
- Off-by-one: the table needs amount + 1 slots.

**The transferable pattern: unbounded knapsack / shortest path on amounts.** "Reach a numeric target with reusable items, optimizing count or value" is unbounded knapsack: Perfect Squares, Combination Sum IV, rod cutting, and minimum-jump variants all reuse this table. And whenever every step costs the same, remember the problem is secretly BFS — level = answer.`,
    testCases: [
      { input: [[1, 2, 5], 11], expected: 3, hidden: false, label: "classic 5+5+1" },
      { input: [[2], 3], expected: -1, hidden: false, label: "impossible amount" },
      { input: [[1, 3, 4], 6], expected: 2, hidden: false, label: "greedy trap (3+3)" },
      { input: [[1], 0], expected: 0, hidden: true, label: "amount zero" },
      { input: [[1], 2], expected: 2, hidden: true, label: "only pennies" },
      { input: [[2, 5, 10, 1], 27], expected: 4, hidden: true, label: "multiple denominations" },
      { input: [[5], 7], expected: -1, hidden: true, label: "no combination fits" },
      { input: [[1, 2, 5], 100], expected: 20, hidden: true, label: "larger amount" },
      { input: [[3, 7], 9], expected: 3, hidden: true, label: "skip the big coin" },
      { input: [[2], 1], expected: -1, hidden: true, label: "amount below smallest coin" },
      { input: [[186, 419, 83, 408], 6249], expected: 20, hidden: true, label: "stress case" },
    ],
  },
  // ─────────────────────────────── LEVEL 5 ───────────────────────────────
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    category: "dsa",
    difficulty: "medium",
    level: 5,
    pattern: "DFS",
    tags: ["grid", "dfs", "bfs", "graph"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "numIslands",
    promptMd: `## Number of Islands

Given an m × n grid of "1" (land) and "0" (water) — each cell is the **string** "1" or "0" — return the number of **islands**.

An island is a maximal group of land cells connected **horizontally or vertically** (not diagonally). You may assume all four edges of the grid are surrounded by water.

### Example 1

~~~
Input:
[["1","1","1","1","0"],
 ["1","1","0","1","0"],
 ["1","1","0","0","0"],
 ["0","0","0","0","0"]]
Output: 1
~~~

### Example 2

~~~
Input:
[["1","1","0","0","0"],
 ["1","1","0","0","0"],
 ["0","0","1","0","0"],
 ["0","0","0","1","1"]]
Output: 3
~~~

### Example 3

~~~
Input:  [["1","0"],["0","1"]]
Output: 2
Explanation: diagonal cells are NOT connected.
~~~

### Constraints

- 0 <= m, n <= 300
- grid[i][j] is "1" or "0".`,
    starterCode: `/**
 * @param {string[][]} grid  cells are "1" (land) or "0" (water)
 * @return {number} number of islands
 */
function numIslands(grid) {
  // your code
}`,
    solutionCode: `function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set();
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== "1" || visited.has(r * cols + c)) continue;
      count++;
      const stack = [[r, c]];
      visited.add(r * cols + c);
      while (stack.length > 0) {
        const [cr, cc] = stack.pop();
        for (const [dr, dc] of dirs) {
          const nr = cr + dr;
          const nc = cc + dc;
          if (
            nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
            grid[nr][nc] === "1" && !visited.has(nr * cols + nc)
          ) {
            visited.add(nr * cols + nc);
            stack.push([nr, nc]);
          }
        }
      }
    }
  }
  return count;
}`,
    solutionMd: `## Optimal: flood fill (DFS) with a visited set — O(m·n)

Scan every cell. Each time you find land that has not been visited, you have discovered a **new island**: increment the count and flood-fill the whole island (DFS via an explicit stack) so it is never counted again.

~~~js
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set();
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== "1" || visited.has(r * cols + c)) continue;
      count++;
      const stack = [[r, c]];
      visited.add(r * cols + c);
      while (stack.length > 0) {
        const [cr, cc] = stack.pop();
        for (const [dr, dc] of dirs) {
          const nr = cr + dr;
          const nc = cc + dc;
          if (
            nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
            grid[nr][nc] === "1" && !visited.has(nr * cols + nc)
          ) {
            visited.add(nr * cols + nc);
            stack.push([nr, nc]);
          }
        }
      }
    }
  }
  return count;
}
~~~

Cells are marked visited **when pushed** (not when popped) so no cell enters the stack twice. Encoding a cell as r * cols + c gives a cheap primitive Set key.

- **Time:** O(m·n) — each cell is scanned once and flooded at most once.
- **Space:** O(m·n) worst case for the visited set and stack.`,
    lessonMd: `**Intuition.** Squint and the grid is a graph: land cells are nodes, and adjacent land cells share an edge. An "island" is then precisely a **connected component**, and "count the islands" is the textbook problem "count connected components" — solved by running one full traversal (DFS or BFS) from each not-yet-visited node and counting how many times you had to start.

**Brute force.** There is no polynomial-vs-exponential drama here; the naive mistakes are subtler. Counting land cells obviously fails (one island can have many cells). Trying to merge row-segments by hand with ad-hoc rules breaks on U-shaped and spiral islands that reconnect several rows later. The reliable primitive is a real graph traversal that exhausts an entire component before moving on.

**Optimization steps.** Step 1: outer double loop scans all cells — this guarantees no island is missed even if islands are far apart. Step 2: on hitting unvisited land, increment the counter — this cell *proves* a new component, because anything connected to a previously seen island would already be visited. Step 3: flood fill from that cell (DFS with an explicit stack here; BFS with a queue works identically), marking every reachable land cell visited. Two marking strategies exist: mutate the grid ("sink" the island by writing "0") for O(1) extra space, or keep a visited set to leave the caller's input untouched — this solution chooses the non-destructive set, encoding cells as r * cols + c for cheap keys. Step 4: mark cells when *pushed*, not when popped, or the same cell can be enqueued from two neighbors and blow up the frontier.

**Why the optimal works.** Flood fill visits exactly the connected component of its start cell — induction on path length. Therefore the counter increments exactly once per component: the first cell of a component reached by the scan starts a fill that swallows the rest, and every later cell of that component fails the "unvisited" test.

**Complexity.** Time O(m·n): every cell is examined a constant number of times (once by the scan, at most once by a fill, and at most four times as a neighbor). Space O(m·n) worst case — an all-land grid's visited set, plus the stack/queue frontier.

**Common pitfalls.**
- Including diagonals — the problem says 4-directional; test [["1","0"],["0","1"]] must give 2.
- Comparing against the number 1 when cells are the *string* "1".
- Recursion depth: recursive DFS on a 300×300 all-land grid nests ~90,000 calls — risky. Use an explicit stack or BFS.
- Marking on pop instead of push, causing duplicate frontier entries.
- Forgetting the empty-grid guard before reading grid[0].

**The transferable pattern: connected components via flood fill.** "Scan; on unseen node, count++ and traverse the whole component" solves Max Area of Island, Surrounded Regions, Pacific-Atlantic water flow, friend circles / provinces, and image bucket-fill. Whenever elements clump by adjacency and you must count, measure, or label the clumps, translate to components-and-traversal.`,
    testCases: [
      { input: [[["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]]], expected: 1, hidden: false, label: "one big island" },
      { input: [[["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]]], expected: 3, hidden: false, label: "three islands" },
      { input: [[["1", "0"], ["0", "1"]]], expected: 2, hidden: false, label: "diagonals do not connect" },
      { input: [[["1"]]], expected: 1, hidden: true, label: "single land cell" },
      { input: [[["0"]]], expected: 0, hidden: true, label: "single water cell" },
      { input: [[]], expected: 0, hidden: true, label: "empty grid" },
      { input: [[["1", "0", "1", "0", "1"]]], expected: 3, hidden: true, label: "one row, alternating" },
      { input: [[["1"], ["0"], ["1"]]], expected: 2, hidden: true, label: "one column" },
      { input: [[["1", "1"], ["1", "1"]]], expected: 1, hidden: true, label: "all land" },
      { input: [[["0", "0"], ["0", "0"]]], expected: 0, hidden: true, label: "all water" },
    ],
  },
  {
    slug: "top-k-frequent",
    title: "Top K Frequent Elements",
    category: "dsa",
    difficulty: "medium",
    level: 5,
    pattern: "Hash Map",
    tags: ["hash-map", "bucket-sort", "heap"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "topKFrequent",
    resultOrder: "any",
    promptMd: `## Top K Frequent Elements

Given an integer array *nums* and an integer *k*, return the *k* **most frequent** elements. You may return the answer in **any order**.

The test data is constructed so the answer is **unique** (no ties straddling the k-boundary).

### Example 1

~~~
Input:  nums = [1, 1, 1, 2, 2, 3], k = 2
Output: [1, 2]
~~~

### Example 2

~~~
Input:  nums = [1], k = 1
Output: [1]
~~~

### Example 3

~~~
Input:  nums = [4, 4, 4, 6, 6, 7], k = 2
Output: [4, 6]
~~~

### Constraints

- 1 <= nums.length <= 10^5
- k is between 1 and the number of distinct elements.

**Follow-up:** your algorithm should beat O(n log n).`,
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]} the k most frequent elements, any order
 */
function topKFrequent(nums, k) {
  // your code
}`,
    solutionCode: `function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) {
    freq.set(n, (freq.get(n) || 0) + 1);
  }
  const buckets = new Array(nums.length + 1).fill(null).map(() => []);
  for (const [num, count] of freq) {
    buckets[count].push(num);
  }
  const out = [];
  for (let c = buckets.length - 1; c >= 0 && out.length < k; c--) {
    for (const num of buckets[c]) {
      out.push(num);
      if (out.length === k) break;
    }
  }
  return out;
}`,
    solutionMd: `## Optimal: frequency map + bucket sort — O(n)

Count frequencies, then exploit a bounded fact: no element can appear more than n times. So make n + 1 buckets indexed **by frequency**, drop each distinct element into bucket[itsCount], and read buckets from the highest frequency down until k elements are collected.

~~~js
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const n of nums) {
    freq.set(n, (freq.get(n) || 0) + 1);
  }
  const buckets = new Array(nums.length + 1).fill(null).map(() => []);
  for (const [num, count] of freq) {
    buckets[count].push(num);
  }
  const out = [];
  for (let c = buckets.length - 1; c >= 0 && out.length < k; c--) {
    for (const num of buckets[c]) {
      out.push(num);
      if (out.length === k) break;
    }
  }
  return out;
}
~~~

- **Time:** O(n) — counting, bucketing, and the downward sweep are all linear.
- **Space:** O(n) for the map and buckets.`,
    lessonMd: `**Intuition.** Two separable concerns hide in this problem: (1) *how often* does each value occur — a counting job for a hash map — and (2) *which counts are the k largest* — a selection job. The insight that makes selection cheap: frequencies are integers in the tiny range 1..n, and whenever keys live in a bounded integer range, you can bucket by key instead of comparison-sorting.

**Brute force.** Count with a map, then sort the distinct elements by frequency descending and take the first k. O(n log n) because of the sort. Completely acceptable as a first answer — but the follow-up explicitly asks to beat it, and the sort is overkill: we do not need the full ranking, only the top k.

**Optimization steps.** Option A — heap: keep a min-heap of size k over (element, count); push each entry, popping the smallest when size exceeds k. O(n log k), great when k is small and standard in languages with built-in heaps (JS lacks one, making this clunkier to hand-roll). Option B — bucket sort, the linear-time winner: allocate buckets[0..n], where buckets[c] lists every element occurring exactly c times. Fill from the frequency map, then walk c from n down to 1 collecting elements until you have k. No comparisons between frequencies ever happen — the array index *is* the sort. Option C — quickselect on frequencies achieves O(n) average and is worth mentioning by name.

**Why the optimal works.** Every distinct element lands in exactly one bucket, and the downward sweep visits frequencies in strictly decreasing order — so the first k elements collected have frequencies no smaller than anything left uncollected. Since the problem guarantees a unique answer (no tie crosses the k-boundary), those k elements are exactly the answer, in some order — which is fine, because the checker canonicalizes order.

**Complexity.** Time O(n): one counting pass, one bucketing pass over at most n distinct values, one sweep over n + 1 buckets. Space O(n).

**Common pitfalls.**
- new Array(n).fill([]) — fill copies **one** array reference into every slot, so all buckets alias each other. Use fill(null).map(() => []).
- Sizing buckets to n instead of n + 1 — an element appearing n times (e.g. [7,7,7], k=1) needs bucket index n.
- Building a heap of all n entries (O(n log n)) instead of capping it at k.
- Returning counts instead of the elements themselves.

**The transferable pattern: bucket sort on bounded keys (plus Hash Map counting).** When the quantity you would sort by is an integer with a small bounded range — frequencies, ages, character codes, ratings — replace comparison sorting with direct indexing. The same idea powers counting sort, radix sort passes, Sort Characters by Frequency, and H-Index. Pair it with the frequency-map primitive from Valid Anagram and you can dismantle most "top/most common" problems in linear time.`,
    testCases: [
      { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], hidden: false, label: "classic top two" },
      { input: [[1], 1], expected: [1], hidden: false, label: "single element" },
      { input: [[4, 4, 4, 6, 6, 7], 2], expected: [4, 6], hidden: false, label: "three distinct, pick two" },
      { input: [[1, 2], 2], expected: [1, 2], hidden: true, label: "k equals distinct count" },
      { input: [[-1, -1, 2, 2, 2], 1], expected: [2], hidden: true, label: "negatives present" },
      { input: [[5, 5, 5, 3, 3, 1], 3], expected: [5, 3, 1], hidden: true, label: "all three tiers" },
      { input: [[7], 1], expected: [7], hidden: true, label: "singleton array" },
      { input: [[0, 0, 0, 0], 1], expected: [0], hidden: true, label: "max frequency bucket" },
      { input: [[3, 0, 1, 0], 1], expected: [0], hidden: true, label: "zero as the answer" },
    ],
  },
  {
    slug: "house-robber",
    title: "House Robber",
    category: "dsa",
    difficulty: "medium",
    level: 5,
    pattern: "Dynamic Programming",
    tags: ["dynamic-programming", "array"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "rob",
    promptMd: `## House Robber

You are a professional robber planning to rob houses along a street. Each house has a stash of money, given by *nums*. Adjacent houses have linked security systems: robbing **two adjacent houses** triggers the alarm.

Return the **maximum** amount you can rob without ever robbing two adjacent houses.

### Example 1

~~~
Input:  nums = [1, 2, 3, 1]
Output: 4
Explanation: rob house 0 (1) and house 2 (3). Total = 4.
~~~

### Example 2

~~~
Input:  nums = [2, 7, 9, 3, 1]
Output: 12
Explanation: rob houses 0, 2, 4 → 2 + 9 + 1 = 12.
~~~

### Example 3

~~~
Input:  nums = [2, 1, 1, 2]
Output: 4
Explanation: rob houses 0 and 3 (skip two in a row) → 4.
~~~

### Constraints

- 0 <= nums.length <= 100
- 0 <= nums[i] <= 400`,
    starterCode: `/**
 * @param {number[]} nums  money in each house
 * @return {number} max loot without robbing adjacent houses
 */
function rob(nums) {
  // your code
}`,
    solutionCode: `function rob(nums) {
  let withPrev = 0;    // best if the previous house WAS robbed
  let withoutPrev = 0; // best if the previous house was NOT robbed
  for (const n of nums) {
    const take = withoutPrev + n;
    withoutPrev = Math.max(withoutPrev, withPrev);
    withPrev = take;
  }
  return Math.max(withPrev, withoutPrev);
}`,
    solutionMd: `## Optimal: DP with two rolling states — O(n)

At each house you either rob it (then the previous house must be skipped) or skip it (carry forward the better of the two previous states).

~~~js
function rob(nums) {
  let withPrev = 0;    // best total if the previous house was robbed
  let withoutPrev = 0; // best total if the previous house was skipped
  for (const n of nums) {
    const take = withoutPrev + n;                  // rob current
    withoutPrev = Math.max(withoutPrev, withPrev); // skip current
    withPrev = take;
  }
  return Math.max(withPrev, withoutPrev);
}
~~~

This is dp[i] = max(dp[i-1], dp[i-2] + nums[i]) with the table collapsed to two variables.

- **Time:** O(n).
- **Space:** O(1).`,
    lessonMd: `**Intuition.** Stand at the last house and ask the DP question: *is it robbed or not?* If robbed, you collect its cash plus the best plan for houses 0..n-3 (the neighbor is off-limits). If skipped, the answer is simply the best plan for houses 0..n-2. Either way, the problem shrinks to a smaller copy of itself — the definition of optimal substructure.

**Brute force.** Enumerate all subsets of houses, filter out those with adjacent picks, and take the richest — O(2^n). Recursion expressing the choice at each house is the same cost until you notice the recomputation: rob(i) is re-derived from exponentially many call paths.

**Optimization steps.** Define dp[i] = max loot from the first i+1 houses. Recurrence: dp[i] = max(dp[i-1], dp[i-2] + nums[i]) — skip house i, or rob it on top of the best that legally precedes it. Memoize (O(n) time, O(n) space), tabulate, then collapse: the recurrence looks back only two entries, so two rolling variables suffice. This solution frames them by *state* rather than index — "best if previous was robbed" vs "best if previous was skipped" — which generalizes beautifully to harder state-machine DPs (stock problems with cooldowns, for instance). A subtle point in the update order: take must be computed from the *old* withoutPrev before it is overwritten.

**Why the optimal works.** The two branches at each house are exhaustive, and each relies on optimal sub-answers: if a better plan existed for the prefix, substituting it would improve the total — the standard cut-and-paste contradiction. The greedy alternatives people try first ("rob all even houses or all odd houses, take the better") are refuted by [2, 1, 1, 2]: evens give 3, odds give 3, but the optimum robs houses 0 and 3 for 4. Adjacent-skipping does not mean alternating — sometimes you skip *two* in a row.

**Complexity.** Time O(n) — one pass, constant work per house. Space O(1) after the rolling-variable collapse.

**Common pitfalls.**
- Believing you must rob every other house — the [2, 1, 1, 2] counterexample again.
- Update-order bug: overwriting withoutPrev before computing take, silently allowing adjacent robberies.
- Mishandling tiny inputs: empty street → 0, single house → its value; the loop-plus-zeros initialization handles both without branches.
- On the follow-up (House Robber II, circular street): forgetting that first and last become adjacent — run the linear solver twice, excluding one end each time.

**The transferable pattern: take-or-skip DP with rolling state.** Linear sequence + local exclusion constraint + maximize is a whole family: Delete and Earn, Min Cost Climbing Stairs, stock problems with cooldown, and non-adjacent subset sums. Write the recurrence by asking "what happens at the last element," then collapse the table to as many variables as the lookback depth.`,
    testCases: [
      { input: [[1, 2, 3, 1]], expected: 4, hidden: false, label: "classic four houses" },
      { input: [[2, 7, 9, 3, 1]], expected: 12, hidden: false, label: "rob three houses" },
      { input: [[2, 1, 1, 2]], expected: 4, hidden: false, label: "skip two in a row" },
      { input: [[]], expected: 0, hidden: true, label: "empty street" },
      { input: [[5]], expected: 5, hidden: true, label: "single house" },
      { input: [[2, 1]], expected: 2, hidden: true, label: "two houses, first bigger" },
      { input: [[1, 2]], expected: 2, hidden: true, label: "two houses, second bigger" },
      { input: [[100]], expected: 100, hidden: true, label: "one rich house" },
      { input: [[1, 3, 1, 3, 100]], expected: 103, hidden: true, label: "big finale" },
      { input: [[6, 7, 1, 30, 8, 2, 4]], expected: 41, hidden: true, label: "longer street" },
    ],
  },
  {
    slug: "rotting-oranges",
    title: "Rotting Oranges",
    category: "dsa",
    difficulty: "medium",
    level: 5,
    pattern: "BFS",
    tags: ["grid", "bfs", "simulation"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "orangesRotting",
    promptMd: `## Rotting Oranges

You are given an m × n *grid* where each cell is:

- 0 — empty
- 1 — a fresh orange
- 2 — a rotten orange

Every minute, any fresh orange **4-directionally adjacent** to a rotten orange becomes rotten.

Return the minimum number of minutes until **no cell has a fresh orange**. If that is impossible, return -1. If there are no fresh oranges to begin with, return 0.

### Example 1

~~~
Input:
[[2,1,1],
 [1,1,0],
 [0,1,1]]
Output: 4
~~~

### Example 2

~~~
Input:
[[2,1,1],
 [0,1,1],
 [1,0,1]]
Output: -1
Explanation: the orange at the bottom-left is unreachable.
~~~

### Example 3

~~~
Input:  [[0, 2]]
Output: 0
Explanation: no fresh oranges exist, so zero minutes pass.
~~~

### Constraints

- 1 <= m, n <= 10
- grid[i][j] is 0, 1, or 2.`,
    starterCode: `/**
 * @param {number[][]} grid  0 = empty, 1 = fresh, 2 = rotten
 * @return {number} minutes until no fresh orange remains, or -1
 */
function orangesRotting(grid) {
  // your code
}`,
    solutionCode: `function orangesRotting(grid) {
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const state = grid.map((row) => row.slice());
  let queue = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (state[r][c] === 2) queue.push([r, c]);
      else if (state[r][c] === 1) fresh++;
    }
  }
  if (fresh === 0) return 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let minutes = 0;
  while (queue.length > 0 && fresh > 0) {
    const next = [];
    for (const [r, c] of queue) {
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && state[nr][nc] === 1) {
          state[nr][nc] = 2;
          fresh--;
          next.push([nr, nc]);
        }
      }
    }
    queue = next;
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}`,
    solutionMd: `## Optimal: multi-source BFS, level by level — O(m·n)

Seed a queue with **every** rotten orange at once, count the fresh ones, then expand the rot one full "level" (minute) at a time. The number of levels needed to consume all fresh oranges is the answer.

~~~js
function orangesRotting(grid) {
  if (!grid || grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const state = grid.map((row) => row.slice());
  let queue = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (state[r][c] === 2) queue.push([r, c]);
      else if (state[r][c] === 1) fresh++;
    }
  }
  if (fresh === 0) return 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let minutes = 0;
  while (queue.length > 0 && fresh > 0) {
    const next = [];
    for (const [r, c] of queue) {
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && state[nr][nc] === 1) {
          state[nr][nc] = 2;
          fresh--;
          next.push([nr, nc]);
        }
      }
    }
    queue = next;
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}
~~~

The loop condition includes fresh > 0 so the last wave of rotting is not followed by a phantom extra minute. The grid is copied first so the caller's input is not mutated.

- **Time:** O(m·n).
- **Space:** O(m·n).`,
    lessonMd: `**Intuition.** Rot spreads like a wave: everything adjacent to rot at minute t becomes rotten at minute t+1. "How many minutes until everything is reached" is exactly "what is the largest BFS distance from the *set* of initially rotten cells" — a shortest-path question where all sources start simultaneously. That simultaneity is the key reframe: do not BFS from each rotten orange separately; put them **all** in the starting queue and let the waves merge.

**Brute force.** Literal simulation: each minute, scan the whole grid, mark every fresh orange adjacent to rot (into a copy — more on that below), repeat until a full scan changes nothing. Each sweep is O(m·n) and there can be O(m·n) sweeps: O((m·n)^2). Fine at 10×10, but the real cost is conceptual — you rescan thousands of cells that cannot possibly change this minute. Only the *frontier* matters.

**Optimization steps.** Step 1: one initial scan collects all rotten cells into a queue and counts fresh oranges. Step 2: process the queue level by level — everything currently queued rots its fresh neighbors, and exactly those neighbors form the next level. Swapping in a fresh next array per minute is the cleanest level delimiter. Step 3: decrement the fresh counter as oranges rot; it doubles as both the success test (fresh === 0) and the impossibility test (queue empties while fresh > 0 — some orange is unreachable, return -1). Marking a neighbor rotten *at enqueue time* prevents double-enqueueing.

**Why the optimal works.** Multi-source BFS computes, for every cell, the minimum distance to *any* source — precisely the minute that cell rots, since rot advances one step per minute along all paths at once. Level k of the BFS is exactly the set of oranges rotting at minute k. The answer is the last non-empty level's number, and the fresh counter certifies completeness without a final grid rescan.

**Complexity.** Time O(m·n): each cell enters the queue at most once and edges are constant per cell. Space O(m·n) for the queue and the defensive grid copy.

**Common pitfalls.**
- The off-by-one: incrementing minutes after a final wave that rotted nothing, returning 5 instead of 4 on the classic example. Gating the loop on fresh > 0 (or checking whether a level actually rotted something) fixes it.
- Forgetting the two degenerate cases: no fresh oranges → 0 (not -1); rot that can never reach isolated fresh oranges → -1.
- In-place simulation without separating levels: rotting a neighbor and then processing it in the *same* minute makes rot travel faster than one cell per minute.
- Mutating the caller's grid — copy first, or at least know you are doing it.

**The transferable pattern: multi-source BFS for simultaneous spread.** Whenever multiple origins expand at equal speed and you need the time to cover everything — 01 Matrix (distance to nearest zero), Walls and Gates, fire-spread and flood-fill-timing problems — seed all sources at distance zero and BFS. If a problem says "each unit of time, X spreads to neighbors," it is this pattern, verbatim.`,
    testCases: [
      { input: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4, hidden: false, label: "classic four minutes" },
      { input: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1, hidden: false, label: "unreachable orange" },
      { input: [[[0, 2]]], expected: 0, hidden: false, label: "no fresh oranges" },
      { input: [[[0]]], expected: 0, hidden: true, label: "single empty cell" },
      { input: [[[1]]], expected: -1, hidden: true, label: "lone fresh orange, no rot" },
      { input: [[[2]]], expected: 0, hidden: true, label: "lone rotten orange" },
      { input: [[[2, 1, 1, 1, 1]]], expected: 4, hidden: true, label: "single row chain" },
      { input: [[[1, 2, 1]]], expected: 1, hidden: true, label: "rot in the middle" },
      { input: [[[2, 1, 0, 1, 2]]], expected: 1, hidden: true, label: "two sources converge" },
      { input: [[[0, 1]]], expected: -1, hidden: true, label: "fresh but zero sources" },
    ],
  },
  // ─────────────────────────────── LEVEL 6 ───────────────────────────────
  {
    slug: "lru-cache",
    title: "LRU Cache",
    category: "dsa",
    difficulty: "hard",
    level: 6,
    pattern: "Design",
    tags: ["design", "hash-map", "linked-list"],
    timeLimitSeconds: 2700,
    editorType: "monaco",
    functionName: "runLru",
    promptMd: `## LRU Cache

Design a data structure implementing a **Least Recently Used (LRU) cache**. Implement the class *LRUCache*:

- *constructor(capacity)* — initialize with a positive capacity.
- *get(key)* — return the value for the key, or -1 if absent. A successful get counts as a **use**.
- *put(key, value)* — insert or update the key. If inserting pushes the cache past capacity, **evict the least recently used** key first. A put counts as a use.

Both *get* and *put* must run in **O(1)** average time.

### How this question is tested

Your editor includes a pre-written wrapper *runLru(ops, args)* that replays a list of operations against your class and collects the outputs. **Implement the LRUCache class; do not edit the wrapper.** Constructor and put operations record null; get operations record their return value.

### Example

~~~
Input:
ops  = ["LRUCache","put","put","get","put","get","put","get","get","get"]
args = [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]
Output: [null,null,null,1,null,-1,null,-1,3,4]

Explanation (capacity 2):
put(1,1) put(2,2)      cache = {1,2}
get(1) → 1             1 is now most recent
put(3,3)               evicts 2 (least recent)
get(2) → -1
put(4,4)               evicts 1
get(1) → -1, get(3) → 3, get(4) → 4
~~~

### Constraints

- 1 <= capacity <= 3000
- Up to 10^5 operations; get and put must be O(1).`,
    starterCode: `class LRUCache {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    // your code
  }

  /**
   * @param {number} key
   * @return {number} value or -1
   */
  get(key) {
    // your code
  }

  /**
   * @param {number} key
   * @param {number} value
   */
  put(key, value) {
    // your code
  }
}

// ---- Test harness wrapper: DO NOT EDIT BELOW THIS LINE ----
function runLru(ops, args) {
  const out = [];
  let cache = null;
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === "LRUCache") { cache = new LRUCache(args[i][0]); out.push(null); }
    else if (ops[i] === "put") { cache.put(args[i][0], args[i][1]); out.push(null); }
    else out.push(cache.get(args[i][0]));
  }
  return out;
}`,
    solutionCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      this.map.delete(this.map.keys().next().value);
    }
    this.map.set(key, value);
  }
}

// ---- Test harness wrapper: DO NOT EDIT BELOW THIS LINE ----
function runLru(ops, args) {
  const out = [];
  let cache = null;
  for (let i = 0; i < ops.length; i++) {
    if (ops[i] === "LRUCache") { cache = new LRUCache(args[i][0]); out.push(null); }
    else if (ops[i] === "put") { cache.put(args[i][0], args[i][1]); out.push(null); }
    else out.push(cache.get(args[i][0]));
  }
  return out;
}`,
    solutionMd: `## Optimal: Map with insertion-order recycling — O(1) per operation

The classic implementation pairs a hash map with a doubly linked list: the map finds nodes in O(1), the list keeps them in recency order so the LRU victim is always at one end. In JavaScript, the built-in Map **already iterates in insertion order** and supports O(1) delete + re-insert — so it can play both roles.

~~~js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);   // remove from current position...
    this.map.set(key, value); // ...re-insert at the back (most recent)
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key); // refresh position on update
    } else if (this.map.size >= this.capacity) {
      // first key in iteration order is the least recently used
      this.map.delete(this.map.keys().next().value);
    }
    this.map.set(key, value);
  }
}
~~~

Invariant: the Map's iteration order is exactly recency order — front = least recently used, back = most recently used. Every access re-inserts at the back; eviction pops the front via keys().next().

- **Time:** O(1) average for both operations.
- **Space:** O(capacity).

In a language without an ordered map, you would hand-build the same thing: hash map from key → doubly-linked-list node, with sentinel head/tail nodes for edge-free splicing. Be ready to whiteboard that version.`,
    lessonMd: `**Intuition.** An LRU cache must answer two very different queries in O(1): *"what is the value for key k?"* (a lookup — hash map territory) and *"which key was touched longest ago?"* (an ordering question — list territory). No single classic structure does both, so the design insight is **composition**: a hash map for access, threaded together with a recency-ordered doubly linked list, kept in sync on every operation.

**Brute force.** Store entries in an array with a timestamp per key. get scans for the key — O(n). put evicts by scanning for the minimum timestamp — O(n). Correct, and a fine warm-up, but the problem demands O(1), and at 10^5 operations the quadratic total collapses.

**Optimization steps.** Step 1: hash map from key → value gives O(1) lookup but no recency. Step 2: add recency as a doubly linked list — most recent at the back, victim at the front. Moving a node to the back on every access requires O(1) removal from the middle, which is exactly why the list must be *doubly* linked (singly linked cannot unlink a node without its predecessor). The map's values point at list nodes, marrying the structures. Sentinel head/tail nodes eliminate every null-check edge case. Step 3 (the JS shortcut used here): a built-in Map iterates in insertion order with O(1) delete and re-insert — delete + set *is* "move to back," and keys().next().value *is* "front of the list." The composed structure is hiding inside the standard library; know both formulations, because interviewers may ask you to build the explicit one.

**Why the optimal works.** Maintain the invariant: map iteration order equals recency order, oldest first. Every get and every put on an existing key re-inserts that key at the back, so the invariant survives each operation. Eviction removes the front — provably the least recently used, by the invariant. Since each operation is a constant number of map primitives, O(1) holds.

**Complexity.** Time O(1) average per get/put. Space O(capacity) — the map never exceeds capacity entries.

**Common pitfalls.**
- Forgetting that a *get* refreshes recency — the most commonly failed hidden case.
- put on an **existing** key must refresh recency and must not trigger eviction (size does not grow).
- Evicting before checking whether the key already exists, wrongly evicting when updating a full cache.
- In the explicit list version: mangling pointers on remove (four pointer writes) — sentinels prevent most of these bugs.
- Capacity 1 edge case: every put of a new key evicts the previous one.

**The transferable pattern: composite data-structure Design.** When one structure cannot meet all the O(1) requirements, compose two and keep them synchronized under a stated invariant. LFU Cache (map + frequency buckets), Insert/Delete/GetRandom O(1) (map + array with swap-remove), min-stack (stack + running-min stack), and real systems (Redis's LRU, database buffer pools, browser caches) all follow this design recipe: list the required operations, assign each to a structure that does it in O(1), then define the sync invariant.`,
    testCases: [
      { input: [["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]], expected: [null, null, null, 1, null, -1, null, -1, 3, 4], hidden: false, label: "classic LeetCode sequence" },
      { input: [["LRUCache", "put", "get", "put", "get", "get"], [[1], [2, 1], [2], [3, 2], [2], [3]]], expected: [null, null, 1, null, -1, 2], hidden: false, label: "capacity one" },
      { input: [["LRUCache", "get"], [[1], [5]]], expected: [null, -1], hidden: true, label: "get on empty cache" },
      { input: [["LRUCache", "put", "put", "put", "get", "get"], [[2], [1, 1], [2, 2], [1, 10], [1], [2]]], expected: [null, null, null, null, 10, 2], hidden: true, label: "update without eviction" },
      { input: [["LRUCache", "put", "put", "get", "put", "get", "get"], [[2], [1, 1], [2, 2], [1], [3, 3], [2], [1]]], expected: [null, null, null, 1, null, -1, 1], hidden: true, label: "get refreshes recency" },
      { input: [["LRUCache", "put", "put", "put", "put", "get", "get", "get"], [[2], [1, 1], [2, 2], [1, 5], [3, 3], [1], [2], [3]]], expected: [null, null, null, null, null, 5, -1, 3], hidden: true, label: "put refreshes recency" },
      { input: [["LRUCache", "put", "put", "put", "put", "get", "get", "get", "get"], [[3], [1, 1], [2, 2], [3, 3], [4, 4], [1], [2], [3], [4]]], expected: [null, null, null, null, null, -1, 2, 3, 4], hidden: true, label: "capacity three rolling evict" },
      { input: [["LRUCache", "put", "put", "put", "get"], [[1], [7, 1], [7, 2], [7, 3], [7]]], expected: [null, null, null, null, 3], hidden: true, label: "repeated updates same key" },
    ],
  },
  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    category: "dsa",
    difficulty: "hard",
    level: 6,
    pattern: "Two Pointers",
    tags: ["array", "two-pointers", "prefix-max"],
    timeLimitSeconds: 2700,
    editorType: "monaco",
    functionName: "trap",
    promptMd: `## Trapping Rain Water

Given *n* non-negative integers representing an elevation map where the width of each bar is 1, compute how much **water** the map can trap after raining.

### Example 1

~~~
Input:  height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: the map traps 6 units in the valleys between the bars.
~~~

### Example 2

~~~
Input:  height = [4,2,0,3,2,5]
Output: 9
~~~

### Example 3

~~~
Input:  height = [3,0,3]
Output: 3
Explanation: the middle cell holds min(3, 3) - 0 = 3 units.
~~~

### Constraints

- 0 <= height.length <= 2 * 10^4
- 0 <= height[i] <= 10^5

**Target:** O(n) time, O(1) extra space.`,
    starterCode: `/**
 * @param {number[]} height
 * @return {number} total units of trapped water
 */
function trap(height) {
  // your code
}`,
    solutionCode: `function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,
    solutionMd: `## Optimal: converging two pointers — O(n) time, O(1) space

Water above cell i is min(maxLeft, maxRight) - height[i]. The two-pointer trick: work inward from both ends, always advancing the side with the **smaller** bar — for that side, the min in the formula is already decided, so the water there can be settled immediately.

~~~js
function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) leftMax = height[left];
      else water += leftMax - height[left];
      left++;
    } else {
      if (height[right] >= rightMax) rightMax = height[right];
      else water += rightMax - height[right];
      right--;
    }
  }
  return water;
}
~~~

Why it is sound: when height[left] < height[right], some bar on the right (at least height[right]) guarantees rightMax >= height[left]... so min(leftMax, trueRightMax) = leftMax governs the left cell, and leftMax is exact because the left side has been fully scanned.

- **Time:** O(n) — each pointer moves inward exactly once.
- **Space:** O(1) — four scalars.`,
    lessonMd: `**Intuition.** Think per-column, not per-puddle. Column i holds water up to the *lower* of the tallest bar somewhere to its left and the tallest bar somewhere to its right: water(i) = min(maxLeft(i), maxRight(i)) - height[i], floored at 0. Once you believe that formula (imagine the water level above column i — it spills over whichever side wall is lower), the problem is purely about computing those two maxima efficiently for every column.

**Brute force.** For each column, scan left for the max and right for the max — O(n) per column, O(n^2) total. At n = 2·10^4, ~400 million operations: too slow, and blatantly redundant since neighboring columns share almost the same maxima.

**Optimization steps.** Step 1 — prefix/suffix precomputation (the Product-Except-Self trick): one pass builds maxLeft[], a reverse pass builds maxRight[], a third pass sums the formula. O(n) time, O(n) space. Interview-complete. Step 2 — the O(1)-space refinement: converging pointers. Keep left/right pointers with running leftMax/rightMax. The trick is deciding which cell can be *finalized* without knowing the far side's true maximum. If height[left] < height[right], the right side is guaranteed to contain a bar at least as tall as height[left]; therefore the true maxRight for the left cell is at least height[left], and since leftMax also caps the water, min(leftMax, maxRight) = leftMax exactly. Settle the left cell and advance. Symmetrically for the right. (A stack-based solution filling valleys horizontally also runs O(n) — worth knowing it exists.)

**Why the optimal works.** The invariant: every cell outside [left, right] has been settled with its exact water amount, and leftMax/rightMax are the true maxima of the settled outer regions. The comparison height[left] < height[right] certifies which side's bound is tight — the crucial subtlety is that we never need the *exact* opposite-side maximum, only the guarantee that it is not the binding constraint. Each step settles one cell correctly and shrinks the window, so the sum is exact when the pointers meet.

**Complexity.** Time O(n): n pointer advances total. Space O(1): two pointers, two running maxima.

**Common pitfalls.**
- Believing water can be computed from a single pass of local dips — wide valleys spanning many bars, like [3,0,0,0,3], defeat local reasoning.
- Forgetting the outermost columns can never hold water (no outer wall) — the algorithm handles it naturally since they *become* the maxima.
- Off-by-one in the strict/non-strict comparison: with height[left] === height[right], either side may advance safely, but only if the chosen branch updates that side's own max first.
- The prefix-array version: computing maxLeft *including* the current bar vs *excluding* it — both conventions work but mixing them double-counts.

**The transferable pattern: Two Pointers with a certified bound.** The deep move is advancing whichever end holds the weaker guarantee, because the weaker side's answer is already fully determined by information in hand — the same certification logic as Container With Most Water. Combined with the prefix-max fallback (pattern-shared with Product of Array Except Self), you have two independent O(n) routes to the answer; being able to present both, plus the space tradeoff, is what makes this a signature hard-level interview performance.`,
    testCases: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6, hidden: false, label: "classic elevation map" },
      { input: [[4, 2, 0, 3, 2, 5]], expected: 9, hidden: false, label: "deep valley" },
      { input: [[3, 0, 3]], expected: 3, hidden: false, label: "simple bucket" },
      { input: [[]], expected: 0, hidden: true, label: "empty array" },
      { input: [[1]], expected: 0, hidden: true, label: "single bar" },
      { input: [[1, 2]], expected: 0, hidden: true, label: "two bars, no valley" },
      { input: [[2, 0, 2, 0, 2]], expected: 4, hidden: true, label: "double bucket" },
      { input: [[5, 4, 1, 2]], expected: 1, hidden: true, label: "descending with dip" },
      { input: [[0, 3, 0, 1, 0, 3]], expected: 8, hidden: true, label: "wide valley" },
      { input: [[1, 0, 1]], expected: 1, hidden: true, label: "unit bucket" },
      { input: [[4, 2, 3]], expected: 1, hidden: true, label: "small dip" },
    ],
  },
];
