declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

// Clear Next.js type errors while environment restoration completes
declare module 'next' {
  export interface NextConfig {
    productionBrowserSourceMaps?: boolean;
    [key: string]: any;
  }
}
declare module 'next/server';
declare module 'next/navigation';
declare module 'next/headers';

