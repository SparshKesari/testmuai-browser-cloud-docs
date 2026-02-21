# Welcome to TestMu AI Browser Cloud

Humans use Chrome. Agents use TestMu.


### Getting agents to use the web is *hard*

We want AI agents that can book us a flight, find us a deal, fill out a form,
monitor a dashboard, and extract data from any site on the internet.

But if you've ever tried to build an AI agent that interacts with the real web,
you know the headaches:

- **Dynamic Content:** Modern sites rely on client-side rendering and lazy
  loading. A simple HTTP fetch returns an empty shell. Your agent needs a real
  browser that executes JavaScript, waits for hydration, and renders the full
  page.

- **Bot Detection:** The moment an automated browser connects, detection
  scripts check for `navigator.webdriver`, missing plugins, identical viewport
  sizes, and inhuman interaction speeds. Your agent gets blocked before it reads
  a single word.

- **Authentication:** The most valuable data and functionality sits behind
  login walls. Your agent needs to sign in, handle cookies, persist sessions -
  and ideally not re-authenticate every single time it runs.

- **Complex Navigation:** Getting to the data often means clicking through
  menus, filling forms, handling pop-ups, and uploading documents. This isn't a
  fetch-and-parse problem.

- **Infrastructure Overhead:** Running headless Chrome at scale means managing
  processes, handling crashes, dealing with resource contention, and debugging
  sessions you can't see.

This is by design. The web was built for humans, not bots.

What if we flipped that?


### A better way to take your agents online

TestMu AI Browser Cloud is a cloud browser infrastructure purpose-built for AI
agents. It gives your agents on-demand access to real Chrome browsers running on
TestMu AI's global cloud - with built-in stealth, session persistence, and
full observability.

Under the hood, the platform handles all the headaches of browser
infrastructure:

- Patching browser fingerprints so your agent looks human
- Managing cookies, storage, and auth state across sessions
- Transferring files between your machine and cloud browsers
- Creating encrypted tunnels to access localhost and internal networks
- Recording every session with video, console logs, and network capture
- Executing JavaScript to load and hydrate dynamic pages

All running on TestMu AI's 3000+ browser/OS infrastructure, so you can focus
on what your agent should do - not on babysitting browsers.


### Three ways to connect

TestMu AI Browser Cloud gives you three connection points, each serving a
different level of abstraction:

| Connection | Status           | What It Is                                         |
|------------|------------------|----------------------------------------------------|
| **SDK**    | ✅ Available      | TestMu Browser SDK - full programmatic control |
| **API**    | 🔜 Coming Soon   | REST API for language-agnostic access               |
| **Skills** | 🔜 Coming Soon   | Pre-built tools for agent frameworks                |

Learn more about each in [How to Connect](./how-to-connect.md).


### Get started

- [Sessions Overview](../sessions/overview.md) — Understand the core concept
- [Quickstart](../sessions/quickstart.md) — Create your first session in 5 minutes
- [Connect to a Session](../guides/connect.md) - Puppeteer, Playwright, or Selenium