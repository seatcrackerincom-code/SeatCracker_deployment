---
description: Vercel deployment strategy and SSG focus
---
# Vercel Optimization

## Responsibilities
- Prioritize SSG-first build decisions in all implementations
- Strictly avoid unnecessary or custom runtime API routes
- Continuously optimize application bundle size
- Apply strategies for fast initial/paint loads

## Global Standards (Apply to all skills)
- **Stack**: Next.js App Router + Tailwind CSS + Static JSON
- **UI**: Minimal, clean, mobile-first, responsive for desktop
- **Libraries**: No heavy libraries unless absolutely required
- **Deployment**: Vercel (prefer SSG, avoid runtime APIs)
- **Backend Architecture**: Node.js backend only for auth and AI proxy routes
- **Performance**: Performance first (fast load, low bundle size)
