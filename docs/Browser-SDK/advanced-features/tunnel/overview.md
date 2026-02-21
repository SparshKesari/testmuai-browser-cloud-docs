# Tunnel

Access localhost and internal networks from cloud browsers.


### What Is the Tunnel Service?

The Tunnel Service creates an encrypted connection between your local machine
and TestMu AI's cloud infrastructure. This allows TestMu AI Browser Cloud
sessions to access URLs that aren't publicly reachable - your localhost
development server, staging environments behind a VPN, or internal tools on
your company network.

```
Cloud Browser ──(encrypted tunnel)──→ Your Machine ──→ localhost:3000
                                                    ──→ staging.internal.company.com
                                                    ──→ 192.168.1.50:8080
```


### Why Tunnels?

Without a tunnel, cloud browsers can only access public URLs. But your agent
might need to:

- Test a local development server before deploying
- Access a staging environment behind a corporate VPN
- Interact with internal tools and dashboards
- Work with a local API backend


### Automatic Tunnel (Recommended)

The easiest approach. Set `tunnel: true` in your session config and the
TestMu Browser SDK handles starting and routing the tunnel automatically:

```typescript
const session = await client.sessions.create({
    adapter: 'puppeteer',
    tunnel: true,
    tunnelName: 'my-tunnel',   // Optional: name for identification
    lambdatestOptions: { ... }
});

const browser = await client.puppeteer.connect(session);
const page = (await browser.pages())[0];

await page.goto('http://localhost:3000');  // This works!
```

If you set `tunnel: true` without a `tunnelName`, the SDK auto-generates a name
and starts the tunnel for you.


### Manual Tunnel

For more control - for example, starting the tunnel once and reusing it across
multiple sessions:

```typescript
// Start the tunnel
await client.tunnel.start({
    user: process.env.LT_USERNAME!,
    key: process.env.LT_ACCESS_KEY!,
    tunnelName: 'my-tunnel',
});

console.log('Tunnel running:', client.tunnel.getStatus()); // true

// Create sessions that use it
const session = await client.sessions.create({
    adapter: 'puppeteer',
    tunnel: true,
    tunnelName: 'my-tunnel',
    lambdatestOptions: { ... }
});

// ... agent work ...

// Stop when done
await client.tunnel.stop();
```


### Tunnel Config

```typescript
interface TunnelConfig {
    user: string;           // TestMu AI username
    key: string;            // TestMu AI access key
    tunnelName?: string;    // Named tunnel for identification
    proxyHost?: string;     // Corporate proxy host
    proxyPort?: string;     // Corporate proxy port
    proxyUser?: string;     // Proxy auth user
    proxyPass?: string;     // Proxy auth password
    logFile?: string;       // Log file path
}
```


### API

```typescript
await client.tunnel.start(config);   // Start tunnel
await client.tunnel.stop();          // Stop tunnel
client.tunnel.getStatus();           // Returns true/false
```


### How It Works

The Tunnel Service uses the `@lambdatest/node-tunnel` package to create a
binary tunnel connection to TestMu AI infrastructure. The tunnel name is passed
as a TestMu AI capability so cloud browsers know to route their traffic through
your local machine.
