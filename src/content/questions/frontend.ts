import type { Question } from "@/lib/types";

// ----------------------------------------------------------------
// Sandpack file contents (Part B). Kept as consts so the same
// string can serve as starterCode/solutionCode and sandpack files.
// ----------------------------------------------------------------

const controlledInputStarter = `import { useState } from "react";

export default function App() {
  // TODO: hold the input text in state so the live count and the
  // Clear button work. The count text must be exactly:
  //   <length> characters      e.g. "5 characters"
  return (
    <div>
      <label htmlFor="message">Message</label>
      <input id="message" />
      <p>0 characters</p>
      <button>Clear</button>
    </div>
  );
}
`;

const controlledInputSolution = `import { useState } from "react";

export default function App() {
  const [value, setValue] = useState("");
  return (
    <div>
      <label htmlFor="message">Message</label>
      <input
        id="message"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p>{value.length + " characters"}</p>
      <button onClick={() => setValue("")}>Clear</button>
    </div>
  );
}
`;

const controlledInputTests = `import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders a text input and a Clear button", () => {
  render(<App />);
  expect(screen.getByRole("textbox")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Clear" })).toBeTruthy();
});

test("shows 0 characters initially", () => {
  render(<App />);
  expect(screen.getByText("0 characters")).toBeTruthy();
});

test("typing updates the input value (controlled)", () => {
  render(<App />);
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "hello" } });
  expect(input.value).toBe("hello");
});

test("character count updates as the user types", () => {
  render(<App />);
  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "hello world" },
  });
  expect(screen.getByText("11 characters")).toBeTruthy();
});

test("Clear empties the input and resets the count", () => {
  render(<App />);
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "hello" } });
  fireEvent.click(screen.getByRole("button", { name: "Clear" }));
  expect(input.value).toBe("");
  expect(screen.getByText("0 characters")).toBeTruthy();
});
`;

const starRatingStarter = `import { useState } from "react";

const STARS = [1, 2, 3, 4, 5];

export default function App() {
  // TODO: track the committed rating AND the currently hovered star.
  // - clicking star N sets the rating to N
  // - hovering star N previews N filled stars without committing
  // - leaving the star container reverts to the committed rating
  // - a star shows "\\u2605" (filled) when its number <= the active
  //   value, otherwise "\\u2606" (empty)
  // - the text below must be exactly: Rating: <n>/5
  return (
    <div>
      <div>
        {STARS.map((n) => (
          <button
            key={n}
            aria-label={"Rate " + n + (n === 1 ? " star" : " stars")}
          >
            {"\\u2606"}
          </button>
        ))}
      </div>
      <p>Rating: 0/5</p>
    </div>
  );
}
`;

const starRatingSolution = `import { useState } from "react";

const STARS = [1, 2, 3, 4, 5];

export default function App() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const active = hovered > 0 ? hovered : rating;
  return (
    <div>
      <div onMouseLeave={() => setHovered(0)}>
        {STARS.map((n) => (
          <button
            key={n}
            aria-label={"Rate " + n + (n === 1 ? " star" : " stars")}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHovered(n)}
          >
            {n <= active ? "\\u2605" : "\\u2606"}
          </button>
        ))}
      </div>
      <p>{"Rating: " + rating + "/5"}</p>
    </div>
  );
}
`;

const starRatingTests = `import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders five star buttons with accessible labels", () => {
  render(<App />);
  expect(screen.getAllByRole("button").length).toBe(5);
  expect(screen.getByRole("button", { name: "Rate 1 star" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Rate 5 stars" })).toBeTruthy();
});

test("shows Rating: 0/5 and all empty stars initially", () => {
  render(<App />);
  expect(screen.getByText("Rating: 0/5")).toBeTruthy();
  screen.getAllByRole("button").forEach((star) => {
    expect(star.textContent).toBe("\\u2606");
  });
});

test("clicking the third star commits the rating", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Rate 3 stars" }));
  expect(screen.getByText("Rating: 3/5")).toBeTruthy();
  const stars = screen.getAllByRole("button");
  expect(stars[0].textContent).toBe("\\u2605");
  expect(stars[2].textContent).toBe("\\u2605");
  expect(stars[3].textContent).toBe("\\u2606");
});

test("hovering previews without committing", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Rate 2 stars" }));
  fireEvent.mouseEnter(screen.getByRole("button", { name: "Rate 5 stars" }));
  const stars = screen.getAllByRole("button");
  expect(stars[4].textContent).toBe("\\u2605");
  expect(screen.getByText("Rating: 2/5")).toBeTruthy();
});

test("leaving the star container reverts the preview", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Rate 2 stars" }));
  fireEvent.mouseEnter(screen.getByRole("button", { name: "Rate 5 stars" }));
  fireEvent.mouseLeave(screen.getAllByRole("button")[0].parentElement);
  const stars = screen.getAllByRole("button");
  expect(stars[4].textContent).toBe("\\u2606");
  expect(stars[1].textContent).toBe("\\u2605");
  expect(screen.getByText("Rating: 2/5")).toBeTruthy();
});
`;

const accordionStarter = `import { useState, useRef } from "react";

const SECTIONS = [
  { title: "Section 1", content: "Content 1" },
  { title: "Section 2", content: "Content 2" },
  { title: "Section 3", content: "Content 3" },
];

export default function App() {
  // TODO: track which section is open (-1 = none).
  // - clicking a header opens it and closes any other
  // - clicking an already-open header closes it
  // - each header button needs aria-expanded ("true"/"false")
  // - ArrowDown / ArrowUp on a header moves focus to the
  //   next / previous header, wrapping around
  // - render a panel's content ONLY while it is open
  return (
    <div>
      {SECTIONS.map((section) => (
        <div key={section.title}>
          <h3>
            <button>{section.title}</button>
          </h3>
        </div>
      ))}
    </div>
  );
}
`;

const accordionSolution = `import { useState, useRef } from "react";

const SECTIONS = [
  { title: "Section 1", content: "Content 1" },
  { title: "Section 2", content: "Content 2" },
  { title: "Section 3", content: "Content 3" },
];

export default function App() {
  const [openIndex, setOpenIndex] = useState(-1);
  const refs = useRef([]);

  function onKeyDown(e, i) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      refs.current[(i + 1) % SECTIONS.length].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      refs.current[(i - 1 + SECTIONS.length) % SECTIONS.length].focus();
    }
  }

  return (
    <div>
      {SECTIONS.map((section, i) => (
        <div key={section.title}>
          <h3>
            <button
              ref={(el) => {
                refs.current[i] = el;
              }}
              aria-expanded={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {section.title}
            </button>
          </h3>
          {openIndex === i && <div role="region">{section.content}</div>}
        </div>
      ))}
    </div>
  );
}
`;

const accordionTests = `import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders three section header buttons", () => {
  render(<App />);
  expect(screen.getByRole("button", { name: "Section 1" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Section 2" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Section 3" })).toBeTruthy();
});

test("all panels start collapsed", () => {
  render(<App />);
  expect(screen.queryByText("Content 1")).toBeNull();
  expect(screen.queryByText("Content 2")).toBeNull();
  expect(screen.queryByText("Content 3")).toBeNull();
});

test("clicking a header opens its panel and sets aria-expanded", () => {
  render(<App />);
  const btn = screen.getByRole("button", { name: "Section 1" });
  fireEvent.click(btn);
  expect(screen.getByText("Content 1")).toBeTruthy();
  expect(btn.getAttribute("aria-expanded")).toBe("true");
});

test("opening one section closes the previously open one", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Section 1" }));
  fireEvent.click(screen.getByRole("button", { name: "Section 2" }));
  expect(screen.getByText("Content 2")).toBeTruthy();
  expect(screen.queryByText("Content 1")).toBeNull();
  const first = screen.getByRole("button", { name: "Section 1" });
  expect(first.getAttribute("aria-expanded")).toBe("false");
});

test("clicking an open header collapses it", () => {
  render(<App />);
  const btn = screen.getByRole("button", { name: "Section 2" });
  fireEvent.click(btn);
  fireEvent.click(btn);
  expect(screen.queryByText("Content 2")).toBeNull();
  expect(btn.getAttribute("aria-expanded")).toBe("false");
});

test("ArrowDown and ArrowUp move focus between headers", () => {
  render(<App />);
  const first = screen.getByRole("button", { name: "Section 1" });
  const second = screen.getByRole("button", { name: "Section 2" });
  first.focus();
  fireEvent.keyDown(first, { key: "ArrowDown" });
  expect(document.activeElement).toBe(second);
  fireEvent.keyDown(second, { key: "ArrowUp" });
  expect(document.activeElement).toBe(first);
});
`;

const todoListStarter = `import { useState } from "react";

export default function App() {
  // TODO:
  // - keep the draft text and the todos array in state
  // - "Add" appends a todo (ignore empty / whitespace-only input)
  //   and clears the input
  // - each todo renders: a checkbox (toggles done), its text, and
  //   a "Delete" button
  // - below the list, render the count of NOT-completed todos,
  //   exactly as:  <n> items left     e.g. "2 items left"
  return (
    <div>
      <input aria-label="New todo" />
      <button>Add</button>
      <ul></ul>
      <p>0 items left</p>
    </div>
  );
}
`;

const todoListSolution = `import { useState } from "react";

let nextId = 1;

export default function App() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const remaining = todos.filter((t) => !t.done).length;

  function addTodo() {
    const trimmed = text.trim();
    if (trimmed === "") return;
    setTodos(todos.concat([{ id: nextId++, text: trimmed, done: false }]));
    setText("");
  }

  function toggle(id) {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function remove(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  return (
    <div>
      <input
        aria-label="New todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggle(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => remove(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>{remaining + " items left"}</p>
    </div>
  );
}
`;

