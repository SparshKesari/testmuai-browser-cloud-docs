const path = require('path');
const fs = require('fs');
const express = require('express');
const { marked } = require('marked');

const PORT = process.env.PORT || 3333;
const app = express();
const ROOT = __dirname;
const DOCS_DIR = path.join(ROOT, 'docs');

// Structure: docs/overview/ (root Overview) + docs/Browser-SDK/ (sessions, guides, advanced-features, others)

function collectMdFiles(dir, prefix = '') {
  const out = [];
  const full = path.join(DOCS_DIR, dir);
  if (!fs.existsSync(full)) return out;
  const entries = fs.readdirSync(full, { withFileTypes: true });
  for (const e of entries) {
    const rel = path.join(prefix, e.name).replace(/\\/g, '/');
    if (e.isDirectory() && !e.name.startsWith('.')) {
      out.push(...collectMdFiles(path.join(dir, e.name), rel));
    } else if (e.isFile() && e.name.endsWith('.md')) {
      if (!/^readme/i.test(e.name)) out.push(rel);
    }
  }
  return out.sort();
}

const BROWSER_SDK_SECTIONS = ['sessions', 'guides', 'advanced-features', 'others'];
const CAPABILITIES_ORDER = ['stealth', 'quick-actions', 'context', 'profiles', 'files', 'extensions', 'tunnel'];
const OTHERS_ITEM_ORDER = ['api-reference', 'skills', 'changelog'];
const GUIDES_ITEM_ORDER = ['connect'];

