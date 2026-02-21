# Session Configuration

Complete reference for all options available when creating a session with the TestMu Browser SDK.

When you call `client.sessions.create()`, you can pass these options to
configure the session's behavior, browser settings, and capabilities.


### Required Options

| Option | Type | Description |
|--------|------|-------------|
| `adapter` | `'puppeteer' \| 'playwright' \| 'selenium'` | Which automation library to use |
| `lambdatestOptions` | `object` | TestMu AI capabilities (build name, test name, credentials) |

### Stealth Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `stealthConfig.humanizeInteractions` | `boolean` | `false` | Add random delays to clicks and typing |
| `stealthConfig.randomizeUserAgent` | `boolean` | `true` | Pick random user-agent from pool |
| `stealthConfig.randomizeViewport` | `boolean` | `true` | Add ±20px jitter to viewport |
| `stealthConfig.skipFingerprintInjection` | `boolean` | `false` | Disable all stealth |

→ Learn more: [Stealth Mode](../advanced-features/stealth/overview.md)

### Persistence Options

| Option | Type | Description |
|--------|------|-------------|
| `profileId` | `string` | Load/save persistent browser profile |
| `sessionContext` | `SessionContext` | Pre-load cookies, localStorage, sessionStorage |

→ Learn more: [Profiles](../advanced-features/profiles/overview.md) · [Context & Auth](../advanced-features/context/overview.md)

### Browser Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dimensions` | `{ width, height }` | - | Browser viewport size |
| `userAgent` | `string` | - | Custom user-agent string |
| `headless` | `boolean` | - | Run in headless mode |
| `timeout` | `number` | `300000` | Session timeout in ms (5 min) |
| `blockAds` | `boolean` | - | Block advertisements |
| `solveCaptcha` | `boolean` | - | Enable CAPTCHA solving |

### Network Options

| Option | Type | Description |
|--------|------|-------------|
| `proxy` | `string` | Proxy URL |
| `geoLocation` | `string` | Geolocation code (e.g. `'US'`, `'IN'`) |
| `tunnel` | `boolean` | Enable TestMu AI tunnel |
| `tunnelName` | `string` | Named tunnel identifier |
| `region` | `string` | TestMu AI data center region |
| `optimizeBandwidth` | `boolean \| config` | Block images/media/styles |

→ Learn more: [Tunnel Service](../advanced-features/tunnel/overview.md)

### Extension Options

| Option | Type | Description |
|--------|------|-------------|
| `extensionIds` | `string[]` | Chrome extension IDs to load |

→ Learn more: [Extensions](../advanced-features/extensions/overview.md)


### Session Object

After creation, you receive a Session object with these fields:

```typescript
interface Session {
    id: string;                    // Unique session ID
    websocketUrl: string;          // WebSocket URL for adapter connection
    debugUrl: string;              // TestMu AI dashboard URL
    config: SessionConfig;         // Original configuration
    status: 'live' | 'released' | 'failed';
    createdAt: string;             // ISO timestamp
    timeout: number;               // Session timeout in ms
    dimensions: Dimensions;        // Viewport dimensions
    sessionViewerUrl?: string;     // Live session viewer URL
    userAgent?: string;            // Resolved user-agent
    stealthConfig?: StealthConfig; // Active stealth settings
}
```
