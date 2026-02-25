# Quickstart

Get up and running with your first TestMu session in a few minutes.


### Overview

This guide will walk you through setting up your TestMu AI account, creating
your first browser session on TestMu AI Browser Cloud, and driving it using
TypeScript/Puppeteer. In just a few minutes, you'll be programmatically
controlling a cloud browser.


### Initial Setup

#### 1. Create a TestMu AI Account

1. Sign up for an account at [lambdatest.com](https://www.lambdatest.com)

#### 2. Get Your Credentials

1. After signing up, navigate to **Settings → Account Settings**
2. Find your **Username** and **Access Key**

#### 3. Set Up Environment Variables

1. Create a `.env` file in your project root (if you don't have one)
2. Add your credentials:

```
LT_USERNAME=your_username
LT_ACCESS_KEY=your_access_key
```

> Make sure to add `.env` to your `.gitignore` file to keep your credentials secure.


### Installing the TestMu Browser SDK

```bash
npm i @testmuai/testmu-cloud
```

**Requirements:** Node.js 16+ (Node 18+ required if using the Playwright adapter)


### Create Your First Session

Let's create a simple script that launches a cloud browser, navigates to a page,
and cleans up:

```typescript
// my-first-session.ts

import { testMuBrowser } from '@testmuai/testmu-cloud';

const client = new testMuBrowser();

async function main() {
    // Create a session
    const session = await client.sessions.create({
        adapter: 'puppeteer',
        lambdatestOptions: {
            build: 'Getting Started',
            name: 'My First Session',
            'LT:Options': {
                username: process.env.LT_USERNAME,
                accessKey: process.env.LT_ACCESS_KEY,
            }
        }
    });

    console.log('Session created:', session.id);
    console.log('View live session at:', session.sessionViewerUrl);

    // Your session is now ready to use!
    // When done, release the session
    await client.sessions.release(session.id);
    console.log('Session released');
}

main().catch(console.error);
```


### Connecting to Your Session

Now that you have a session, connect to it using your preferred automation tool:

```typescript
// Connect via Puppeteer
const browser = await client.puppeteer.connect(session);
const page = (await browser.pages())[0];

await page.goto('https://example.com');
console.log('Title:', await page.title());
```

Run it:

```bash
npx ts-node my-first-session.ts
```

You can open the `sessionViewerUrl` printed in the console to watch the browser
session live on the TestMu AI dashboard.


### Session Features

Want to do more with your session? Here are some common options you can add when
creating:

```typescript
const session = await client.sessions.create({
    adapter: 'puppeteer',
    stealthConfig: {                  // Make the browser look human
        humanizeInteractions: true,
        randomizeUserAgent: true,
    },
    profileId: 'my-saved-login',      // Persist auth across runs
    tunnel: true,                     // Access localhost from cloud
    timeout: 600000,                  // 10-minute timeout
    lambdatestOptions: { ... }
});
```

You've now created your first TestMu session and learned the basics of session
management. With these fundamentals, you can start building more complex agent
workflows on TestMu AI Browser Cloud.

### What's next

| Capability | What It Does | Guide |
|------------|-------------|-------|
| Stealth Mode | Make the browser look human | [Stealth](../advanced-features/stealth/overview.md) |
| Quick Actions | One-liner scrape, screenshot, or PDF | [Quick Actions](../advanced-features/quick-actions/overview.md) |
| Context & Auth | Transfer login state across sessions | [Context](../advanced-features/context/overview.md) |
| Profiles | Persist login state across runs | [Profiles](../advanced-features/profiles/overview.md) |
| File Service | Upload/download files to cloud browsers | [Files](../advanced-features/files/overview.md) |
| Extensions | Load Chrome extensions into sessions | [Extensions](../advanced-features/extensions/overview.md) |
| Tunnel | Access localhost from cloud browsers | [Tunnel](../advanced-features/tunnel/overview.md) |

