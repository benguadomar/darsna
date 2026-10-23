# Darsna

**Good study resources. One trusted place.**

Live demo: https://benguadomar.github.io/darsna/
Video walkthrough: https://youtu.be/YfPt58c63bE

Darsna helps Moroccan high-school students rescue study links that get lost in class group chats, and keeps them in a clear, multilingual library with visible source, freshness, and review information.

## The problem

Useful study material is spread across WhatsApp chats, old Drive folders, and websites in Arabic, French, and English. Links get lost, are shared again and again, or quietly stop working, and students cannot quickly tell which resources are credible. In a quick check with 10 classmates, most said the same study links keep getting re-sent in their group chats before exams.

## Features

- **Link Rescue.** Paste a WhatsApp conversation (or any messy text). Darsna extracts every link, removes duplicates and tracking parameters, guesses the subject from the surrounding message in Arabic, Darija, French, or English, and labels the source:
  - `.gov.ma` domains are marked **Official source**.
  - Known education platforms are marked **Trusted platform**.
  - Everything else stays **Not reviewed**.
  - Shortened links (bit.ly, etc.) and shared files (Drive, Dropbox) get a warning because their destination can be hidden or disappear.
- **One-link sharing.** Saved resources can be shared as a single link or straight to WhatsApp. The whole list is encoded inside the link itself, so nothing is uploaded and no account is needed. Opening a shared link shows the collection with a "Save all" option.
- **Searchable library** filtered by subject, level, language, and format, with honest trust labels on every card.
- **Arabic, French, and English**, including a full right-to-left layout. The language choice is remembered.
- **Display options** for larger text and high contrast, a skip-to-content link, and animations that respect the system's reduced-motion setting.
- **Private by design.** Favorites, rescued links, and pasted chats stay in the browser's local storage.
- **Works offline** after the first visit, thanks to a small service worker.

This is a hackathon prototype: the curated library is small, and two entries marked "Demo example" illustrate how unreviewed suggestions appear. A production version would add moderated submissions, teacher review, automatic broken-link checks, and curriculum mapping.

## Run locally

```bash
npm install
npm run dev
```

Checks:

```bash
npm test
npm run lint
npm run build
```

The tests cover link extraction (chat prefixes, duplicates, tracking parameters, look-alike domains) and the shared-link encoding, including rejection of unsafe `javascript:` links.

## Technology

- React 19 and TypeScript
- Vite
- Vitest
- Lucide icons
- Browser local storage and a service worker

## Responsible AI disclosure

Cursor was used as an AI coding assistant for implementation, copy refinement, debugging, and the automated demo recording. The concept, problem selection, product decisions, testing, and final submission remain the participant's responsibility. The project does not send student data to an AI service.

## About

Darsna was created in October 2026 by a student in Casablanca.
