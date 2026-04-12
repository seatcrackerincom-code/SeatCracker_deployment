---
description: Security and management for API proxy routes
---
# API Management

## Responsibilities
- Secure API keys strictly in `.env.local` and Vercel environments
- Ensure there is NO client-side key exposure
- Implement the Next.js API proxy pattern for security
- Code rate limiting structures (enforced per user/session)
- Provide solid error handling (intercept quota exceeded, invalid key issues)
- Design and integrate multi-key fallback rotation
- Monitor and structure usage tracking (token logging) integrations

## Global Standards (Apply to all skills)
- **Stack**: Next.js App Router + Tailwind CSS + Static JSON
- **UI**: Minimal, clean, mobile-first, responsive for desktop
- **Libraries**: No heavy libraries unless absolutely required
- **Deployment**: Vercel (prefer SSG, avoid runtime APIs)
- **Backend Architecture**: Node.js backend only for auth and AI proxy routes
- **Performance**: Performance first (fast load, low bundle size)
