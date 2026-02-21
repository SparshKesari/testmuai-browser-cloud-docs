# Files

Upload, download, and manage files within cloud browser sessions.


### What Is the File Service?

The File Service transfers files between your local machine and a remote cloud
browser on TestMu AI Browser Cloud - without needing external storage services
like S3 or GCS. Files are sent directly through the browser's page context
using Base64 encoding.


### Why You Need This

Your agent is filling out a government form that requires a document upload. The
form is running in a cloud browser; the document is on your local machine.
Without the File Service, there's no bridge between the two.

Or your agent triggers a CSV download inside the cloud browser - a report, an
export, a receipt. The File Service pulls it back to your machine.


### Upload a File to the Cloud Browser

```typescript
const fileBuffer = fs.readFileSync('document.pdf');
await client.files.uploadToSession(session.id, fileBuffer, 'document.pdf');
```

**How it works:** The buffer is Base64-encoded, sent to the cloud browser via
`page.evaluate()`, decoded in the browser, and set on the file input element.


### Download a File from the Cloud Browser

**By URL:**

```typescript
const result = await client.files.downloadFromSession(
    session.id,
    'https://example.com/report.csv'
);
fs.writeFileSync('report.csv', result);
```

**How it works:** The cloud browser fetches the URL, reads the response with
`FileReader`, converts to Base64, and returns the data back to Node.js.

For files triggered by button clicks (not direct URLs), the service uses CDP's
`Fetch.enable` to intercept the download.


### Session-Scoped File API

All file operations are also available under `client.sessions.files`:

```typescript
await client.sessions.files.upload(session.id, buffer, 'file.txt');

const files = await client.sessions.files.list(session.id);

const data = await client.sessions.files.download(session.id, '/path/to/file');

const archive = await client.sessions.files.downloadArchive(session.id);

await client.sessions.files.delete(session.id, '/path/to/file');

await client.sessions.files.deleteAll(session.id);
```


### File Info

```typescript
interface FileInfo {
    path: string;
    name: string;
    size: number;
    createdAt: string;
    mimeType?: string;
}
```

Files are stored locally in a `.files/` directory organized by session ID.
