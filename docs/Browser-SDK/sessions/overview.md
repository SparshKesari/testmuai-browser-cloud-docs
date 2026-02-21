# Overview

The Sessions API lets you create and control cloud-based browser sessions
through simple SDK calls. Each session is like giving your AI agent its own
dedicated browser window, but running on TestMu AI Browser Cloud and controlled
through your code.

[Go to Quickstart →](./quickstart.md)


### What is a Session?

Sessions are the atomic unit of TestMu AI Browser Cloud. Think of sessions as
giving your AI agents their own dedicated browser windows. Just like you might
open a browser to start a fresh browsing session, the Sessions API lets your
agents spin up isolated browser instances on demand.

Each session maintains its own state, cookies, and storage - perfect for AI
agents that need to navigate the web, interact with sites, and maintain context
across multiple steps.

When you create a session, you get back:

1. A **session ID** to track and manage it
2. A **WebSocket URL** to connect your automation tool (Puppeteer, Playwright, or Selenium)
3. A **debug URL** to watch the session on the TestMu AI dashboard
4. A **session viewer URL** for real-time streaming of the browser


### How it works

```
Your Agent                          TestMu AI Cloud
    │                                      │
    ├── client.sessions.create() ────────→ │  Spins up a real Chrome browser
    │                                      │  Returns session ID + WebSocket URL
    │                                      │
    ├── client.puppeteer.connect() ──────→ │  Your agent drives the browser
    │   page.goto(...)                     │  via WebSocket (CDP)
    │   page.click(...)                    │
    │   page.type(...)                     │
    │                                      │
    ├── browser.close() ─────────────────→ │  Browser disconnects
    │                                      │
    └── client.sessions.release() ───────→ │  Session cleaned up
                                           │  Resources freed
```

Your agent creates a session, connects to it using its preferred automation
library, does its work, and releases the session when done. That's the entire
lifecycle.


### Connect with your preferred tools

- [Connect to a Session](../guides/connect.md) - Puppeteer, Playwright, or Selenium


### Understand sessions

- [Quickstart](./quickstart.md) - Create your first session in 5 minutes
- [Session Lifecycle](./lifecycle.md) - How sessions live, time out, and get cleaned up
- [Configuration Reference](./configuration.md) - All session options

> **Need help building with Sessions?**
> Reach out to us on Discord - we're happy to help!
