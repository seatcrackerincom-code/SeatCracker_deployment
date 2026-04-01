---
description: Logic for day-wise EAMCET study plan generation
---
# Roadmap Generator

## Dependencies
- Depends on `data-architecture`

## Responsibilities
- Handle inputs: stream (MPC/BiPC), exam date, and user's weak topics
- Control output: generate a complete day-wise study plan
- Sort curriculum by priority and weightage mapping
- Balance the daily workload for users
- Ensure logic dynamically adjusts based on the remaining days until the exam

## Global Standards (Apply to all skills)
- **Stack**: Next.js App Router + Tailwind CSS + Static JSON
- **UI**: Minimal, clean, mobile-first, responsive for desktop
- **Libraries**: No heavy libraries unless absolutely required
- **Deployment**: Vercel (prefer SSG, avoid runtime APIs)
- **Backend Architecture**: Node.js backend only for auth and AI proxy routes
- **Performance**: Performance first (fast load, low bundle size)
