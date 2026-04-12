20:18:40.359 Running build in Washington, D.C., USA (East) – iad1
20:18:40.359 Build machine configuration: 2 cores, 8 GB
20:18:40.473 Cloning github.com/seatcrackerincom-code/SeatCracker_deployment (Branch: main, Commit: 3033591)
20:18:46.009 Cloning completed: 5.536s
20:18:46.258 Restored build cache from previous deployment (4Za7MiW8T77CSsN9Dh9zFkmiiSbg)
20:18:46.639 Running "vercel build"
20:18:47.642 Vercel CLI 50.42.0
20:18:48.229 Running "install" command: `npm install`...
20:19:05.108 
20:19:05.109 added 1 package, removed 39 packages, changed 20 packages, and audited 412 packages in 17s
20:19:05.109 
20:19:05.110 138 packages are looking for funding
20:19:05.110   run `npm fund` for details
20:19:05.112 
20:19:05.113 1 critical severity vulnerability
20:19:05.113 
20:19:05.113 To address all issues, run:
20:19:05.113   npm audit fix
20:19:05.114 
20:19:05.114 Run `npm audit` for details.
20:19:05.153 Detected Next.js version: 15.5.15
20:19:05.154 Running "npm run build"
20:19:05.285 
20:19:05.285 > seatcracker-app@0.1.0 build
20:19:05.286 > next build
20:19:05.286 
20:19:06.128    ▲ Next.js 15.5.15
20:19:06.128 
20:19:06.202    Creating an optimized production build ...
20:19:24.103  ✓ Compiled successfully in 15.3s
20:19:24.106    Linting and checking validity of types ...
20:19:29.488 
20:19:29.488 ./src/components/ExamPractice.tsx
20:19:29.488 292:6  Warning: React Hook useCallback has an unnecessary dependency: 'allProgress'. Either exclude it or remove the dependency array.  react-hooks/exhaustive-deps
20:19:29.488 922:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:19:29.488 
20:19:29.489 ./src/components/GlobalHeader.tsx
20:19:29.489 80:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:19:29.489 
20:19:29.489 ./src/components/IntroPage.tsx
20:19:29.489 28:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:19:29.489 
20:19:29.489 ./src/components/LoginScreen.tsx
20:19:29.490 111:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:19:29.490 
20:19:29.490 ./src/components/PolicyGuard.tsx
20:19:29.490 42:6  Warning: React Hook useEffect has a missing dependency: 'setPoliciesAccepted'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
20:19:29.490 
20:19:29.490 ./src/components/ProfileModal.tsx
20:19:29.490 201:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:19:29.491 
20:19:29.491 ./src/components/RoadmapMode.tsx
20:19:29.491 353:27  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:19:29.491 
20:19:29.491 ./src/components/RoadmapPage.tsx
20:19:29.492 195:9  Warning: The 'subjects' logical expression could make the dependencies of useEffect Hook (at line 259) change on every render. To fix this, wrap the initialization of 'subjects' in its own useMemo() Hook.  react-hooks/exhaustive-deps
20:19:29.492 195:9  Warning: The 'subjects' logical expression could make the dependencies of useCallback Hook (at line 317) change on every render. To fix this, wrap the initialization of 'subjects' in its own useMemo() Hook.  react-hooks/exhaustive-deps
20:19:29.492 
20:19:29.492 ./src/components/SyllabusPage.tsx
20:19:29.492 86:6  Warning: React Hook useEffect has a missing dependency: 'subjects'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
20:19:29.493 
20:19:29.493 info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
20:19:33.145 Failed to compile.
20:19:33.145 
20:19:33.145 ./src/app/layout.tsx:1:15
20:19:33.145 Type error: Module '"next"' has no exported member 'Metadata'.
20:19:33.145 
20:19:33.145 [0m[31m[1m>[22m[39m[90m 1 |[39m [36mimport[39m type { [33mMetadata[39m[33m,[39m [33mViewport[39m } [36mfrom[39m [32m"next"[39m[33m;[39m
20:19:33.146  [90m   |[39m               [31m[1m^[22m[39m
20:19:33.146  [90m 2 |[39m [36mimport[39m [32m"./globals.css"[39m[33m;[39m
20:19:33.146  [90m 3 |[39m
20:19:33.146  [90m 4 |[39m [36mexport[39m [36mconst[39m metadata[33m:[39m [33mMetadata[39m [33m=[39m {[0m
20:19:33.170 Next.js build worker exited with code: 1 and signal: null
20:19:33.195 Error: Command "npm run build" exited with 1