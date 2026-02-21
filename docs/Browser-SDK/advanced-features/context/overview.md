# Reusing Context & Auth

Extract and inject browser state across sessions to preserve login and user data.


### What Is Context?

"Context" is everything the browser remembers about a user's session: login
cookies, user preferences in localStorage, shopping cart data in
sessionStorage. When your agent captures context from a session, it captures
all of this at once.

```typescript
interface SessionContext {
    cookies?: Cookie[];
    localStorage?: Record<string, Record<string, string>>;
    sessionStorage?: Record<string, Record<string, string>>;
}
```

This is how your agent logs in once in one session and skips login entirely in
the next session - by extracting the auth state and injecting it into a new
browser.


### Why This Matters

Most useful websites require authentication. Without the Context Service, your
agent would need to log in every single time it creates a new session. That
means wasted time on login flows, risk of triggering security alerts from
frequent logins, MFA prompts that break automation, and wasted LLM tokens if
your agent uses an AI to navigate login pages.

With the Context Service, your agent logs in once, saves the context, and
replays it in every future session.


### Framework Agnostic

The Context Service auto-detects whether you pass a Puppeteer `Page` or a
Playwright `Page`/`BrowserContext`. The same API works with both - you never
need to specify which adapter you're using.


### Extracting Context

Get all browser state from a page:

```typescript
const context = await client.context.getContext(page);

context.cookies;        // Array of cookies
context.localStorage;   // { "origin": { "key": "value" } }
context.sessionStorage; // { "origin": { "key": "value" } }
```

Or extract individual parts:

```typescript
const cookies = await client.context.getCookies(page);
const localStorage = await client.context.getLocalStorage(page);
const sessionStorage = await client.context.getSessionStorage(page);
```


### Injecting Context

Set browser state on a new page:

```typescript
await client.context.setContext(page, {
    cookies: [
        { name: 'session_id', value: 'abc123', domain: '.example.com', path: '/' }
    ],
    localStorage: {
        'https://example.com': { theme: 'dark', lang: 'en' }
    },
});
```

Or set individual parts:

```typescript
await client.context.setCookies(page, cookies);
await client.context.setLocalStorage(page, localStorageData);
await client.context.setSessionStorage(page, sessionStorageData);
```


### Clearing Context

```typescript
await client.context.clearContext(page);    // Clear everything
await client.context.clearCookies(page);    // Just cookies
await client.context.clearStorage(page);    // localStorage + sessionStorage
```


### Example: Transfer Login Between Sessions

The most common use case - log in once, reuse the auth state:

```typescript
// Session 1: Log in and capture
const session1 = await client.sessions.create({ adapter: 'puppeteer', ... });
const browser1 = await client.puppeteer.connect(session1);
const page1 = (await browser1.pages())[0];

await page1.goto('https://app.example.com/login');
await page1.type('#email', 'user@example.com');
await page1.type('#password', 'password');
await page1.click('#login-button');
await page1.waitForNavigation();

const savedContext = await client.context.getContext(page1);
await browser1.close();
await client.sessions.release(session1.id);

// Session 2: Skip login entirely
const session2 = await client.sessions.create({ adapter: 'puppeteer', ... });
const browser2 = await client.puppeteer.connect(session2);
const page2 = (await browser2.pages())[0];

await client.context.setContext(page2, savedContext);
await page2.goto('https://app.example.com/dashboard');
// Already logged in!
```


### How It Works Under the Hood

- **Puppeteer:** Uses CDP `Network.getAllCookies` / `Network.setCookie` for cookies, and `page.evaluate()` for localStorage/sessionStorage
- **Playwright:** Uses `context.cookies()` / `context.addCookies()` for cookies, and `page.evaluate()` for storage
- Framework detection is automatic based on the page object's available methods


### Context vs Profiles

The Context Service transfers state **within a single script run** (in memory).
If you need state to persist **across separate script runs** (on disk), use the
[Profile Service](../profiles/overview.md) instead.
