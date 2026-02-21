
# Connect to a Session

Drive TestMu AI Browser Cloud sessions using Puppeteer, Playwright, or Selenium.

The TestMu Browser SDK supports three automation libraries. Each one connects
to the same cloud browser infrastructure - the difference is the protocol and
the API you use to drive the browser.

| | Puppeteer | Playwright | Selenium |
|---|---|---|---|
| **Connection** | WebSocket (CDP) | WebSocket (CDP) | HTTP (WebDriver) |
| **Stealth** | ✅ Best | ✅ Good | 🔜 Coming Soon |
| **Return type** | `Browser` | `{ browser, context, page }` | `WebDriver` |
| **Humanized interactions** | `click`, `type` | `click`, `type`, `fill` | 🔜 Coming Soon |
| **Auto-waiting** | Manual | Built-in | Manual |
| **Profile persistence** | ✅ | ✅ | ✅ |

**Our recommendation:** Start with **Puppeteer** for most agent use cases. It
has the best stealth support and the simplest return type. Switch to
**Playwright** if you need auto-waiting or `page.fill()`. Use **Selenium** if
you have an existing Selenium test suite you want to run on the cloud.

---


## Puppeteer

Most Puppeteer scripts start with `puppeteer.launch()` to launch a local
browser. With the TestMu Browser SDK, you replace that with
`client.puppeteer.connect()` to connect to a cloud browser instead. Your
subsequent Puppeteer calls work exactly the same as before.


### Basic Usage

```typescript
import { testMuBrowser } from 'testmubrowser';

const client = new testMuBrowser();

// 1. Create a cloud session
const session = await client.sessions.create({
    adapter: 'puppeteer',
    lambdatestOptions: {
        build: 'My Agent',
        name: 'Puppeteer Session',
        'LT:Options': {
            username: process.env.LT_USERNAME,
            accessKey: process.env.LT_ACCESS_KEY,
        }
    }
});

// 2. Connect - returns a standard Puppeteer Browser object
const browser = await client.puppeteer.connect(session);
const page = (await browser.pages())[0];

// 3. Use Puppeteer as normal
await page.goto('https://example.com');
await page.screenshot({ path: 'screenshot.png' });

// 4. Clean up
await browser.close();
await client.sessions.release(session.id);
```

The `browser` object returned by `client.puppeteer.connect()` is a standard
Puppeteer `Browser`. Use it exactly as you would with plain Puppeteer - all
existing Puppeteer knowledge applies.


### What Happens Behind the Scenes

When you call `client.puppeteer.connect(session)`, the SDK handles several
things automatically based on your session configuration:

1. **Stealth check.** If `stealthConfig` is present and `skipFingerprintInjection` is not set, the SDK connects via `puppeteer-extra` with the stealth plugin - which patches 15+ browser fingerprints automatically.

2. **User-agent.** If `randomizeUserAgent` is enabled, a random realistic user-agent is set on the page.

3. **Viewport.** If `randomizeViewport` is enabled, ±20px random jitter is added to the viewport dimensions.

4. **Humanized interactions.** If `humanizeInteractions` is true, `page.click()` and `page.type()` are monkey-patched to add random delays that mimic human behavior.

5. **Profile loading.** If `profileId` is set, saved cookies are loaded from disk. And when you call `browser.close()`, the profile is automatically saved with the current cookies.


### Adding Session Features

```typescript
const session = await client.sessions.create({
    adapter: 'puppeteer',
    stealthConfig: {                   // Anti-bot detection
        humanizeInteractions: true,
        randomizeUserAgent: true,
    },
    profileId: 'my-app-login',         // Persist auth state
    tunnel: true,                      // Access localhost
    timeout: 600000,                   // 10-minute timeout
    lambdatestOptions: { ... }
});
```


### Full Working Example

A complete script that creates a session, scrapes a page title, and cleans up
with proper error handling:

```typescript
import { testMuBrowser } from 'testmubrowser';

const client = new testMuBrowser();

async function main() {
    const session = await client.sessions.create({
        adapter: 'puppeteer',
        lambdatestOptions: {
            build: 'Agent Scripts',
            name: 'Scrape Example',
            'LT:Options': {
                username: process.env.LT_USERNAME,
                accessKey: process.env.LT_ACCESS_KEY,
            }
        }
    });

    console.log(`View session: ${session.sessionViewerUrl}`);

    try {
        const browser = await client.puppeteer.connect(session);
        const page = (await browser.pages())[0];

        await page.goto('https://news.ycombinator.com');
        const title = await page.title();
        console.log('Page title:', title);

        await browser.close();
    } finally {
        await client.sessions.release(session.id);
    }
}

main().catch(console.error);
```

> **Important:** Sessions remain active until explicitly released or timed out.
> Always call `client.sessions.release()` when finished instead of waiting for
> the timeout.


### When to Choose Puppeteer

