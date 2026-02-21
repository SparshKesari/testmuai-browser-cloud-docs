# Extensions

Load Chrome extensions into cloud browser sessions.


### What Is the Extension Service?

The Extension Service lets you register Chrome extensions and inject them into
TestMu AI Browser Cloud sessions. Extensions are loaded via cloud URLs (S3),
and TestMu AI downloads and installs them into the browser instance when the
session starts.


### Why Extensions?

Some agent workflows depend on browser extensions - ad blockers that change page
behavior, cookie managers, custom tools built by your team, or extensions that
modify how a site renders. The Extension Service lets you load these into cloud
sessions just as you would in a local browser.


### Loading Extensions into a Session

First, register an extension. Then pass its ID when creating a session:

```typescript
// Step 1: Register (one time)
const ext = await client.extensions.register({
    name: 'My Extension',
    version: '1.0.0',
    cloudUrl: 'https://s3.amazonaws.com/bucket/extension.zip',
});

// Step 2: Load into sessions
const session = await client.sessions.create({
    adapter: 'puppeteer',
    extensionIds: [ext.id],    // Pass registered extension IDs
    lambdatestOptions: { ... }
});
```

When `extensionIds` are provided, the session manager fetches the cloud URLs
and adds them to TestMu AI capabilities as `lambda:loadExtension`.


### Managing Extensions

```typescript
const extensions = await client.extensions.list();

const ext = await client.extensions.get('ext_abc123');

await client.extensions.delete('ext_abc123');
```


### Extension Object

```typescript
interface Extension {
    id: string;
    name: string;
    version: string;
    description?: string;
    enabled: boolean;
    createdAt: string;
    cloudUrl?: string;     // S3 URL
    localPath?: string;    // Local file path
}
```


### Supported Formats

- `.zip` archives containing Chrome extension files
- `.crx` Chrome extension packages


### Current Limitations

- Extension upload to S3 must be done manually (via curl, AWS CLI, or your upload pipeline)
- The automated upload API through TestMu AI is not yet integrated
- Extensions only work with cloud sessions
