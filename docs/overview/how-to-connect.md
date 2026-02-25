# How to Connect

Three ways for your agents to access TestMu AI Browser Cloud - choose the one that fits your stack.


### TestMu Browser SDK

**Status:** ✅ Available now

The TestMu Browser SDK is the primary way to interact with the Browser Cloud.
Install it via npm and you get full programmatic control over sessions,
adapters, stealth, profiles, files, extensions, and tunnels from your Node.js
application.

```typescript
import { Browser } from '@testmuai/testmu-cloud';
const client = new Browser();
```

The SDK is what this documentation covers in detail. Everything in the
[Guides](../Browser-SDK/guides/),
[Sessions](../Browser-SDK/sessions/), and
[Advanced Features](../Browser-SDK/advanced-features/) sections is SDK
functionality that is built, tested, and ready to use.

**Best for:** Agent developers who want full control in TypeScript/JavaScript.
Direct integration into your agent's codebase.

→ [Get started with the TestMu Browser SDK](../Browser-SDK/sessions/quickstart.md)


### API

**Status:** 🔜 Coming Soon

A REST API that exposes all SDK capabilities over HTTP. Language-agnostic - call
it from Python, Go, Rust, or any language that speaks HTTP.

**Best for:** Multi-language agent stacks, serverless functions, and teams that
don't want a Node.js dependency.

→ [View planned API structure](../Browser-SDK/others/api-reference.md)


### Skills

**Status:** 🔜 Coming Soon

Pre-built browser capabilities packaged as tools for AI agent frameworks like
LangChain, CrewAI, and AutoGen. Instead of writing browser automation code,
your agent declares what it needs and the Skill handles everything - session
creation, navigation, data extraction, cleanup.

**Best for:** Agent builders using established frameworks who want plug-and-play
browser access without managing sessions manually.

→ [View planned Skills catalog](../Browser-SDK/others/skills.md)
