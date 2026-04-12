20:05:28.662 Running build in Washington, D.C., USA (East) – iad1
20:05:28.662 Build machine configuration: 2 cores, 8 GB
20:05:28.885 Cloning github.com/seatcrackerincom-code/SeatCracker_deployment (Branch: main, Commit: ff02821)
20:05:36.598 Cloning completed: 7.713s
20:05:39.034 Restored build cache from previous deployment (4Za7MiW8T77CSsN9Dh9zFkmiiSbg)
20:05:41.182 Running "vercel build"
20:05:41.797 Vercel CLI 50.42.0
20:05:42.996 Running "install" command: `npm install`...
20:06:01.840 
20:06:01.840 added 1 package, removed 39 packages, changed 20 packages, and audited 412 packages in 19s
20:06:01.841 
20:06:01.841 138 packages are looking for funding
20:06:01.841   run `npm fund` for details
20:06:01.844 
20:06:01.844 1 critical severity vulnerability
20:06:01.844 
20:06:01.847 To address all issues, run:
20:06:01.848   npm audit fix
20:06:01.848 
20:06:01.850 Run `npm audit` for details.
20:06:01.882 Detected Next.js version: 15.5.15
20:06:01.882 Running "npm run build"
20:06:02.057 
20:06:02.058 > seatcracker-app@0.1.0 build
20:06:02.058 > next build
20:06:02.058 
20:06:03.260    ▲ Next.js 15.5.15
20:06:03.261 
20:06:03.306    Creating an optimized production build ...
20:06:22.065  ✓ Compiled successfully in 15.9s
20:06:22.068    Linting and checking validity of types ...
20:06:28.312 
20:06:28.316 Failed to compile.
20:06:28.317 
20:06:28.317 ./src/app/contact/page.tsx
20:06:28.317 29:15  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
20:06:28.317 
20:06:28.317 ./src/app/cookies/page.tsx
20:06:28.317 29:157  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
20:06:28.317 
20:06:28.317 ./src/app/performance/page.tsx
20:06:28.317 205:87  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
20:06:28.317 205:92  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
20:06:28.317 
20:06:28.317 ./src/components/ExamPractice.tsx
20:06:28.318 292:6  Warning: React Hook useCallback has an unnecessary dependency: 'allProgress'. Either exclude it or remove the dependency array.  react-hooks/exhaustive-deps
20:06:28.318 922:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:06:28.318 
20:06:28.318 ./src/components/GlobalHeader.tsx
20:06:28.318 80:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:06:28.318 
20:06:28.318 ./src/components/IntroPage.tsx
20:06:28.318 28:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:06:28.318 
20:06:28.318 ./src/components/LoginScreen.tsx
20:06:28.319 111:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:06:28.319 240:50  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
20:06:28.319 
20:06:28.319 ./src/components/PolicyConsentModal.tsx
20:06:28.319 125:52  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
20:06:28.320 125:65  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
20:06:28.320 136:54  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
20:06:28.320 136:66  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
20:06:28.320 136:68  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
20:06:28.320 136:91  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
20:06:28.320 136:97  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
20:06:28.323 136:114  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
20:06:28.323 142:40  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
20:06:28.323 142:46  Error: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
20:06:28.324 
20:06:28.324 ./src/components/PolicyGuard.tsx
20:06:28.324 42:6  Warning: React Hook useEffect has a missing dependency: 'setPoliciesAccepted'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
20:06:28.324 
20:06:28.325 ./src/components/ProfileModal.tsx
20:06:28.325 201:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:06:28.325 
20:06:28.325 ./src/components/RoadmapMode.tsx
20:06:28.325 353:27  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:06:28.325 387:49  Error: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
20:06:28.326 
20:06:28.326 ./src/components/RoadmapPage.tsx
20:06:28.327 195:9  Warning: The 'subjects' logical expression could make the dependencies of useEffect Hook (at line 259) change on every render. To fix this, wrap the initialization of 'subjects' in its own useMemo() Hook.  react-hooks/exhaustive-deps
20:06:28.327 195:9  Warning: The 'subjects' logical expression could make the dependencies of useCallback Hook (at line 317) change on every render. To fix this, wrap the initialization of 'subjects' in its own useMemo() Hook.  react-hooks/exhaustive-deps
20:06:28.327 
20:06:28.327 ./src/components/SyllabusPage.tsx
20:06:28.328 86:6  Warning: React Hook useEffect has a missing dependency: 'subjects'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
20:06:28.328 
20:06:28.328 info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
20:06:28.367 Error: Command "npm run build" exited with 1