const todoListTests = `import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders input, Add button and zero count", () => {
  render(<App />);
  expect(screen.getByRole("textbox")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Add" })).toBeTruthy();
  expect(screen.getByText("0 items left")).toBeTruthy();
});

test("adds a todo and clears the input", () => {
  render(<App />);
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "Buy milk" } });
  fireEvent.click(screen.getByRole("button", { name: "Add" }));
  expect(screen.getByText("Buy milk")).toBeTruthy();
  expect(screen.getByText("1 items left")).toBeTruthy();
  expect(input.value).toBe("");
});

test("ignores empty and whitespace-only input", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Add" }));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "   " } });
  fireEvent.click(screen.getByRole("button", { name: "Add" }));
  expect(screen.getByText("0 items left")).toBeTruthy();
  expect(screen.queryAllByRole("checkbox").length).toBe(0);
});

test("toggling a checkbox updates the remaining count", () => {
  render(<App />);
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "Task A" } });
  fireEvent.click(screen.getByRole("button", { name: "Add" }));
  fireEvent.change(input, { target: { value: "Task B" } });
  fireEvent.click(screen.getByRole("button", { name: "Add" }));
  expect(screen.getByText("2 items left")).toBeTruthy();
  const boxes = screen.getAllByRole("checkbox");
  fireEvent.click(boxes[0]);
  expect(boxes[0].checked).toBe(true);
  expect(screen.getByText("1 items left")).toBeTruthy();
  fireEvent.click(boxes[0]);
  expect(screen.getByText("2 items left")).toBeTruthy();
});

test("deleting a todo removes it and updates the count", () => {
  render(<App />);
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "Task A" } });
  fireEvent.click(screen.getByRole("button", { name: "Add" }));
  fireEvent.change(input, { target: { value: "Task B" } });
  fireEvent.click(screen.getByRole("button", { name: "Add" }));
  fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
  expect(screen.queryByText("Task A")).toBeNull();
  expect(screen.getByText("Task B")).toBeTruthy();
  expect(screen.getByText("1 items left")).toBeTruthy();
});
`;

const fetchUserCardStarter = `import { useState } from "react";

// Provided fake API -- do not modify.
// Resolves after 100ms; rejects for id 0 with "User not found".
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 0) {
        reject(new Error("User not found"));
      } else {
        resolve({
          id: id,
          name: "User " + id,
          email: "user" + id + "@example.com",
        });
      }
    }, 100);
  });
}

export default function App() {
  // TODO: track idle / loading / error / success.
  // - initially render exactly:  No user loaded
  // - while a request is in flight:  Loading...
  // - on success: the user's name ("User 1") and email
  //   ("user1@example.com")
  // - on failure render exactly:  Error: User not found
  // - only ONE of those four states is visible at a time
  return (
    <div>
      <button>Load user 1</button>
      <button>Load user 2</button>
      <button>Load user 0</button>
      <p>No user loaded</p>
    </div>
  );
}
`;

const fetchUserCardSolution = `import { useState, useRef } from "react";

// Provided fake API -- do not modify.
// Resolves after 100ms; rejects for id 0 with "User not found".
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 0) {
        reject(new Error("User not found"));
      } else {
        resolve({
          id: id,
          name: "User " + id,
          email: "user" + id + "@example.com",
        });
      }
    }, 100);
  });
}

export default function App() {
  const [state, setState] = useState({ status: "idle", user: null, error: "" });
  const requestRef = useRef(0);

  function load(id) {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setState({ status: "loading", user: null, error: "" });
    fetchUser(id).then(
      (user) => {
        if (requestRef.current !== requestId) return; // stale response
        setState({ status: "success", user: user, error: "" });
      },
      (err) => {
        if (requestRef.current !== requestId) return; // stale response
        setState({ status: "error", user: null, error: err.message });
      }
    );
  }

  return (
    <div>
      <button onClick={() => load(1)}>Load user 1</button>
      <button onClick={() => load(2)}>Load user 2</button>
      <button onClick={() => load(0)}>Load user 0</button>
      {state.status === "idle" && <p>No user loaded</p>}
      {state.status === "loading" && <p>Loading...</p>}
      {state.status === "error" && <p>{"Error: " + state.error}</p>}
      {state.status === "success" && (
        <div>
          <h2>{state.user.name}</h2>
          <p>{state.user.email}</p>
        </div>
      )}
    </div>
  );
}
`;

const fetchUserCardTests = `import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

test("shows the empty state initially", () => {
  render(<App />);
  expect(screen.getByText("No user loaded")).toBeTruthy();
});

test("shows a loading state while fetching", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Load user 1" }));
  expect(screen.getByText("Loading...")).toBeTruthy();
  expect(screen.queryByText("No user loaded")).toBeNull();
});

test("renders the user on success", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Load user 1" }));
  await waitFor(() => expect(screen.getByText("User 1")).toBeTruthy());
  expect(screen.getByText("user1@example.com")).toBeTruthy();
  expect(screen.queryByText("Loading...")).toBeNull();
});

test("renders an error message for user 0", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Load user 0" }));
  await waitFor(() =>
    expect(screen.getByText("Error: User not found")).toBeTruthy()
  );
  expect(screen.queryByText("Loading...")).toBeNull();
});

test("recovers from an error on a new successful load", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Load user 0" }));
  await waitFor(() =>
    expect(screen.getByText("Error: User not found")).toBeTruthy()
  );
  fireEvent.click(screen.getByRole("button", { name: "Load user 2" }));
  await waitFor(() => expect(screen.getByText("User 2")).toBeTruthy());
  expect(screen.queryByText("Error: User not found")).toBeNull();
});

test("switching users replaces the card", async () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Load user 1" }));
  await waitFor(() => expect(screen.getByText("User 1")).toBeTruthy());
  fireEvent.click(screen.getByRole("button", { name: "Load user 2" }));
  expect(screen.getByText("Loading...")).toBeTruthy();
  await waitFor(() => expect(screen.getByText("User 2")).toBeTruthy());
  expect(screen.queryByText("User 1")).toBeNull();
});
`;

const debouncedSearchStarter = `import { useState, useEffect } from "react";

// Provided data -- do not modify.
const ITEMS = [
  "apple",
  "apricot",
  "banana",
  "blueberry",
  "cherry",
  "grape",
  "grapefruit",
  "kiwi",
  "mango",
  "peach",
];

export default function App() {
  // TODO:
  // - keep the raw input text AND the debounced query in state
  // - 300ms after the user stops typing, apply the query
  //   (case-insensitive substring match against ITEMS)
  // - while text and applied query differ, render exactly:
  //   Searching...
  // - otherwise render the matches as <li> items, or exactly
  //   "No results" when nothing matches
  return (
    <div>
      <input aria-label="Search" />
      <ul>
        {ITEMS.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
`;

const debouncedSearchSolution = `import { useState, useEffect } from "react";

// Provided data -- do not modify.
const ITEMS = [
  "apple",
  "apricot",
  "banana",
  "blueberry",
  "cherry",
  "grape",
  "grapefruit",
  "kiwi",
  "mango",
  "peach",
];

export default function App() {
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const pending = text !== query;

  useEffect(() => {
    const id = setTimeout(() => setQuery(text), 300);
    return () => clearTimeout(id);
  }, [text]);

  const results = ITEMS.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        aria-label="Search"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {pending ? (
        <p>Searching...</p>
      ) : results.length === 0 ? (
        <p>No results</p>
      ) : (
        <ul>
          {results.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
`;

const debouncedSearchTests = `import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

test("shows all ten items initially", () => {
  render(<App />);
  expect(screen.getAllByRole("listitem").length).toBe(10);
});

test("shows Searching... immediately after typing", () => {
  render(<App />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "ap" } });
  expect(screen.getByText("Searching...")).toBeTruthy();
});

test("filters after the debounce delay", async () => {
  render(<App />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "ap" } });
  await waitFor(() => expect(screen.queryByText("Searching...")).toBeNull());
  const items = screen.getAllByRole("listitem").map((li) => li.textContent);
  expect(items).toEqual(["apple", "apricot", "grape", "grapefruit"]);
});

test("shows No results when nothing matches", async () => {
  render(<App />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "zzz" } });
  await waitFor(() => expect(screen.getByText("No results")).toBeTruthy());
});

test("only the latest query applies after rapid typing", async () => {
  render(<App />);
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "a" } });
  fireEvent.change(input, { target: { value: "ban" } });
  await waitFor(() => expect(screen.queryByText("Searching...")).toBeNull());
  const items = screen.getAllByRole("listitem").map((li) => li.textContent);
  expect(items).toEqual(["banana"]);
});

test("matching is case-insensitive", async () => {
  render(<App />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "KIWI" } });
  await waitFor(() => expect(screen.queryByText("Searching...")).toBeNull());
  expect(screen.getByText("kiwi")).toBeTruthy();
});
`;

