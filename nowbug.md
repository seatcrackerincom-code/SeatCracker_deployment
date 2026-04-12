20:09:41.515 Running build in Washington, D.C., USA (East) – iad1
20:09:41.515 Build machine configuration: 2 cores, 8 GB
20:09:41.645 Cloning github.com/seatcrackerincom-code/SeatCracker_deployment (Branch: main, Commit: 4a37d92)
20:09:47.786 Cloning completed: 6.141s
20:09:49.681 Restored build cache from previous deployment (4Za7MiW8T77CSsN9Dh9zFkmiiSbg)
20:09:51.091 Running "vercel build"
20:09:51.783 Vercel CLI 50.42.0
20:09:52.729 Running "install" command: `npm install`...
20:10:09.749 
20:10:09.750 added 1 package, removed 39 packages, changed 20 packages, and audited 412 packages in 17s
20:10:09.750 
20:10:09.751 138 packages are looking for funding
20:10:09.751   run `npm fund` for details
20:10:09.753 
20:10:09.753 1 critical severity vulnerability
20:10:09.754 
20:10:09.754 To address all issues, run:
20:10:09.754   npm audit fix
20:10:09.754 
20:10:09.756 Run `npm audit` for details.
20:10:09.792 Detected Next.js version: 15.5.15
20:10:09.793 Running "npm run build"
20:10:09.899 
20:10:09.899 > seatcracker-app@0.1.0 build
20:10:09.899 > next build
20:10:09.900 
20:10:10.878    ▲ Next.js 15.5.15
20:10:10.879 
20:10:10.925    Creating an optimized production build ...
20:10:29.530  ✓ Compiled successfully in 15.9s
20:10:29.533    Linting and checking validity of types ...
20:10:34.704 
20:10:34.704 ./src/components/ExamPractice.tsx
20:10:34.704 292:6  Warning: React Hook useCallback has an unnecessary dependency: 'allProgress'. Either exclude it or remove the dependency array.  react-hooks/exhaustive-deps
20:10:34.705 922:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:10:34.705 
20:10:34.705 ./src/components/GlobalHeader.tsx
20:10:34.705 80:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:10:34.706 
20:10:34.706 ./src/components/IntroPage.tsx
20:10:34.706 28:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:10:34.707 
20:10:34.707 ./src/components/LoginScreen.tsx
20:10:34.707 111:13  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:10:34.708 
20:10:34.708 ./src/components/PolicyGuard.tsx
20:10:34.710 42:6  Warning: React Hook useEffect has a missing dependency: 'setPoliciesAccepted'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
20:10:34.710 
20:10:34.711 ./src/components/ProfileModal.tsx
20:10:34.711 201:17  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:10:34.711 
20:10:34.711 ./src/components/RoadmapMode.tsx
20:10:34.712 353:27  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
20:10:34.712 
20:10:34.712 ./src/components/RoadmapPage.tsx
20:10:34.712 195:9  Warning: The 'subjects' logical expression could make the dependencies of useEffect Hook (at line 259) change on every render. To fix this, wrap the initialization of 'subjects' in its own useMemo() Hook.  react-hooks/exhaustive-deps
20:10:34.712 195:9  Warning: The 'subjects' logical expression could make the dependencies of useCallback Hook (at line 317) change on every render. To fix this, wrap the initialization of 'subjects' in its own useMemo() Hook.  react-hooks/exhaustive-deps
20:10:34.715 
20:10:34.715 ./src/components/SyllabusPage.tsx
20:10:34.715 86:6  Warning: React Hook useEffect has a missing dependency: 'subjects'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
20:10:34.716 
20:10:34.716 info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
20:10:40.218 Failed to compile.
20:10:40.218 
20:10:40.218 ./node_modules_salvaged/fastq/test/example.ts:6:15
20:10:40.218 Type error: This expression is not callable.
20:10:40.219   Type 'typeof fastq' has no call signatures.
20:10:40.219 
20:10:40.219 [0m [90m 4 |[39m [90m// Basic example[39m
20:10:40.219  [90m 5 |[39m
20:10:40.219 [31m[1m>[22m[39m[90m 6 |[39m [36mconst[39m queue [33m=[39m fastq(worker[33m,[39m [35m1[39m)
20:10:40.219  [90m   |[39m               [31m[1m^[22m[39m
20:10:40.219  [90m 7 |[39m
20:10:40.219  [90m 8 |[39m queue[33m.[39mpush([32m'world'[39m[33m,[39m (err[33m,[39m result) [33m=>[39m {
20:10:40.219  [90m 9 |[39m   [36mif[39m (err) [36mthrow[39m err[0m
20:10:40.250 Next.js build worker exited with code: 1 and signal: null
20:10:40.274 Error: Command "npm run build" exited with 1