| Use Case | Why Puppeteer |
|----------|---------------|
| General agent automation | Mature, well-documented, large ecosystem |
| Stealth-heavy tasks | Best stealth plugin support (`puppeteer-extra-plugin-stealth`) |
| Simple return type | Returns a single `Browser` object (vs Playwright's 3 objects) |

---


## Playwright

Like Puppeteer, the main change is how you connect - replacing
`chromium.launch()` with `client.playwright.connect()`.

> **Note:** Playwright requires **Node.js 18+**. If you see a version error,
> upgrade with `nvm install 18 && nvm use 18`.


### Basic Usage

```typescript
import { testMuBrowser } from 'testmubrowser';

const client = new testMuBrowser();

const session = await client.sessions.create({
    adapter: 'playwright',
    lambdatestOptions: {
        build: 'My Agent',
        name: 'Playwright Session',
        'LT:Options': {
            username: process.env.LT_USERNAME,
            accessKey: process.env.LT_ACCESS_KEY,
        }
    }
});

// Returns browser, context, AND page - all three ready to use
const { browser, context, page } = await client.playwright.connect(session);

await page.goto('https://example.com');
await page.screenshot({ path: 'screenshot.png' });

await browser.close();
await client.sessions.release(session.id);
```

Notice the key difference from Puppeteer: `client.playwright.connect()` returns
three objects - `browser`, `context`, and `page` - instead of just a browser.
These are standard Playwright objects. Use them exactly as you would with plain
Playwright.


### What Happens Behind the Scenes

When you call `client.playwright.connect(session)`:

1. **Connects** to TestMu AI cloud via `chromium.connect`
2. **Gets or creates** a `BrowserContext` and `Page`
3. **Injects stealth scripts** (if enabled) via `page.addInitScript()` - these run before any page JavaScript:
   - Hides `navigator.webdriver`
   - Fakes `chrome.runtime` (simulates extensions presence)
   - Fakes `navigator.plugins` (3 standard Chrome plugins)
   - Sets `navigator.languages = ['en-US', 'en']`
   - Patches `permissions.query` for notifications
   - Spoofs WebGL vendor/renderer
4. **Auto-applies stealth** to new pages via `context.on('page')`
5. **Patches interactions** (if humanize enabled) - `page.click()`, `page.type()`, and `page.fill()` get random delays
6. **Loads/saves profile** (if `profileId` set)


### When to Choose Playwright

| Use Case | Why Playwright |
|----------|----------------|
| Complex form interactions | Built-in `page.fill()` method |
| Auto-waiting | Playwright automatically waits for elements before interacting |
| Multi-page workflows | Better context management for complex navigation |
| Existing Playwright codebase | Drop-in replacement for `chromium.launch()` |

---


## Selenium

Selenium connects to TestMu AI differently from Puppeteer and Playwright.
Instead of WebSocket, it uses the standard **WebDriver protocol over HTTP**,
connecting to TestMu AI's Selenium Hub.


### Basic Usage

```typescript
import { testMuBrowser } from 'testmubrowser';

const client = new testMuBrowser();

const session = await client.sessions.create({
    adapter: 'selenium',
    lambdatestOptions: {
        build: 'My Agent',
        name: 'Selenium Session',
        'LT:Options': {
            username: process.env.LT_USERNAME,
            accessKey: process.env.LT_ACCESS_KEY,
        }
    }
});

// Returns a standard Selenium WebDriver
const driver = await client.selenium.connect(session);

await driver.get('https://example.com');
const title = await driver.getTitle();
console.log('Title:', title);

await driver.quit();
await client.sessions.release(session.id);
```

The `driver` object is a standard Selenium `WebDriver`. Use it exactly as you
would with plain `selenium-webdriver`.


### Key Difference: HTTP, Not WebSocket

Selenium connects to the TestMu AI Selenium Hub at
`https://hub.lambdatest.com/wd/hub` via HTTP. The adapter reads `LT_USERNAME`
and `LT_ACCESS_KEY` from your environment variables, builds W3C capabilities
from your session config, and connects over the standard WebDriver protocol.

This means the Selenium adapter **ignores** `session.websocketUrl` and builds
its own connection.


### When to Choose Selenium

| Use Case | Why Selenium |
|----------|--------------|
| Existing Selenium test suite | Minimal migration - same WebDriver API |
| Standard WebDriver protocol | Industry-standard, language-agnostic protocol |
| Simple automation tasks | Straightforward page navigation and interaction |

---


## What's Next

- [Stealth Mode](../advanced-features/stealth/overview.md) - Make the browser undetectable
- [Quick Actions](../advanced-features/quick-actions/overview.md) - One-liner scrape/screenshot/PDF
- [Context & Auth](../advanced-features/context/overview.md) - Transfer logged-in state between sessions
- [Profiles](../advanced-features/profiles/overview.md) - Persist login state across runs
- [Session Lifecycle](../sessions/lifecycle.md) - Timeouts and cleanup
