---
description: Step-by-step implementation guide for core platform features
---
# Feature Builder

## Dependencies
- Depends on `data-architecture`, `roadmap-generator`, `frontend-nextjs`, and `ui-ux-responsive`

## Responsibilities
- Build features iteratively and step-by-step:
  1. Login + onboarding
  2. Exam / Stream / Goal selection
  3. Syllabus browser with filters
  4. Roadmap generator UI
  5. Mock test system

## Global Standards (Apply to all skills)
- **Stack**: Next.js App Router + Tailwind CSS + Static JSON
- **UI**: Minimal, clean, mobile-first, responsive for desktop
- **Libraries**: No heavy libraries unless absolutely required
- **Deployment**: Vercel (prefer SSG, avoid runtime APIs)
- **Backend Architecture**: Node.js backend only for auth and AI proxy routes
- **Performance**: Performance first (fast load, low bundle size)
