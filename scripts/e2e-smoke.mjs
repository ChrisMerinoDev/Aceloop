/**
 * End-to-end smoke test of the core loop, driving real Chrome:
 * open the Two Sum interview, start it, submit a wrong answer, then a right
 * answer, and assert the scored report + XP + arena/dashboard reflect it.
 *
 * Usage: node scripts/e2e-smoke.mjs [baseUrl]
 */
import puppeteer from "puppeteer-core";

const BASE = process.argv[2] ?? "http://localhost:3400";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const SOLUTION = `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`;

let failures = 0;
const check = (name, ok, extra = "") => {
  console.log(`${ok ? "✅" : "❌"} ${name}${extra ? " — " + extra : ""}`);
  if (!ok) failures++;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});

try {
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));

  // NB: buttons are CSS-uppercased, so match case-insensitively.
  const clickByText = async (text) => {
    const ok = await page.evaluate((t) => {
      const els = [...document.querySelectorAll("button, a")];
      const el = els.find(
        (e) => e.textContent && e.textContent.toLowerCase().includes(t.toLowerCase())
      );
      if (el) {
        el.click();
        return true;
      }
      return false;
    }, text);
    if (!ok) throw new Error(`No clickable element containing "${text}"`);
  };

  const waitForText = async (text, timeout = 20000) => {
    await page.waitForFunction(
      (t) => document.body.innerText.toLowerCase().includes(t.toLowerCase()),
      { timeout },
      text
    );
  };

  // ---- Landing ----
  await page.goto(BASE, { waitUntil: "networkidle2" });
  check("landing renders", (await page.title()).includes("AceLoop"));

  // ---- Interview room: brief → live ----
  await page.goto(`${BASE}/interview/two-sum`, { waitUntil: "networkidle2" });
  await waitForText("Start Interview");
  check("briefing screen shows", true);
  await clickByText("Start Interview");
  await waitForText("Run Samples");
  await page.waitForFunction(() => window.__aceloopEditor !== undefined);
  check("monaco mounted + timer live", (await page.evaluate(() => document.body.innerText)).includes("⏱"));

  // ---- Wrong submission first (tests failure path + spaced repetition) ----
  await page.evaluate(() => {
    window.__aceloopEditor.setValue(
      "function twoSum(nums, target) { return [0, 0]; }"
    );
  });
  await clickByText("Submit");
  await waitForText("Quest Failed");
  check("wrong answer → Quest Failed report", true);
  await clickByText("Try Again");
  await sleep(300);

  // ---- Run samples with the real solution ----
  await page.evaluate((sol) => window.__aceloopEditor.setValue(sol), SOLUTION);
  await clickByText("Run Samples");
  await waitForText("TESTS PASSED");
  const runText = await page.evaluate(() => document.body.innerText);
  check("Run executes visible samples", /\d+\/\d+ TESTS PASSED/.test(runText));

  // ---- Submit the real solution ----
  await clickByText("Submit");
  await waitForText("Quest Complete!");
  const report = await page.evaluate(() => document.body.innerText);
  check("correct answer → Quest Complete", true);
  check("score 0-100 shown", /\d+\/100/.test(report));
  check("XP earned shown", /\+\d+/.test(report));
  check("letter grade shown", /[SABCDF]\n/.test(report) || /^[SABCDF]$/m.test(report));

  // ---- Persistence: arena shows solved, dashboard shows XP ----
  await page.goto(`${BASE}/arena`, { waitUntil: "networkidle2" });
  await waitForText("WORLD MAP");
  const arena = await page.evaluate(() => document.body.innerText);
  check("arena shows solved star + best score", arena.includes("⭐") && arena.includes("best"));

  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle2" });
  await waitForText("HERO STATS");
  const dash = await page.evaluate(() => document.body.innerText);
  check("dashboard shows streak + solved count", dash.includes("🔥") && /\d+\/\d+/.test(dash));
  check("first-blood achievement earned", dash.includes("First Blood"));

  // ---- Reload → localStorage persistence ----
  await page.reload({ waitUntil: "networkidle2" });
  await waitForText("HERO STATS");
  const dash2 = await page.evaluate(() => document.body.innerText);
  const xpMatch = dash2.match(/total xp\s*\n\s*(\d+)/i);
  check("XP persists across reload", xpMatch !== null && Number(xpMatch[1]) > 0, xpMatch?.[1]);

  // ---- Learn + glossary ----
  await page.goto(`${BASE}/learn/two-sum`, { waitUntil: "networkidle2" });
  const lesson = await page.evaluate(() => document.body.innerText);
  check("lesson page has lesson + solution", /the lesson/i.test(lesson) && /model solution/i.test(lesson));

  await page.goto(`${BASE}/glossary`, { waitUntil: "networkidle2" });
  await waitForText("TOME OF TERMS");
  const glos = await page.evaluate(() => document.body.innerText);
  check("glossary lists terms", /big-o/i.test(glos) && /event loop/i.test(glos));

  // ---- Game mode: character moves with WASD ----
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await clickByText("Game Mode");
  await sleep(200);
  const before = await page.evaluate(() => {
    const el = document.querySelector('[aria-hidden][class*="fixed"]');
    return el ? el.getBoundingClientRect().x : null;
  });
  await page.keyboard.down("d");
  await sleep(500);
  await page.keyboard.up("d");
  const after = await page.evaluate(() => {
    const el = document.querySelector('[aria-hidden][class*="fixed"]');
    return el ? el.getBoundingClientRect().x : null;
  });
  check(
    "game mode: hero walks right with 'd'",
    before !== null && after !== null && after > before + 20,
    `x ${Math.round(before ?? -1)} → ${Math.round(after ?? -1)}`
  );

  // ---- Relaxed auth: empty credentials log in, username persists ----
  await page.goto(`${BASE}/auth`, { waitUntil: "networkidle2" });
  await waitForText("Log In");
  await clickByText("Log In"); // empty inputs are fine
  await waitForText("Name Your Hero");
  await page.type('input[aria-label="Hero name"]', "PixelPaladin");
  await clickByText("Enter as PixelPaladin");
  await waitForText("WORLD MAP");
  check("fake login + username → arena", true);

  await page.reload({ waitUntil: "networkidle2" });
  const loggedState = await page.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem("aceloop-game"));
    return { loggedIn: raw.state.loggedIn, username: raw.state.username };
  });
  check(
    "login persists across refresh",
    loggedState.loggedIn === true && loggedState.username === "PixelPaladin"
  );

  const hasLogout = await page.evaluate(() =>
    [...document.querySelectorAll("button")].some((b) => /log out/i.test(b.textContent))
  );
  check("corner log-out button shows", hasLogout);
  await clickByText("Log out");
  await sleep(500);
  const loggedOut = await page.evaluate(
    () => JSON.parse(localStorage.getItem("aceloop-game")).state.loggedIn
  );
  check("manual log out works", loggedOut === false);
  // Log back in for the rest of the run.
  await page.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem("aceloop-game"));
    raw.state.loggedIn = true;
    localStorage.setItem("aceloop-game", JSON.stringify(raw));
  });

  // ---- Level gating: level-2 quest is locked for a fresh-ish profile ----
  await page.goto(`${BASE}/interview/controlled-input`, { waitUntil: "networkidle2" });
  await waitForText("Area Locked");
  check("locked level blocks entry", true);

  // Grant enough progress to unlock level 2 (3 level-1 solves + XP).
  await page.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem("aceloop-game"));
    raw.state.xp = 500;
    const solved = {
      status: "solved",
      bestScore: 90,
      timesAttempted: 1,
      lastAttemptedAt: new Date().toISOString(),
      reviewDueAt: null,
    };
    for (const slug of ["two-sum", "valid-parentheses", "reverse-string"]) {
      raw.state.progress[slug] = solved;
    }
    localStorage.setItem("aceloop-game", JSON.stringify(raw));
  });

  // ---- Sandpack question loads once unlocked ----
  await page.goto(`${BASE}/interview/controlled-input`, { waitUntil: "networkidle2" });
  await waitForText("Start Interview");
  await clickByText("Start Interview");
  await waitForText("TESTS panel", 30000);
  check("sandpack room mounts", true);
  // Wait for the bundler to compile and the tests to auto-run.
  await clickByText("Tests");
  await page.waitForFunction(
    () => /\d+\/\d+ passed/i.test(document.body.innerText),
    { timeout: 120000 }
  );
  const spResult = await page.evaluate(
    () => document.body.innerText.match(/\d+\/\d+ PASSED/i)?.[0]
  );
  check("sandpack tests execute", spResult !== undefined, spResult);

  const fatal = errors.filter((e) => !e.includes("ResizeObserver"));
  check("no page errors", fatal.length === 0, fatal.slice(0, 2).join(" | "));
} finally {
  await browser.close();
}

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
