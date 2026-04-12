---
description: Standards for debugging Next.js and Node.js code
---
# Bug Fixing

## Responsibilities
- Debug Next.js App Router and Node.js (auth/AI) issues
- Adopt a minimal fix approach: do not rewrite working modules
- Provide short, concise root cause explanations when modifying functionality

## Global Standards (Apply to all skills)
- **Stack**: Next.js App Router + Tailwind CSS + Static JSON
- **UI**: Minimal, clean, mobile-first, responsive for desktop
- **Libraries**: No heavy libraries unless absolutely required
- **Deployment**: Vercel (prefer SSG, avoid runtime APIs)
- **Backend Architecture**: Node.js backend only for auth and AI proxy routes
- **Performance**: Performance first (fast load, low bundle size)
