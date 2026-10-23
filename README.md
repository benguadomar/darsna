# Darsna

**Good study resources. One trusted place.**

Live demo: https://benguadomar.github.io/darsna/

Darsna is a multilingual study-resource library designed for Moroccan high-school students. It turns scattered links, PDFs, videos, and interactive tools into a clear collection with visible source, freshness, and review information.

## The problem

Useful study material is spread across WhatsApp chats, old Drive folders, and websites in Arabic, French, and English. Links get lost, repeat, or become outdated, and students cannot quickly tell which resources are credible.

## What the prototype does

- Searches and filters resources by subject, level, language, and format.
- Shows transparent trust labels, original sources, and review dates.
- Supports English, French, and Arabic with a full RTL interface.
- Saves favorites locally without requiring an account.
- Lets students suggest a resource without uploading personal data.
- Works across desktop and mobile layouts.

The current hackathon build uses a small curated dataset and stores suggestions and favorites only in the browser. Entries marked "Demo example" illustrate how unreviewed suggestions appear. A production version would add moderated community submissions, teacher review, broken-link checks, and curriculum mapping.

## Run locally

```bash
npm install
npm run dev
```

Production check:

```bash
npm run build
npm run lint
```

## Technology

- React 19
- TypeScript
- Vite
- Lucide icons
- Browser local storage

## Responsible AI disclosure

Cursor was used as an AI coding assistant for implementation, copy refinement, and debugging. The concept, problem selection, product decisions, testing, and final submission remain the participant's responsibility. The project does not send student data to an AI service.

## Neighborhood Hacks 2026

Darsna was created during the official Neighborhood Hacks 2026 build period for the Education & Access track.
