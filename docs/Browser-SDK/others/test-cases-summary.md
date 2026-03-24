# Test Cases Summary

This document summarizes all **14 test cases** in the TestMu Browser SDK test suite. They live in the [testmu-browser-sdk/test-features](https://github.com/4DvAnCeBoY/testmu-browser-sdk/tree/main/test-features) directory and validate SDK behavior against LambdaTest/TestMu AI Browser Cloud.

**Run any test:** `npx ts-node test-features/<filename>.ts` (from repo root, with `LT_USERNAME` and `LT_ACCESS_KEY` set).

---

## 01 — Sessions

### 01a — Session Creation with Puppeteer

| | |
|---|---|
| **File** | `01a-session-create-puppeteer.ts` |
| **What it tests** | Create a cloud session with `adapter: 'puppeteer'`, connect via `client.puppeteer.connect(session)`, navigate to google.com, then release. |
| **Checks** | Session has valid ID and WebSocket URL; Puppeteer connects; page loads; session releases. |
| **Dashboard** | Build: "SDK Tests - Session Creation", Name: "Puppeteer Adapter Test". |

### 01b — Session Creation with Playwright

| | |
|---|---|
| **File** | `01b-session-create-playwright.ts` |
| **What it tests** | Same flow with `adapter: 'playwright'`. Uses `client.playwright.connect(session)` and gets `{ browser, page }`. |
| **Checks** | Session created with Playwright endpoint; browser connects; google.com loads; session released. |
| **Dashboard** | Build: "SDK Tests - Session Creation", Name: "Playwright Adapter Test". |

### 01c — Session Lifecycle

| | |
|---|---|
| **File** | `01c-session-lifecycle.ts` |
| **What it tests** | In-memory session tracking: create 3 sessions, `sessions.list()`, `sessions.retrieve(id)`, `sessions.release(id)`, `sessions.releaseAll()`. |
| **Checks** | All IDs unique; list returns 3; retrieve finds session 2; retrieve('fake') is undefined; after release, count is 2; after releaseAll, count is 0. |
| **Note** | Does not connect to real browsers; sessions do not appear on LambdaTest dashboard. |

### 01d — Session Config Options

| | |
|---|---|
| **File** | `01d-session-config-options.ts` |
| **What it tests** | Different session configs: custom dimensions (1280×720), Windows 11 + Chrome, macOS Ventura + Chrome, Windows 10 + Edge. |
| **Checks** | Each session connects; viewport/platform/browser match config; sessions released. |
| **Dashboard** | Build: "SDK Tests - Config Options". |

### 01e — Session Creation with Selenium

| | |
|---|---|
| **File** | `01e-session-create-selenium.ts` |
| **What it tests** | Create session with `adapter: 'selenium'`, connect via `client.selenium.connect(session)`, get WebDriver, navigate and release. |
| **Checks** | Session created; Selenium WebDriver connects; page loads; session released. |
| **Dashboard** | Build: "SDK Tests - Session Creation", Name: "Selenium Adapter Test". |

---

## 02 — Quick Actions

### 02a — Quick Scrape

| | |
|---|---|
| **File** | `02a-quick-scrape.ts` |
| **What it tests** | Scrape content from URLs using a cloud session: register page with `client.quick.registerSessionPage(session.id, page)`, then call `client.scrape({ url, sessionId })` with different formats (e.g. html, markdown, text). |
| **Checks** | Scrape returns content; format options work; session used for quick actions. |

### 02b — Quick Screenshot

| | |
|---|---|
| **File** | `02b-quick-screenshot.ts` |
| **What it tests** | Screenshot via cloud session: viewport-only, full-page, JPEG with quality, and screenshot with delay. |
| **Checks** | `client.screenshot({ url, fullPage, format, quality, delay, sessionId })` returns buffer; files written to `test-output/`. |
| **Output** | `screenshot-viewport.png`, `screenshot-fullpage.png`, `screenshot-quality.jpg`, `screenshot-delay.png`. |

### 02c — Quick PDF

| | |
|---|---|
| **File** | `02c-quick-pdf.ts` |
| **What it tests** | PDF generation via cloud session: A4, Letter+landscape, custom margins, printBackground. |
| **Checks** | `client.pdf({ url, format, landscape, margin, printBackground, sessionId })` returns buffer; PDFs saved. |
| **Output** | `pdf-basic-a4.pdf`, `pdf-landscape.pdf`, `pdf-margins.pdf`, `pdf-background.pdf`. |

---

## 03 — Context Service

| | |
|---|---|
| **File** | `03-context-service.ts` |
| **What it tests** | Cookie transfer across sessions using httpbin.org. |
| **Flow** | **Session 1:** Set cookies via httpbin, visit `/cookies`, extract context with `client.context.getContext(page1)`. **Session 2:** Fresh browser, visit `/cookies` → no cookies. **Session 3:** Inject with `client.context.setCookies(page3, savedContext.cookies)`, visit `/cookies` → same cookies as Session 1. |
| **Checks** | S1 has cookies; S2 has none; S3 has injected cookies; screenshots in `test-output/`. |

---

## 04 — Tunnel Service

| | |
|---|---|
| **File** | `04-tunnel-service.ts` |
| **What it tests** | LambdaTest tunnel: start local HTTP server → start tunnel with `client.tunnel.start({ user, key, tunnelName })` → create session with `tunnel: true, tunnelName` → cloud browser visits localhost → stop tunnel. |
| **Checks** | Tunnel starts and `getStatus()` is true; session can load localhost page; tunnel stops and status is false. |

---

## 05 — Profile Service

| | |
|---|---|
| **File** | `05-profile-service.ts` |
| **What it tests** | Profile save/load across runs: set cookie + localStorage in Session 1, `client.profiles.saveProfile(id, page1)` → Session 2 (fresh), `client.profiles.loadProfile(id, page2)` → verify cookie and storage; visit httpbin.org/cookies as proof. |
| **Checks** | Saved profile file contains cookie/storage; after load, values match; screenshot of httpbin/cookies. |
| **Config** | `client.profiles.setConfig({ profilesDir: 'test-output/profiles' })`. |

---

## 06 — Extension Service

| | |
|---|---|
| **File** | `06-extension-service.ts` |
| **What it tests** | Loading Chrome extensions in cloud sessions. **Test 1:** Session with `'LT:Options': { 'lambda:loadExtension': [S3_URL] }`. **Test 2:** `client.extensions.registerCloudExtension(url)` then session with `extensionIds: [ext.id]`. |
| **Checks** | Extension loads (e.g. banner on example.com); screenshots: `extension-t1-direct.png`, `extension-t2-sdk.png`. |
| **Prereq** | Extension ZIP uploaded to LambdaTest (e.g. via API). |

---

## 07 — File Service

| | |
|---|---|
| **File** | `07-file-service.ts` |
| **What it tests** | **Test 1 (Upload):** Local file → `client.files.uploadToInput(page, '#file-upload', filePath)` on the-internet.herokuapp.com/upload; submit and verify filename. **Test 2 (Download URL):** `client.files.downloadFromUrl(page, url, filename)` from httpbin.org/json. **Test 3 (Download click):** Download link on the-internet.herokuapp.com/download; use `downloadFromUrl` or CDP interception. |
| **Checks** | Uploaded filename correct; downloaded files in `test-output/downloads` with correct content. |

---

## 08 — Stealth Mode

| | |
|---|---|
| **File** | `08-stealth-mode.ts` |
| **What it tests** | Stealth ON vs OFF: **Session 1** Puppeteer + stealth ON → bot.sannysoft.com, check `navigator.webdriver`, UA, viewport; **Session 2** Puppeteer + `skipFingerprintInjection: true`; **Session 3** Playwright + stealth ON. |
| **Checks** | Stealth ON: `webdriver === false`, randomized UA/viewport; Stealth OFF: `webdriver === true`. |
| **Output** | `stealth-puppeteer-ON.png`, `stealth-puppeteer-OFF.png`, `stealth-playwright-ON.png` in `test-output/`. |

---

## Quick Reference

| # | File | Feature |
|---|------|---------|
| 01a | `01a-session-create-puppeteer.ts` | Sessions + Puppeteer |
| 01b | `01b-session-create-playwright.ts` | Sessions + Playwright |
| 01c | `01c-session-lifecycle.ts` | Session list/retrieve/release/releaseAll |
| 01d | `01d-session-config-options.ts` | Dimensions, OS, browser options |
| 01e | `01e-session-create-selenium.ts` | Sessions + Selenium |
| 02a | `02a-quick-scrape.ts` | Quick Actions: scrape |
| 02b | `02b-quick-screenshot.ts` | Quick Actions: screenshot |
| 02c | `02c-quick-pdf.ts` | Quick Actions: PDF |
| 03 | `03-context-service.ts` | Context: cookies across sessions |
| 04 | `04-tunnel-service.ts` | Tunnel: localhost from cloud |
| 05 | `05-profile-service.ts` | Profiles: save/load state |
| 06 | `06-extension-service.ts` | Extensions: load in session |
| 07 | `07-file-service.ts` | Files: upload/download |
| 08 | `08-stealth-mode.ts` | Stealth: ON/OFF comparison |

All tests use `import { testMuBrowser } from '../dist/testMuBrowser'` and `const client = new testMuBrowser()` (or the published package `@testmuai/browser-cloud` with `Browser` when using the npm package).
