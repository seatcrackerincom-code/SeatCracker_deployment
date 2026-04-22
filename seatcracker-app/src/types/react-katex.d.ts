declare module 'react-katex' {
  import * as React from 'react';

  interface KaTeXProps {
    math?: string;
    children?: string;
    block?: boolean;
    errorColor?: string;
    renderError?: (error: Error | TypeError) => React.ReactNode;
    settings?: any;
  }

  export class InlineMath extends React.Component<KaTeXProps> {}
  export class BlockMath extends React.Component<KaTeXProps> {}
}