export const frontendQuestions: Question[] = [
  // ==========================================================
  // PART A — utility implementations (monaco)
  // ==========================================================
  {
    slug: "implement-debounce",
    title: "Implement Debounce",
    category: "frontend",
    difficulty: "easy",
    level: 2,
    pattern: "Closures & Timers",
    tags: ["closures", "timers", "higher-order-functions", "lodash"],
    timeLimitSeconds: 900,
    editorType: "monaco",
    functionName: "testDebounce",
    resultOrder: "strict",
    promptMd: `## Implement Debounce

Debouncing delays a function call until a burst of calls has gone quiet. It is how search boxes avoid firing a request on every keystroke: only after the user stops typing for N milliseconds does the real work run.

Implement a trailing-edge debounce:

~~~js
function debounce(fn, wait, clock) { ... }
~~~

### How this is tested (read carefully — it is fair, we promise)

Real timers are asynchronous, so the starter code ships a **pre-written virtual clock harness that you must not edit**. Your debounce receives a third argument, "clock", which mirrors the browser timer API:

- clock.setTimeout(callback, ms) — schedules a callback, returns an id
- clock.clearTimeout(id) — cancels a scheduled callback
- clock.now() — current virtual time in ms

The pre-written wrapper "testDebounce(wait, calls)" builds a debounced logger from YOUR debounce, then replays a scenario: each entry in "calls" is a pair [time, arg] meaning "at virtual time T, the debounced function is invoked with arg". Afterwards the clock is flushed far into the future, and the wrapper returns the log of underlying invocations as strings "time:arg".

### Requirements

1. Return a new function. Calling it must NOT invoke "fn" immediately.
2. "fn" runs only after "wait" ms have passed with no further calls (trailing edge).
3. Every new call cancels the previously scheduled invocation and restarts the timer.
4. When "fn" finally runs, it receives the arguments from the **latest** call.
5. Use ONLY the provided clock (clock.setTimeout / clock.clearTimeout), never the real setTimeout.

### Example

~~~js
// wait = 100, calls = [[0, "a"], [50, "b"]]
// t=0:  call with "a"  -> schedules fire at t=100
// t=50: call with "b"  -> cancels, reschedules fire at t=150
// t=150: fn("b") runs
// log: ["150:b"]
~~~
`,
    starterCode: `// ================================================================
// PRE-WRITTEN TEST HARNESS -- DO NOT EDIT
// A tiny virtual clock so debounce can be tested synchronously.
// ================================================================
function createClock() {
  var currentTime = 0;
  var tasks = [];
  var nextId = 1;
  return {
    now: function () { return currentTime; },
    setTimeout: function (cb, ms) {
      var id = nextId++;
      tasks.push({ id: id, time: currentTime + ms, cb: cb });
      return id;
    },
    clearTimeout: function (id) {
      tasks = tasks.filter(function (t) { return t.id !== id; });
    },
    advanceTo: function (target) {
      while (true) {
        var due = null;
        for (var i = 0; i < tasks.length; i++) {
          if (tasks[i].time <= target && (due === null || tasks[i].time < due.time)) {
            due = tasks[i];
          }
        }
        if (due === null) break;
        tasks = tasks.filter(function (t) { return t !== due; });
        currentTime = due.time;
        due.cb();
      }
      currentTime = target;
    }
  };
}

function testDebounce(wait, calls) {
  var clock = createClock();
  var log = [];
  var debounced = debounce(function (arg) {
    log.push(String(clock.now()) + ":" + String(arg));
  }, wait, clock);
  for (var i = 0; i < calls.length; i++) {
    clock.advanceTo(calls[i][0]);
    debounced(calls[i][1]);
  }
  clock.advanceTo(1000000);
  return log;
}

// ================================================================
// YOUR TASK: implement debounce below.
// Use clock.setTimeout / clock.clearTimeout instead of the globals.
// ================================================================
function debounce(fn, wait, clock) {
  // TODO: return a debounced version of fn.
  // Every call resets the timer; fn fires with the LATEST args
  // once "wait" ms pass with no new calls.
}
`,
    solutionCode: `// ================================================================
// PRE-WRITTEN TEST HARNESS -- DO NOT EDIT
// ================================================================
function createClock() {
  var currentTime = 0;
  var tasks = [];
  var nextId = 1;
  return {
    now: function () { return currentTime; },
    setTimeout: function (cb, ms) {
      var id = nextId++;
      tasks.push({ id: id, time: currentTime + ms, cb: cb });
      return id;
    },
    clearTimeout: function (id) {
      tasks = tasks.filter(function (t) { return t.id !== id; });
    },
    advanceTo: function (target) {
      while (true) {
        var due = null;
        for (var i = 0; i < tasks.length; i++) {
          if (tasks[i].time <= target && (due === null || tasks[i].time < due.time)) {
            due = tasks[i];
          }
        }
        if (due === null) break;
        tasks = tasks.filter(function (t) { return t !== due; });
        currentTime = due.time;
        due.cb();
      }
      currentTime = target;
    }
  };
}

function testDebounce(wait, calls) {
  var clock = createClock();
  var log = [];
  var debounced = debounce(function (arg) {
    log.push(String(clock.now()) + ":" + String(arg));
  }, wait, clock);
  for (var i = 0; i < calls.length; i++) {
    clock.advanceTo(calls[i][0]);
    debounced(calls[i][1]);
  }
  clock.advanceTo(1000000);
  return log;
}

// ================================================================
// SOLUTION
// ================================================================
function debounce(fn, wait, clock) {
  var timerId = null;
  return function () {
    var args = arguments;
    if (timerId !== null) {
      clock.clearTimeout(timerId);
    }
    timerId = clock.setTimeout(function () {
      timerId = null;
      fn.apply(null, args);
    }, wait);
  };
}
`,
    solutionMd: `## Solution

Debounce is a closure over two pieces of state: the pending timer id and (implicitly, via the inner callback) the latest arguments.

~~~js
function debounce(fn, wait, clock) {
  var timerId = null;
  return function () {
    var args = arguments;
    if (timerId !== null) {
      clock.clearTimeout(timerId);
    }
    timerId = clock.setTimeout(function () {
      timerId = null;
      fn.apply(null, args);
    }, wait);
  };
}
~~~

Every call does the same two things: cancel whatever was scheduled, then schedule a fresh invocation "wait" ms from now that closes over THIS call's arguments. Because each call replaces the timer, only the last call in a quiet-period-terminated burst ever fires, and it fires with the latest args — exactly the trailing-edge contract.
`,
    lessonMd: `### Intuition

Imagine an elevator door: every person who walks in resets the "close doors" countdown. The doors only close after nobody has entered for a few seconds. Debounce is that countdown for function calls — the work happens once, after the burst ends.

### Naive approach

A first attempt often just schedules a timeout on every call without cancelling the previous one. That produces one invocation per call, merely delayed — a "delay", not a debounce. The burst of 10 keystrokes still triggers 10 requests, all wrong.

### The refinement

The fix is remembering the pending timer in a closure. Each call clears the old timer before scheduling a new one. Now at most one invocation is ever pending, and it always carries the most recent arguments because the scheduled callback closes over the args of the call that created it.

### Why it works

The returned function and its timer id live in the same closure, so state survives between calls without any globals. The "cancel then reschedule" invariant guarantees the underlying function runs exactly once per burst, "wait" ms after the final call — the trailing edge. Injecting a clock object (instead of hard-coding setTimeout) is the same dependency-injection trick lodash and testing libraries use: time becomes a parameter, so behavior is deterministic and testable.

### Performance notes

Each call is O(1): one clear, one schedule. The real win is downstream — debouncing a 300ms window over keystrokes can turn dozens of API calls into one.

### Common pitfalls

- Forgetting to clear the previous timer (the delay-not-debounce bug).
- Capturing the FIRST call's arguments instead of the latest.
- Resetting shared state incorrectly so a second burst never fires.
- Using an arrow-vs-this mismatch when methods are debounced (preserve this and args in real implementations).

### Transferable pattern

"Closure over a timer id + cancel-and-reschedule" is the backbone of debounce, throttle, auto-save, tooltip delays, and retry backoff. Once you can hold mutable scheduling state in a closure, an entire family of rate-control utilities becomes a five-line exercise.
`,
    testCases: [
      { input: [100, [[0, "a"]]], expected: ["100:a"], hidden: false, label: "single call fires after wait" },
      { input: [100, [[0, "a"], [50, "b"]]], expected: ["150:b"], hidden: false, label: "second call resets timer" },
      { input: [100, [[0, "a"], [200, "b"]]], expected: ["100:a", "300:b"], hidden: false, label: "spaced calls fire separately" },
      { input: [100, [[0, "a"], [30, "b"], [60, "c"], [300, "d"]]], expected: ["160:c", "400:d"], hidden: true, label: "burst then late call" },
      { input: [100, [[0, "a"], [100, "b"]]], expected: ["100:a", "200:b"], hidden: true, label: "call exactly at the boundary" },
      { input: [50, [[0, 1], [10, 2], [20, 3], [30, 4], [40, 5]]], expected: ["90:5"], hidden: true, label: "rapid burst collapses to last" },
      { input: [100, [[0, "x"], [150, "y"], [210, "z"], [500, "w"]]], expected: ["100:x", "310:z", "600:w"], hidden: true, label: "three separate windows" },
      { input: [100, []], expected: [], hidden: true, label: "never called" },
    ],
  },
  {
    slug: "implement-throttle",
    title: "Implement Throttle",
    category: "frontend",
    difficulty: "easy",
    level: 2,
    pattern: "Closures & Timers",
    tags: ["closures", "timers", "higher-order-functions", "rate-limiting"],
    timeLimitSeconds: 900,
    editorType: "monaco",
    functionName: "testThrottle",
    resultOrder: "strict",
    promptMd: `## Implement Throttle

Throttling guarantees a function runs at most once per time window, no matter how often it is called. It is the classic tool for scroll and resize handlers: react immediately, then at a steady maximum rate.

Implement a leading + trailing throttle:

~~~js
function throttle(fn, wait, clock) { ... }
~~~

### How this is tested

Same virtual-clock setup as the debounce kata: the starter ships a **pre-written harness you must not edit**. Your throttle receives a "clock" argument with:

- clock.setTimeout(callback, ms) — schedule, returns an id
- clock.clearTimeout(id) — cancel
- clock.now() — current virtual time in ms

The wrapper "testThrottle(wait, calls)" replays [time, arg] pairs against your throttled logger, flushes the clock, and returns the invocation log as "time:arg" strings.

### Requirements

1. **Leading edge**: if no invocation happened in the last "wait" ms, a call runs "fn" immediately (synchronously).
2. **Trailing edge**: calls arriving inside the cooldown window are coalesced — one invocation fires when the window ends, using the arguments of the **latest** call in the window.
3. After the trailing invocation, a new cooldown of "wait" ms starts from that invocation.
4. At most one invocation per "wait" ms window, ever.
5. Use ONLY the provided clock, never the real setTimeout.

### Example

~~~js
// wait = 100, calls = [[0, "a"], [30, "b"], [60, "c"]]
// t=0:  "a" runs immediately (leading edge)
// t=30, t=60: inside cooldown -> coalesced
// t=100: trailing edge fires with "c" (latest args)
// log: ["0:a", "100:c"]
~~~
`,
    starterCode: `// ================================================================
// PRE-WRITTEN TEST HARNESS -- DO NOT EDIT
// A tiny virtual clock so throttle can be tested synchronously.
// ================================================================
function createClock() {
  var currentTime = 0;
  var tasks = [];
  var nextId = 1;
  return {
    now: function () { return currentTime; },
    setTimeout: function (cb, ms) {
      var id = nextId++;
      tasks.push({ id: id, time: currentTime + ms, cb: cb });
      return id;
    },
    clearTimeout: function (id) {
      tasks = tasks.filter(function (t) { return t.id !== id; });
    },
    advanceTo: function (target) {
      while (true) {
        var due = null;
        for (var i = 0; i < tasks.length; i++) {
          if (tasks[i].time <= target && (due === null || tasks[i].time < due.time)) {
            due = tasks[i];
          }
        }
        if (due === null) break;
        tasks = tasks.filter(function (t) { return t !== due; });
        currentTime = due.time;
        due.cb();
      }
      currentTime = target;
    }
  };
}

function testThrottle(wait, calls) {
  var clock = createClock();
  var log = [];
  var throttled = throttle(function (arg) {
    log.push(String(clock.now()) + ":" + String(arg));
  }, wait, clock);
  for (var i = 0; i < calls.length; i++) {
    clock.advanceTo(calls[i][0]);
    throttled(calls[i][1]);
  }
  clock.advanceTo(1000000);
  return log;
}

// ================================================================
// YOUR TASK: implement throttle below.
// Leading edge fires immediately; calls during the cooldown are
// coalesced into ONE trailing invocation with the latest args.
// ================================================================
function throttle(fn, wait, clock) {
  // TODO
}
`,
    solutionCode: `// ================================================================
// PRE-WRITTEN TEST HARNESS -- DO NOT EDIT
// ================================================================
function createClock() {
  var currentTime = 0;
  var tasks = [];
  var nextId = 1;
  return {
    now: function () { return currentTime; },
    setTimeout: function (cb, ms) {
      var id = nextId++;
      tasks.push({ id: id, time: currentTime + ms, cb: cb });
      return id;
    },
    clearTimeout: function (id) {
      tasks = tasks.filter(function (t) { return t.id !== id; });
    },
    advanceTo: function (target) {
      while (true) {
        var due = null;
        for (var i = 0; i < tasks.length; i++) {
          if (tasks[i].time <= target && (due === null || tasks[i].time < due.time)) {
            due = tasks[i];
          }
        }
        if (due === null) break;
        tasks = tasks.filter(function (t) { return t !== due; });
        currentTime = due.time;
        due.cb();
      }
      currentTime = target;
    }
  };
}

function testThrottle(wait, calls) {
  var clock = createClock();
  var log = [];
  var throttled = throttle(function (arg) {
    log.push(String(clock.now()) + ":" + String(arg));
  }, wait, clock);
  for (var i = 0; i < calls.length; i++) {
    clock.advanceTo(calls[i][0]);
    throttled(calls[i][1]);
  }
  clock.advanceTo(1000000);
  return log;
}

// ================================================================
// SOLUTION
// ================================================================
function throttle(fn, wait, clock) {
  var lastInvoke = -Infinity;
  var timerId = null;
  var pendingArgs = null;

  function invoke(args) {
    lastInvoke = clock.now();
    fn.apply(null, args);
  }

  return function () {
    var args = arguments;
    var now = clock.now();
    if (timerId === null && now - lastInvoke >= wait) {
      invoke(args);
    } else {
      pendingArgs = args;
      if (timerId === null) {
        timerId = clock.setTimeout(function () {
          timerId = null;
          var toUse = pendingArgs;
          pendingArgs = null;
          invoke(toUse);
        }, wait - (now - lastInvoke));
      }
    }
  };
}
`,
    solutionMd: `## Solution

Throttle tracks the timestamp of the last real invocation plus (at most) one scheduled trailing call.

~~~js
function throttle(fn, wait, clock) {
  var lastInvoke = -Infinity;
  var timerId = null;
  var pendingArgs = null;

  function invoke(args) {
    lastInvoke = clock.now();
    fn.apply(null, args);
  }

  return function () {
    var args = arguments;
    var now = clock.now();
    if (timerId === null && now - lastInvoke >= wait) {
      invoke(args);              // leading edge: cooldown expired
    } else {
      pendingArgs = args;        // remember the latest args
      if (timerId === null) {    // schedule ONE trailing call
        timerId = clock.setTimeout(function () {
          timerId = null;
          var toUse = pendingArgs;
          pendingArgs = null;
          invoke(toUse);
        }, wait - (now - lastInvoke));
      }
    }
  };
}
~~~

A call outside the cooldown fires immediately (leading edge). A call inside the cooldown just updates "pendingArgs"; the first such call also schedules a timer for the moment the window ends. When it fires, the latest arguments are used and the cooldown restarts from that trailing invocation — which is what keeps the rate at one invocation per window.
`,
    lessonMd: `### Intuition

Debounce waits for silence; throttle enforces a metronome. Think of a nightclub bouncer who lets one person in, then holds the door for 100ms no matter how many people queue — and when the window opens, admits the person at the FRONT of the door right now (the latest caller).

### Naive approach

The common first attempt only implements the leading edge: record the last call time, ignore anything sooner than "wait". That drops information — if a scroll handler updates a position readout, ignoring the final event leaves the UI showing a stale value forever. The trailing edge exists precisely so the last state in a burst is eventually rendered.

### The refinement

Track three things in the closure: when the function last actually ran (lastInvoke), whether a trailing call is scheduled (timerId), and the freshest arguments (pendingArgs). Outside the cooldown with no timer pending, run immediately. Inside it, overwrite pendingArgs and make sure exactly one timer is scheduled for the moment the window closes.

### Why it works

The invariant is: at any moment there is at most one scheduled invocation, and lastInvoke advances only when the function truly runs. Scheduling the trailing call at "wait - elapsed" lands it exactly at the window boundary, and because invoke() updates lastInvoke, the next window is measured from the trailing call — so a steady stream of calls produces a steady tick of invocations, never bunching.

### Performance notes

O(1) per call. In a browser, throttling a scroll handler from ~60 events/second to 10 invocations/second is often the difference between jank and smoothness.

### Common pitfalls

- Leading-only throttles that lose the last event of a burst.
- Scheduling a full "wait" for the trailing call instead of the remaining time.
- Forgetting to restart the cooldown after the trailing invocation, which lets the next call fire instantly and violate the rate limit.
- Using stale args (first-in-window) instead of the latest.

### Transferable pattern

The "timestamp + at-most-one-timer" state machine also powers requestAnimationFrame batching, API rate limiters, and log samplers. Learn to name the states (idle, cooling-down, cooling-down-with-pending) and the code writes itself.
`,
    testCases: [
      { input: [100, [[0, "a"]]], expected: ["0:a"], hidden: false, label: "leading edge fires immediately" },
      { input: [100, [[0, "a"], [50, "b"]]], expected: ["0:a", "100:b"], hidden: false, label: "call in cooldown fires on trailing edge" },
      { input: [100, [[0, "a"], [200, "b"]]], expected: ["0:a", "200:b"], hidden: false, label: "call after cooldown fires immediately" },
      { input: [100, [[0, "a"], [30, "b"], [60, "c"]]], expected: ["0:a", "100:c"], hidden: true, label: "burst coalesces to latest args" },
      { input: [100, [[0, 1], [20, 2], [40, 3], [110, 4], [130, 5]]], expected: ["0:1", "100:3", "200:5"], hidden: true, label: "steady stream ticks once per window" },
      { input: [100, [[0, "a"], [100, "b"]]], expected: ["0:a", "100:b"], hidden: true, label: "call exactly at window boundary" },
      { input: [100, [[0, "a"], [10, "b"], [10, "c"]]], expected: ["0:a", "100:c"], hidden: true, label: "same-tick calls keep latest" },
      { input: [100, []], expected: [], hidden: true, label: "never called" },
    ],
  },
  {
    slug: "deep-clone",
    title: "Deep Clone",
    category: "frontend",
    difficulty: "medium",
    level: 3,
    pattern: "Recursion",
    tags: ["recursion", "objects", "arrays", "immutability"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "testDeepClone",
    resultOrder: "strict",
    promptMd: `## Deep Clone

Implement a deep clone: a copy of a value where no object or array is shared with the original, at any depth.

~~~js
function deepClone(value) { ... }
~~~

### Scope

Handle exactly these value kinds (this is all the tests use):

- Primitives: numbers, strings, booleans, null, undefined — return as-is.
- Plain arrays — clone recursively.
- Plain objects — clone every own enumerable key recursively.

You do NOT need to handle Dates, Maps, Sets, RegExps, functions, class instances, symbols, or circular references. Say so in an interview; here the tests simply never pass them.

### How this is tested

The starter includes a **pre-written wrapper you must not edit**. "testDeepClone(value)" calls your deepClone, then walks the original and the clone in parallel checking whether ANY object or array reference is shared. It returns:

~~~js
{ clone: <your clone>, sharedReferences: <boolean> }
~~~

So "return value" fails (top-level reference shared), and a shallow spread fails on nested data (inner references shared). Expected results always have sharedReferences: false and a clone deep-equal to the input.

### Requirements

1. The clone must deep-equal the input.
2. No array/object reference may be shared between input and clone at any depth.
3. Distinguish arrays from plain objects (an array must clone to an array).
4. Do not use structuredClone. JSON.parse(JSON.stringify(...)) is also off-limits — it silently drops undefined values and is the answer interviewers explicitly probe past.
`,
    starterCode: `// ================================================================
// PRE-WRITTEN TEST HARNESS -- DO NOT EDIT
// Verifies your clone is deep-equal AND shares no references.
// ================================================================
function sharesAnyReference(a, b) {
  if (a === null || typeof a !== "object") return false;
  if (a === b) return true;
  if (b === null || typeof b !== "object") return false;
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return false;
    for (var i = 0; i < a.length; i++) {
      if (sharesAnyReference(a[i], b[i])) return true;
    }
    return false;
  }
  var keys = Object.keys(a);
  for (var j = 0; j < keys.length; j++) {
    if (sharesAnyReference(a[keys[j]], b[keys[j]])) return true;
  }
  return false;
}

function testDeepClone(value) {
  var clone = deepClone(value);
  return { clone: clone, sharedReferences: sharesAnyReference(value, clone) };
}

// ================================================================
// YOUR TASK: implement deepClone below.
// Handle primitives, null, arrays and plain objects (recursively).
// No structuredClone, no JSON round-trip.
// ================================================================
function deepClone(value) {
  // TODO
}
`,
    solutionCode: `// ================================================================
// PRE-WRITTEN TEST HARNESS -- DO NOT EDIT
// ================================================================
function sharesAnyReference(a, b) {
  if (a === null || typeof a !== "object") return false;
  if (a === b) return true;
  if (b === null || typeof b !== "object") return false;
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return false;
    for (var i = 0; i < a.length; i++) {
      if (sharesAnyReference(a[i], b[i])) return true;
    }
    return false;
  }
  var keys = Object.keys(a);
  for (var j = 0; j < keys.length; j++) {
    if (sharesAnyReference(a[keys[j]], b[keys[j]])) return true;
  }
  return false;
}

function testDeepClone(value) {
  var clone = deepClone(value);
  return { clone: clone, sharedReferences: sharesAnyReference(value, clone) };
}

// ================================================================
// SOLUTION
// ================================================================
function deepClone(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    var arr = [];
    for (var i = 0; i < value.length; i++) {
      arr.push(deepClone(value[i]));
    }
    return arr;
  }
  var out = {};
  var keys = Object.keys(value);
  for (var j = 0; j < keys.length; j++) {
    out[keys[j]] = deepClone(value[keys[j]]);
  }
  return out;
}
`,
    solutionMd: `## Solution

Three cases, applied recursively.

~~~js
function deepClone(value) {
  if (value === null || typeof value !== "object") {
    return value;                       // primitives (and null) are immutable
  }
  if (Array.isArray(value)) {
    var arr = [];
    for (var i = 0; i < value.length; i++) {
      arr.push(deepClone(value[i]));
    }
    return arr;
  }
  var out = {};
  var keys = Object.keys(value);
  for (var j = 0; j < keys.length; j++) {
    out[keys[j]] = deepClone(value[keys[j]]);
  }
  return out;
}
~~~

The base case is anything that is not an object: primitives are copied by value in JavaScript, so returning them directly is already a "clone". The two recursive cases build a brand-new container — a fresh array or a fresh object — and fill it with deep clones of each element/value. Because every container encountered is replaced by a new one, no reference from the original can survive into the result.

Note the order of checks: the null check must come before typeof, because typeof null is "object" — the most famous footgun in the language.
`,
    lessonMd: `### Intuition

A deep clone is a structural rebuild: walk the value like a tree, and every time you meet a container (object or array), construct a new empty container and recursively copy its contents. Leaves (primitives) can be reused because they are immutable — nobody can mutate the number 42 out from under you.

### Naive approach

Two tempting shortcuts fail in different ways. A shallow copy (spread, Object.assign) duplicates only the top layer — mutate a nested object in the copy and the original changes too. The JSON round-trip is deeper but lossy: undefined properties vanish, and in general Dates become strings, Maps become empty objects, and circular structures throw. Interviewers usually ask this question specifically to see whether you know WHY the JSON trick is wrong.

### The refinement

Write the recursion explicitly with three branches: not-an-object (return as-is), array (map recursively into a new array), plain object (copy each own key recursively into a new object). The null-before-typeof ordering matters because typeof null is "object".

### Why it works

The recursion mirrors the data's own shape, so termination follows from the input being a finite tree. Correctness follows from the invariant that every container in the output is freshly allocated: shared references are impossible because the only reused values are primitives, which cannot be mutated.

### Complexity

O(n) time and O(n) space where n is the total number of nodes; recursion depth equals nesting depth (a 10,000-level-deep structure would overflow the stack — the iterative stack-based variant fixes that, and is a good follow-up to mention).

### Common pitfalls

- typeof null === "object" — check null first.
- Treating arrays as plain objects (you would get an object with numeric keys, not an array).
- Forgetting that the recursion must apply to VALUES of object keys, not the keys themselves.
- Not mentioning unsupported types; production clones (structuredClone, lodash cloneDeep) also track visited nodes to survive cycles.

### Transferable pattern

Structure-directed recursion — "switch on the kind of node, rebuild containers, reuse leaves" — is the same skeleton as JSON serializers, tree diffing, immutable updates, and AST transforms.
`,
    testCases: [
      { input: [42], expected: { clone: 42, sharedReferences: false }, hidden: false, label: "number primitive" },
      { input: [{ a: 1, b: 2 }], expected: { clone: { a: 1, b: 2 }, sharedReferences: false }, hidden: false, label: "flat object" },
      { input: [[1, [2, [3]]]], expected: { clone: [1, [2, [3]]], sharedReferences: false }, hidden: false, label: "nested arrays" },
      { input: [null], expected: { clone: null, sharedReferences: false }, hidden: true, label: "null" },
      { input: ["hello"], expected: { clone: "hello", sharedReferences: false }, hidden: true, label: "string primitive" },
      { input: [true], expected: { clone: true, sharedReferences: false }, hidden: true, label: "boolean primitive" },
      { input: [{ a: { b: { c: [1, 2, { d: null }] } } }], expected: { clone: { a: { b: { c: [1, 2, { d: null }] } } }, sharedReferences: false }, hidden: true, label: "deep mixed nesting" },
      { input: [[]], expected: { clone: [], sharedReferences: false }, hidden: true, label: "empty array" },
      { input: [{}], expected: { clone: {}, sharedReferences: false }, hidden: true, label: "empty object" },
      { input: [{ list: [{ id: 1 }, { id: 2 }], meta: null }], expected: { clone: { list: [{ id: 1 }, { id: 2 }], meta: null }, sharedReferences: false }, hidden: true, label: "array of objects with null" },
    ],
  },
  {
    slug: "implement-memoize",
    title: "Implement Memoize",
    category: "frontend",
    difficulty: "medium",
    level: 3,
    pattern: "Closures & Caching",
    tags: ["closures", "caching", "higher-order-functions", "performance"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "testMemoize",
    resultOrder: "strict",
    promptMd: `## Implement Memoize

Memoization trades memory for speed: cache a function's results so repeated calls with the same arguments skip the computation entirely.

~~~js
function memoize(fn) { ... }
~~~

### Requirements

1. Return a new function with the same behavior as "fn".
2. On a cache hit (same arguments seen before), return the cached result WITHOUT calling "fn" again.
3. Support any number of arguments. Use JSON.stringify of the arguments array as the cache key (arguments here are always JSON-safe numbers).
4. Different argument lists must not collide: calling with (1) then (1, 2) are two different cache entries.
5. Each memoized function gets its own private cache (a closure, not a global).

### How this is tested

The starter has a **pre-written wrapper you must not edit**. "testMemoize(callsList)" memoizes a counting "add" function (sums its arguments and increments a counter each time it actually runs), replays every argument list in "callsList" through your memoized version, and returns:

~~~js
[resultsArray, underlyingCallCount]
~~~

### Example

~~~js
// callsList = [[1, 2], [1, 2], [2, 1]]
// -> results [3, 3, 3], but add only ran twice
// returns [[3, 3, 3], 2]
~~~
`,
    starterCode: `// ================================================================
// PRE-WRITTEN TEST HARNESS -- DO NOT EDIT
// Counts how many times the underlying function really runs.
// ================================================================
function testMemoize(callsList) {
  var count = 0;
  function add() {
    count++;
    var sum = 0;
    for (var i = 0; i < arguments.length; i++) {
      sum += arguments[i];
    }
    return sum;
  }
  var memoized = memoize(add);
  var results = [];
  for (var i = 0; i < callsList.length; i++) {
    results.push(memoized.apply(null, callsList[i]));
  }
  return [results, count];
}

// ================================================================
// YOUR TASK: implement memoize below.
// Cache key: JSON.stringify of the arguments array.
// ================================================================
function memoize(fn) {
  // TODO
}
`,
    solutionCode: `// ================================================================
// PRE-WRITTEN TEST HARNESS -- DO NOT EDIT
// ================================================================
function testMemoize(callsList) {
  var count = 0;
  function add() {
    count++;
    var sum = 0;
    for (var i = 0; i < arguments.length; i++) {
      sum += arguments[i];
    }
    return sum;
  }
  var memoized = memoize(add);
  var results = [];
  for (var i = 0; i < callsList.length; i++) {
    results.push(memoized.apply(null, callsList[i]));
  }
  return [results, count];
}

// ================================================================
// SOLUTION
// ================================================================
function memoize(fn) {
  var cache = {};
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var key = JSON.stringify(args);
    if (Object.prototype.hasOwnProperty.call(cache, key)) {
      return cache[key];
    }
    var result = fn.apply(null, args);
    cache[key] = result;
    return result;
  };
}
`,
    solutionMd: `## Solution

A closure holds a private cache object; the serialized arguments array is the key.

~~~js
function memoize(fn) {
  var cache = {};
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var key = JSON.stringify(args);
    if (Object.prototype.hasOwnProperty.call(cache, key)) {
      return cache[key];
    }
    var result = fn.apply(null, args);
    cache[key] = result;
    return result;
  };
}
~~~

JSON.stringify([1, 2]) and JSON.stringify([1]) produce different strings, so argument lists of different lengths never collide. The hasOwnProperty check (rather than a truthiness check) matters in general so cached falsy results like 0 still count as hits — and it also sidesteps inherited keys like "constructor".
`,
    lessonMd: `### Intuition

If a function is pure — same inputs always produce the same output — recomputing is pure waste. Memoize wraps the function with a lookup table: "have I seen these exact arguments before? Then hand back the old answer."

### Naive approach

A first cut caches only a single argument, often using the argument itself as an object key. That breaks in two ways: multi-argument calls collide (only the first arg is keyed), and object keys are stringified, so different values can map to the same slot. Another classic bug is checking "if (cache[key])" — a cached result of 0, empty string, or false looks like a miss and the function reruns every time.

### The refinement

Serialize the WHOLE arguments array with JSON.stringify to get a canonical string key, and test membership with hasOwnProperty instead of truthiness. Keep the cache in the closure so each memoized function is independent and the cache is invisible to callers.

### Why it works

JSON.stringify of the argument array is injective enough for JSON-safe inputs: different lengths or different values produce different strings, so (1) and (1, 2) get distinct entries. The closure guarantees the cache lives exactly as long as the memoized function, with no global pollution and no cross-contamination between two memoized functions.

### Complexity

Each call is O(k) for serializing k arguments, then an O(1) average hash lookup. Memory grows with the number of DISTINCT argument lists ever seen — unbounded by default. Production caches bound this with LRU eviction; React's useMemo keeps only the latest entry (cache size one).

### Common pitfalls

- Truthiness checks that treat cached falsy values as misses.
- Sharing one cache across all memoized functions.
- JSON key limitations worth naming in an interview: functions and undefined do not serialize, object key order matters, and two structurally-equal-but-differently-ordered objects miss the cache. A Map keyed on a nested structure (or a trie of per-argument Maps, like lodash and reselect) is the robust upgrade.
- Memoizing IMPURE functions — now you have a correctness bug, not an optimization.

### Transferable pattern

"Wrap a function, keep private state in a closure, short-circuit on a key" is the same shape as debounce, once, and rate limiters — and memoization itself reappears as dynamic programming, HTTP caching, and React render memoization.
`,
    testCases: [
      { input: [[[1, 2], [1, 2]]], expected: [[3, 3], 1], hidden: false, label: "repeat call hits cache" },
      { input: [[[1, 2], [2, 1]]], expected: [[3, 3], 2], hidden: false, label: "argument order matters" },
      { input: [[[1], [1], [2], [1]]], expected: [[1, 1, 2, 1], 2], hidden: false, label: "single-arg mix" },
      { input: [[[1, 2, 3], [1, 2, 3], [1, 2, 3]]], expected: [[6, 6, 6], 1], hidden: true, label: "three-arg repeats" },
      { input: [[]], expected: [[], 0], hidden: true, label: "no calls" },
      { input: [[[0], [0, 0], [0, 0, 0]]], expected: [[0, 0, 0], 3], hidden: true, label: "different arities never collide" },
      { input: [[[5], [5], [5, 5], [5], [5, 5]]], expected: [[5, 5, 10, 5, 10], 2], hidden: true, label: "interleaved hits and misses" },
      { input: [[[10, 20], [30], [10, 20], [30], [40]]], expected: [[30, 30, 30, 30, 40], 3], hidden: true, label: "equal results, different keys" },
    ],
  },
  {
    slug: "flatten-array",
    title: "Flatten Array",
    category: "frontend",
    difficulty: "medium",
    level: 3,
    pattern: "Recursion",
    tags: ["recursion", "arrays", "polyfill"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "flatten",
    resultOrder: "strict",
    promptMd: `## Flatten Array

Implement a function that flattens an arbitrarily nested array of values into a single flat array, preserving left-to-right order.

~~~js
function flatten(arr) { ... }
~~~

### Requirements

1. Flatten to ANY depth (unlike the default of the built-in flat, which is depth 1).
2. Do NOT use Array.prototype.flat or Array.prototype.flatMap — you are writing the polyfill.
3. Preserve element order.
4. Non-array values (numbers, strings, null, booleans, objects) are leaves and pass through unchanged.
5. Empty nested arrays contribute nothing.
6. Return a NEW array; do not mutate the input.

### Examples

~~~js
flatten([1, [2, [3, [4]]]])   // [1, 2, 3, 4]
flatten([1, [], [2, []], 3])  // [1, 2, 3]
flatten([])                   // []
flatten(["a", ["b", ["c"]]])  // ["a", "b", "c"]
~~~
`,
    starterCode: `// Flatten an arbitrarily nested array into a flat array.
// Do NOT use Array.prototype.flat / flatMap.
function flatten(arr) {
  // TODO
}
`,
    solutionCode: `function flatten(arr) {
  var out = [];
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    if (Array.isArray(item)) {
      var inner = flatten(item);
      for (var j = 0; j < inner.length; j++) {
        out.push(inner[j]);
      }
    } else {
      out.push(item);
    }
  }
  return out;
}
`,
    solutionMd: `## Solution

Walk the array; recurse into arrays, push everything else.

~~~js
function flatten(arr) {
  var out = [];
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    if (Array.isArray(item)) {
      var inner = flatten(item);
      for (var j = 0; j < inner.length; j++) {
        out.push(inner[j]);
      }
    } else {
      out.push(item);
    }
  }
  return out;
}
~~~

Each element is either a leaf (pushed directly) or a sub-array (flattened recursively, then its elements appended). Order is preserved because the loop visits elements left to right and appends recursive results in place.

An equally good iterative version uses an explicit stack: push the array's elements in reverse, pop one at a time, and either emit it or push its contents back. That variant survives arbitrarily deep nesting without risking stack overflow — worth mentioning as a follow-up.
`,
    lessonMd: `### Intuition

A nested array is a tree whose leaves are the values and whose internal nodes are arrays. Flattening is just an in-order traversal that collects leaves. Seen that way, the solution is nothing more than "walk the tree, emit leaves in the order visited."

### Naive approach

People sometimes reach for repeated single-level flattens in a loop ("while anything is still an array, spread one level"). It works but does multiple passes over the data — O(n * depth) — and reads like a workaround. Others try toString/split hacks, which destroy types (everything becomes a string) and break on strings containing commas.

### The refinement

Recurse directly: for each element, if it is an array, flatten it and append the results; otherwise append the element. One pass over every node, order preserved by construction. The single decision point — Array.isArray — is the correct test (typeof reports "object" for arrays, and instanceof breaks across iframes/realms).

### Why it works

The recursion terminates because each recursive call operates on a strictly smaller subtree of a finite structure. Correctness is inductive: a leaf contributes itself; an array contributes the flattening of its children in order; concatenating those in the loop order yields the left-to-right sequence of all leaves.

### Complexity

O(n) time in the total number of nodes (each visited once). Space is O(n) for the output plus O(d) recursion stack where d is the maximum nesting depth. If d can be huge, convert to an explicit-stack iterative version — same logic, heap-allocated stack, no overflow.

### Common pitfalls

- Using typeof item === "object" to detect arrays (also true for null and plain objects).
- Forgetting to append the RESULT of the recursive call and instead pushing the sub-array itself.
- Mutating the input (e.g. splicing sub-arrays inline) — callers rarely forgive that.
- Concatenating with out = out.concat(inner) in a loop, which is O(n²) in pathological cases; pushing elements keeps it linear.

### Transferable pattern

"Recurse on containers, emit leaves" is the traversal skeleton behind DOM walking, file-tree listing, JSON schema visitors, and flattening component trees. If you can write flatten cold, you can write all of them.
`,
    testCases: [
      { input: [[1, [2, [3, [4]]]]], expected: [1, 2, 3, 4], hidden: false, label: "deeply nested numbers" },
      { input: [[1, 2, 3]], expected: [1, 2, 3], hidden: false, label: "already flat" },
      { input: [[]], expected: [], hidden: false, label: "empty array" },
      { input: [[1, [], [2, []], 3]], expected: [1, 2, 3], hidden: true, label: "empty nested arrays vanish" },
      { input: [["a", ["b", ["c", ["d"]]]]], expected: ["a", "b", "c", "d"], hidden: true, label: "nested strings" },
      { input: [[[[[[42]]]]]], expected: [42], hidden: true, label: "single value, five levels deep" },
      { input: [[[], [[]], [[[]]]]], expected: [], hidden: true, label: "only empty arrays" },
      { input: [[1, ["two", [3, [null, [true]]]], false]], expected: [1, "two", 3, null, true, false], hidden: true, label: "mixed types incl. null" },
      { input: [[{ a: 1 }, [{ b: 2 }]]], expected: [{ a: 1 }, { b: 2 }], hidden: true, label: "objects are leaves" },
    ],
  },
  {
    slug: "promise-all-polyfill",
    title: "Promise.all Polyfill",
    category: "frontend",
    difficulty: "medium",
    level: 4,
    pattern: "Async Coordination",
    tags: ["promises", "async", "polyfill", "concurrency"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "testPromiseAll",
    resultOrder: "strict",
    promptMd: `## Promise.all Polyfill

Implement Promise.all from scratch:

~~~js
function promiseAll(promises) { ... }
~~~

It takes an array (of promises and/or plain values) and returns a single promise that:

1. **Fulfills** with an array of all resolved values, in the SAME ORDER as the input array — even if the promises settle out of order.
2. **Rejects** as soon as ANY input promise rejects, with that first rejection reason.
3. Fulfills immediately with an empty array for an empty input.
4. Treats non-promise values as already-resolved promises (hint: Promise.resolve wraps anything).
5. Does not use Promise.all / allSettled / any / race.

### How this is tested

The starter includes a **pre-written async wrapper you must not edit**. "testPromiseAll(specs)" builds an input array from a spec list, calls YOUR promiseAll, awaits the outcome, and returns a plain object the grader can compare:

- ["resolve", v] — an immediately resolved promise of v
- ["reject", r] — an immediately rejected promise with reason r
- ["value", v] — a raw non-promise value passed straight through
- ["resolveAfter", v, ms] — resolves with v after ms milliseconds
- ["rejectAfter", r, ms] — rejects with r after ms milliseconds

The wrapper returns { status: "fulfilled", value: [...] } or { status: "rejected", value: reason }.

### Example

~~~js
// specs: [["resolveAfter", "slow", 20], ["resolve", "fast"]]
// "fast" settles first, but order follows the INPUT:
// -> { status: "fulfilled", value: ["slow", "fast"] }
~~~
`,
    starterCode: `// ================================================================
// PRE-WRITTEN TEST HARNESS -- DO NOT EDIT
// Builds promises from a spec list and awaits your promiseAll.
// ================================================================
function buildFromSpec(spec) {
  var kind = spec[0];
  if (kind === "resolve") return Promise.resolve(spec[1]);
  if (kind === "reject") return Promise.reject(spec[1]);
  if (kind === "resolveAfter") {
    return new Promise(function (resolve) {
      setTimeout(function () { resolve(spec[1]); }, spec[2]);
    });
  }
  if (kind === "rejectAfter") {
    return new Promise(function (_resolve, reject) {
      setTimeout(function () { reject(spec[1]); }, spec[2]);
    });
  }
  return spec[1]; // "value": raw non-promise value
}

function testPromiseAll(specs) {
  var inputs = specs.map(buildFromSpec);
  return promiseAll(inputs).then(
    function (value) { return { status: "fulfilled", value: value }; },
    function (reason) { return { status: "rejected", value: reason }; }
  );
}

// ================================================================
// YOUR TASK: implement promiseAll below.
// Do NOT use Promise.all / allSettled / any / race.
// ================================================================
function promiseAll(promises) {
  // TODO: return a promise that fulfills with all values in input
  // order, or rejects with the first rejection reason.
}
`,
    solutionCode: `// ================================================================
// PRE-WRITTEN TEST HARNESS -- DO NOT EDIT
// ================================================================
function buildFromSpec(spec) {
  var kind = spec[0];
  if (kind === "resolve") return Promise.resolve(spec[1]);
  if (kind === "reject") return Promise.reject(spec[1]);
  if (kind === "resolveAfter") {
    return new Promise(function (resolve) {
      setTimeout(function () { resolve(spec[1]); }, spec[2]);
    });
  }
  if (kind === "rejectAfter") {
    return new Promise(function (_resolve, reject) {
      setTimeout(function () { reject(spec[1]); }, spec[2]);
    });
  }
  return spec[1]; // "value": raw non-promise value
}

function testPromiseAll(specs) {
  var inputs = specs.map(buildFromSpec);
  return promiseAll(inputs).then(
    function (value) { return { status: "fulfilled", value: value }; },
    function (reason) { return { status: "rejected", value: reason }; }
  );
}

// ================================================================
// SOLUTION
// ================================================================
function promiseAll(promises) {
  return new Promise(function (resolve, reject) {
    var results = new Array(promises.length);
    var remaining = promises.length;
    if (remaining === 0) {
      resolve(results);
      return;
    }
    promises.forEach(function (p, i) {
      Promise.resolve(p).then(function (value) {
        results[i] = value;
        remaining--;
        if (remaining === 0) {
          resolve(results);
        }
      }, reject);
    });
  });
}
`,
    solutionMd: `## Solution

Index-slotted results plus a countdown counter.

~~~js
function promiseAll(promises) {
  return new Promise(function (resolve, reject) {
    var results = new Array(promises.length);
    var remaining = promises.length;
    if (remaining === 0) {
      resolve(results);
      return;
    }
    promises.forEach(function (p, i) {
      Promise.resolve(p).then(function (value) {
        results[i] = value;   // write into the ORIGINAL slot
        remaining--;
        if (remaining === 0) {
          resolve(results);   // last one turns off the lights
        }
      }, reject);             // first rejection wins
    });
  });
}
~~~

Three ideas carry the whole implementation. First, Promise.resolve(p) normalizes plain values and thenables so everything downstream is a real promise. Second, each promise writes its value into results[i] — the index it held in the INPUT — so output order is independent of settle order. Third, a "remaining" counter detects completion: only when it hits zero is the results array fully populated. Rejection needs no bookkeeping at all: reject is passed as the failure handler for every promise, and promise resolution is idempotent — the first call wins and later calls are ignored by spec.
`,
    lessonMd: `### Intuition

Promise.all is a barrier: launch everything, then wait at the gate until all runners arrive — or until the first one falls over. The subtle part is not waiting; it is remembering which runner is which, because they finish in arbitrary order but the caller wants results lined up with the inputs.

### Naive approach

Awaiting each promise in a loop (for...of with await) gives the right values in the right order — but sequentially, destroying the concurrency that is the entire point. Another common miss: pushing results into an array as promises settle. That records COMPLETION order, not input order, and the tests with staggered delays expose it immediately.

### The refinement

Pre-size a results array and have promise i write to results[i]. Track completion with a single counter initialized to the input length, decremented per fulfillment; when it reaches zero, every slot is filled and the outer promise resolves. Wrap each input in Promise.resolve so raw values and thenables behave uniformly.

### Why it works

Index slotting decouples settle order from output order — each value has a reserved seat. The counter is a correct completion detector because it decrements exactly once per fulfilled input. And rejection falls out of the promise spec itself: an outer promise can settle only once, so wiring every input's rejection straight to reject means the FIRST rejection settles the barrier and subsequent settlements are silently ignored. The empty-array early return matters: with zero inputs, no callback would ever fire the resolve.

### Complexity and perf notes

O(n) setup, O(1) per settlement, O(n) memory for the results. All inputs run concurrently — with n network calls of ~equal latency L, total time is ~L instead of n*L for the sequential version.

### Common pitfalls

- Counting with results.length or a shared "i" instead of a dedicated counter.
- Forgetting the empty-input case (a promise that never settles is a very quiet bug).
- Not wrapping inputs in Promise.resolve, breaking on plain values.
- Trying to "cancel" other promises on rejection — Promise.all does not cancel; the others keep running, their results simply discarded.

### Transferable pattern

"Reserve indexed slots + countdown latch" appears anywhere you fan out concurrent work and reassemble ordered results: parallel fetch + hydrate, map-reduce over workers, batched DB lookups, and implementing allSettled (same skeleton, but record both outcomes and never reject).
`,
    testCases: [
      { input: [[["resolve", 1], ["resolve", 2]]], expected: { status: "fulfilled", value: [1, 2] }, hidden: false, label: "two resolved promises" },
      { input: [[["resolve", 1], ["reject", "boom"]]], expected: { status: "rejected", value: "boom" }, hidden: false, label: "one rejection rejects all" },
      { input: [[]], expected: { status: "fulfilled", value: [] }, hidden: false, label: "empty input resolves immediately" },
      { input: [[["value", 7], ["resolve", 8]]], expected: { status: "fulfilled", value: [7, 8] }, hidden: true, label: "plain values pass through" },
      { input: [[["resolveAfter", "slow", 20], ["resolve", "fast"]]], expected: { status: "fulfilled", value: ["slow", "fast"] }, hidden: true, label: "input order beats settle order" },
      { input: [[["resolveAfter", 1, 30], ["resolveAfter", 2, 10], ["resolveAfter", 3, 20]]], expected: { status: "fulfilled", value: [1, 2, 3] }, hidden: true, label: "three staggered delays keep order" },
      { input: [[["reject", "first"], ["reject", "second"]]], expected: { status: "rejected", value: "first" }, hidden: true, label: "first rejection wins" },
      { input: [[["resolveAfter", "ok", 5], ["rejectAfter", "late-fail", 20]]], expected: { status: "rejected", value: "late-fail" }, hidden: true, label: "late rejection still rejects" },
      { input: [[["value", 1], ["value", 2], ["value", 3]]], expected: { status: "fulfilled", value: [1, 2, 3] }, hidden: true, label: "all plain values" },
      { input: [[["reject", "only"]]], expected: { status: "rejected", value: "only" }, hidden: true, label: "single rejection" },
    ],
  },
  {
    slug: "event-emitter",
    title: "Event Emitter",
    category: "frontend",
    difficulty: "medium",
    level: 4,
    pattern: "Pub/Sub",
    tags: ["pub-sub", "events", "classes", "design"],
    timeLimitSeconds: 1800,
    editorType: "monaco",
    functionName: "runEmitter",
    resultOrder: "strict",
    promptMd: `## Event Emitter

Implement the classic pub/sub primitive behind Node's EventEmitter and every UI event bus:

~~~js
class EventEmitter {
  on(event, listener) { ... }
  once(event, listener) { ... }
  off(event, listener) { ... }
  emit(event, payload) { ... }
}
~~~

### Requirements

1. on(event, listener): register a listener for the named event.
2. emit(event, payload): call every listener registered for that event, in REGISTRATION ORDER, passing the payload. Emitting an event with no listeners is a no-op.
3. off(event, listener): remove that specific listener (matched by reference) from the event. Other listeners — including the same event's — are untouched. Removing a listener that is not registered is a no-op.
4. once(event, listener): like on, but the listener auto-unsubscribes after its first invocation.
5. off must also remove a not-yet-fired once listener (the caller passes the ORIGINAL function — so if you wrap once listeners, keep a way to find them by the original reference).
6. Listeners for different events are fully independent.

### How this is tested

The starter has a **pre-written ops-runner you must not edit**. "runEmitter(ops)" creates one EventEmitter and a set of named logging listeners, then executes operations:

- ["on", event, listenerId]
- ["once", event, listenerId]
- ["off", event, listenerId]
- ["emit", event, payload]

Each time a listener fires it appends "listenerId:payload" to a log, which is returned at the end.

### Example

~~~js
// ops: [["once", "save", "L1"], ["on", "save", "L2"],
//       ["emit", "save", "a"], ["emit", "save", "b"]]
// -> ["L1:a", "L2:a", "L2:b"]   (L1 fired once, then dropped)
~~~
`,
    starterCode: `// ================================================================
// PRE-WRITTEN TEST HARNESS -- DO NOT EDIT
// Replays an ops list against your EventEmitter, logging calls.
// ================================================================
function runEmitter(ops) {
  var emitter = new EventEmitter();
  var log = [];
  var listeners = {};
  function getListener(id) {
    if (!listeners[id]) {
      listeners[id] = function (payload) {
        log.push(id + ":" + String(payload));
      };
    }
    return listeners[id];
  }
  for (var i = 0; i < ops.length; i++) {
    var op = ops[i];
    if (op[0] === "on") emitter.on(op[1], getListener(op[2]));
    else if (op[0] === "once") emitter.once(op[1], getListener(op[2]));
    else if (op[0] === "off") emitter.off(op[1], getListener(op[2]));
    else if (op[0] === "emit") emitter.emit(op[1], op[2]);
  }
  return log;
}

// ================================================================
// YOUR TASK: implement the EventEmitter class below.
// ================================================================
class EventEmitter {
  constructor() {
    // TODO: initialize storage for event -> listeners
  }

  on(event, listener) {
    // TODO
  }

  once(event, listener) {
    // TODO: fire at most once, and stay removable via off(event, listener)
  }

  off(event, listener) {
    // TODO: remove by original function reference
  }

  emit(event, payload) {
    // TODO: call listeners in registration order
  }
}
`,
    solutionCode: `// ================================================================
// PRE-WRITTEN TEST HARNESS -- DO NOT EDIT
// ================================================================
function runEmitter(ops) {
  var emitter = new EventEmitter();
  var log = [];
  var listeners = {};
  function getListener(id) {
    if (!listeners[id]) {
      listeners[id] = function (payload) {
        log.push(id + ":" + String(payload));
      };
    }
    return listeners[id];
  }
  for (var i = 0; i < ops.length; i++) {
    var op = ops[i];
    if (op[0] === "on") emitter.on(op[1], getListener(op[2]));
    else if (op[0] === "once") emitter.once(op[1], getListener(op[2]));
    else if (op[0] === "off") emitter.off(op[1], getListener(op[2]));
    else if (op[0] === "emit") emitter.emit(op[1], op[2]);
  }
  return log;
}

// ================================================================
// SOLUTION
// ================================================================
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push({ listener: listener, once: false });
    return this;
  }

  once(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push({ listener: listener, once: true });
    return this;
  }

  off(event, listener) {
    var list = this.events[event];
    if (!list) return this;
    for (var i = 0; i < list.length; i++) {
      if (list[i].listener === listener) {
        list.splice(i, 1);
        break;
      }
    }
    return this;
  }

  emit(event, payload) {
    var list = this.events[event];
    if (!list || list.length === 0) return false;
    var snapshot = list.slice();
    for (var i = 0; i < snapshot.length; i++) {
      var entry = snapshot[i];
      if (entry.once) {
        var pos = list.indexOf(entry);
        if (pos !== -1) list.splice(pos, 1);
      }
      entry.listener(payload);
    }
    return true;
  }
}
`,
    solutionMd: `## Solution

Store entries of { listener, once } per event instead of wrapping once-listeners in anonymous functions — that keeps off() workable by original reference.

~~~js
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push({ listener: listener, once: false });
    return this;
  }

  once(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push({ listener: listener, once: true });
    return this;
  }

  off(event, listener) {
    var list = this.events[event];
    if (!list) return this;
    for (var i = 0; i < list.length; i++) {
      if (list[i].listener === listener) {
        list.splice(i, 1);
        break;
      }
    }
    return this;
  }

  emit(event, payload) {
    var list = this.events[event];
    if (!list || list.length === 0) return false;
    var snapshot = list.slice();
    for (var i = 0; i < snapshot.length; i++) {
      var entry = snapshot[i];
      if (entry.once) {
        var pos = list.indexOf(entry);
        if (pos !== -1) list.splice(pos, 1);
      }
      entry.listener(payload);
    }
    return true;
  }
}
~~~

Two design decisions do the heavy lifting. Storing metadata ({ once }) beside the original function — rather than wrapping it — means off(event, listener) can always find the entry by reference, even for pending once-listeners. And emitting over a SNAPSHOT of the list makes iteration safe while entries are being removed mid-emit (a once listener removes itself as it fires).
`,
    lessonMd: `### Intuition

An event emitter is just a dictionary from event names to subscriber lists, plus the discipline of calling them in order. Everything interesting about the exercise lives in the lifecycle edge cases: once-semantics, removal by reference, and mutation during iteration.

### Naive approach

The tempting once() implementation wraps the listener: register an anonymous function that calls the original and then removes ITSELF. It works — until someone calls off(event, originalListener) before the event fires. The emitter only knows the wrapper, the caller only has the original, references never match, and the "removed" listener fires anyway. This exact bug has shipped in real codebases.

### The refinement

Invert the design: store entries of { listener, once } and keep the original reference as the lookup key. off() scans for a matching reference; emit() checks the once flag and removes the entry before invoking it. The second refinement is iterating over a snapshot (list.slice()) inside emit, so removing entries mid-loop cannot skip or double-fire the remaining listeners.

### Why it works

Every operation manipulates one flat array per event, and the invariants are easy to state: entries appear in registration order (push-only for on/once), off removes at most one entry matched by reference, and emit visits the entries that were registered at emit time, dropping once-entries exactly when they fire. Removing the once entry BEFORE invoking it also makes reentrant emits safe — if the listener itself emits the same event, it cannot fire twice.

### Complexity

on/once are O(1); off is O(k) in that event's listener count; emit is O(k). Real emitters accept this because k is small; if you needed O(1) off you would store entries in a Map keyed by listener, trading order bookkeeping.

### Common pitfalls

- Wrapper-based once breaking off-by-reference (the classic).
- Mutating the listener array while iterating it.
- Sharing one array across all events, or letting unknown events throw instead of no-op.
- Forgetting that the same function can subscribe to multiple events independently.

### Transferable pattern

Registry + lifecycle flags + snapshot iteration is the skeleton of DOM event handling, React's synthetic event system, RxJS subscriptions, and every "subscribe/unsubscribe returns cleanup" API — including useEffect's cleanup contract.
`,
    testCases: [
      { input: [[["on", "a", "L1"], ["emit", "a", "hi"]]], expected: ["L1:hi"], hidden: false, label: "basic on + emit" },
      { input: [[["on", "a", "L1"], ["on", "a", "L2"], ["emit", "a", "x"]]], expected: ["L1:x", "L2:x"], hidden: false, label: "registration order preserved" },
      { input: [[["once", "a", "L1"], ["emit", "a", "x"], ["emit", "a", "y"]]], expected: ["L1:x"], hidden: false, label: "once fires a single time" },
      { input: [[["on", "a", "L1"], ["off", "a", "L1"], ["emit", "a", "x"]]], expected: [], hidden: true, label: "off removes the listener" },
      { input: [[["emit", "ghost", "x"]]], expected: [], hidden: true, label: "emit with no listeners is a no-op" },
      { input: [[["on", "a", "L1"], ["on", "b", "L2"], ["emit", "a", "1"], ["emit", "b", "2"]]], expected: ["L1:1", "L2:2"], hidden: true, label: "events are independent" },
      { input: [[["on", "a", "L1"], ["on", "a", "L2"], ["off", "a", "L1"], ["emit", "a", "x"]]], expected: ["L2:x"], hidden: true, label: "off targets only one listener" },
      { input: [[["once", "a", "L1"], ["on", "a", "L2"], ["emit", "a", "1"], ["emit", "a", "2"]]], expected: ["L1:1", "L2:1", "L2:2"], hidden: true, label: "once and on together" },
      { input: [[["once", "a", "L1"], ["off", "a", "L1"], ["emit", "a", "x"]]], expected: [], hidden: true, label: "off removes a pending once listener" },
      { input: [[["on", "a", "L1"], ["off", "a", "L1"], ["on", "a", "L1"], ["emit", "a", "x"]]], expected: ["L1:x"], hidden: true, label: "re-subscribe after off" },
    ],
  },
  // __CHUNK4__
];
