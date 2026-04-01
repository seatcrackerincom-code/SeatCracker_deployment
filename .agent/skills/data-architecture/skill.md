---
description: EAMCET JSON schema and fast access patterns
---
# Data Architecture

## Responsibilities
- Design EAMCET JSON schema with clear MPC / BiPC / COMMON separation
- Ensure data is optimized with no duplication for shared subjects (e.g., Physics & Chemistry)
- Enable fast frontend access patterns for static content
- Maintain a scalable structure for roadmap tracking and test generation

## Global Standards (Apply to all skills)
- **Stack**: Next.js App Router + Tailwind CSS + Static JSON
- **UI**: Minimal, clean, mobile-first, responsive for desktop
- **Libraries**: No heavy libraries unless absolutely required
- **Deployment**: Vercel (prefer SSG, avoid runtime APIs)
- **Backend Architecture**: Node.js backend only for auth and AI proxy routes
- **Performance**: Performance first (fast load, low bundle size)
