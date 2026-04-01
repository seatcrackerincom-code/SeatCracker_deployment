---
description: Lightweight local state management strategy
---
# State Management

## Responsibilities
- Rely solely on `localStorage` for main context tracking:
  - User info
  - Selections
  - Progress tracking
- Utilize lightweight global state solutions natively (no heavy libraries)
- Assure syncing of UI components against stored local data natively
- Persist dynamic data appropriately, such as the roadmap object

## Global Standards (Apply to all skills)
- **Stack**: Next.js App Router + Tailwind CSS + Static JSON
- **UI**: Minimal, clean, mobile-first, responsive for desktop
- **Libraries**: No heavy libraries unless absolutely required
- **Deployment**: Vercel (prefer SSG, avoid runtime APIs)
- **Backend Architecture**: Node.js backend only for auth and AI proxy routes
- **Performance**: Performance first (fast load, low bundle size)