function sectionDisplayName(sectionKey) {
  return sectionKey
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Sentence/title case for nav item labels (file names → display names)
const ITEM_DISPLAY_NAMES = {
  intro: 'Intro',
  'how-to-connect': 'How to connect',
  overview: 'Overview',
  quickstart: 'Quickstart',
  lifecycle: 'Lifecycle',
  configuration: 'Configuration',
  connect: 'Connect',
  'api-reference': 'API Reference',
  skills: 'Skills',
  changelog: 'Changelog',
};
function itemDisplayName(name) {
  if (ITEM_DISPLAY_NAMES[name]) return ITEM_DISPLAY_NAMES[name];
  return sectionDisplayName(name);
}

function pathsToTree(paths) {
  const root = { name: 'Documentation', children: [] };
  const rootOverview = []; // docs/overview/*.md
  const byBrowserSdk = {};  // Browser-SDK section -> items (path = full path from docs root)

  for (const p of paths) {
    const parts = p.split('/');
    if (parts[0] === 'overview' && parts.length >= 2) {
      const name = parts[parts.length - 1].replace(/\.md$/, '');
      rootOverview.push({ name, path: p });
    } else if (parts[0] === 'Browser-SDK' && parts.length >= 2) {
      const section = parts[1];
      if (section === 'advanced-features' && parts.length >= 4) {
        const subName = parts[2];
        if (!byBrowserSdk['advanced-features']) byBrowserSdk['advanced-features'] = [];
        byBrowserSdk['advanced-features'].push({ name: subName, path: p, displayName: sectionDisplayName(subName) });
      } else if (section === 'others' && parts.length >= 2) {
        if (!byBrowserSdk.others) byBrowserSdk.others = [];
        const name = parts[parts.length - 1].replace(/\.md$/, '');
        byBrowserSdk.others.push({ name, path: p });
      } else if (parts.length >= 3 || (parts.length === 2 && section !== 'others')) {
        if (!byBrowserSdk[section]) byBrowserSdk[section] = [];
        const name = parts[parts.length - 1].replace(/\.md$/, '');
        byBrowserSdk[section].push({ name, path: p });
      }
    }
  }

  const sessionItemOrder = (name) => {
    const o = { overview: 0, quickstart: 1, lifecycle: 2, configuration: 3 };
    return o[name] !== undefined ? o[name] : 4;
  };
  const overviewItemOrder = (name) => {
    const o = { intro: 0, 'how-to-connect': 1 };
    return o[name] !== undefined ? o[name] : 2;
  };
  const guidesItemOrder = (name) => {
    const i = GUIDES_ITEM_ORDER.indexOf(name);
    return i === -1 ? GUIDES_ITEM_ORDER.length : i;
  };
  const othersItemOrder = (item) => {
    const i = OTHERS_ITEM_ORDER.indexOf(item.name);
    if (i !== -1) return i;
    if (item.path && item.path.includes('debugging')) return OTHERS_ITEM_ORDER.length;
    return OTHERS_ITEM_ORDER.length + 1;
  };
  const capabilitiesItemOrder = (name) => {
    const i = CAPABILITIES_ORDER.indexOf(name);
    return i === -1 ? CAPABILITIES_ORDER.length : i;
  };

  function buildSection(d, items) {
    if (d === 'sessions') {
      items = [...items].sort((a, b) => sessionItemOrder(a.name) - sessionItemOrder(b.name) || a.name.localeCompare(b.name));
    } else if (d === 'overview') {
      items = [...items].sort((a, b) => overviewItemOrder(a.name) - overviewItemOrder(b.name) || a.name.localeCompare(b.name));
    } else if (d === 'guides') {
      items = [...items].sort((a, b) => guidesItemOrder(a.name) - guidesItemOrder(b.name) || a.name.localeCompare(b.name));
    } else if (d === 'others') {
      items = [...items].sort((a, b) => othersItemOrder(a) - othersItemOrder(b) || a.name.localeCompare(b.name));
      items = items.map((item) => {
        if (item.path && item.path.includes('debugging') && item.name === 'overview') {
          return { ...item, displayName: 'Debugging' };
        }
        return item;
      });
    } else if (d === 'advanced-features') {
      items = [...items].sort((a, b) => capabilitiesItemOrder(a.name) - capabilitiesItemOrder(b.name) || a.name.localeCompare(b.name));
    } else {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    }
    const singleOverview = items.length === 1 && items[0].name === 'overview' && d !== 'others';
    items = items.map((item) => {
      const label = item.displayName != null
        ? item.displayName
        : singleOverview && item.name === 'overview'
          ? sectionDisplayName(d)
          : itemDisplayName(item.name);
      return { ...item, displayName: label };
    });
    return { name: d, displayName: sectionDisplayName(d), children: items };
  }

  // Root level 1: Overview (from docs/overview/)
  if (rootOverview.length) {
    const overviewItems = rootOverview.sort((a, b) => overviewItemOrder(a.name) - overviewItemOrder(b.name) || a.name.localeCompare(b.name));
    const items = overviewItems.map((item) => ({
      ...item,
      displayName: overviewItems.length === 1 && item.name === 'intro' ? 'Overview' : itemDisplayName(item.name),
    }));
    root.children.push({ name: 'overview', displayName: 'Overview', children: items });
  }

  // Root level 2: Browser SDK (from docs/Browser-SDK/)
  const browserSdkChildren = [];
  for (const d of BROWSER_SDK_SECTIONS) {
    if (!byBrowserSdk[d]) continue;
    browserSdkChildren.push(buildSection(d, byBrowserSdk[d]));
  }
  if (browserSdkChildren.length) {
    root.children.push({ name: 'Browser SDK', displayName: 'Browser SDK', children: browserSdkChildren });
  }
  return root;
}

app.get('/api/tree', (req, res) => {
  try {
    const paths = collectMdFiles('.');
    res.json(pathsToTree(paths));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/doc', (req, res) => {
  let docPath = (req.query.path || '').replace(/\.\./g, '').replace(/^\/+/, '');
  if (!docPath) return res.status(400).json({ error: 'Invalid path' });
  if (!docPath.endsWith('.md')) docPath = docPath + '.md';
  const fullPath = path.join(DOCS_DIR, docPath);
  if (!fs.existsSync(fullPath) || !path.basename(fullPath).endsWith('.md')) {
    return res.status(404).json({ error: 'Not found' });
  }
  const raw = fs.readFileSync(fullPath, 'utf8');
  const html = marked.parse(raw, { async: false });
  res.json({ html, raw });
});

app.use(express.static(path.join(ROOT, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Docs at http://localhost:${PORT}`);
});
