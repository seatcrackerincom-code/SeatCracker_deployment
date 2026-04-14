import { FC, AnchorHTMLAttributes, PropsWithChildren, ImgHTMLAttributes } from 'react';
import { LinkProps } from 'next/dist/client/link';
import { ImageProps } from 'next/dist/client/image-component';

declare module 'next/link' {
  const Link: FC<PropsWithChildren<LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>>>;
  export default Link;
}

declare module 'next/image' {
  const Image: FC<ImageProps & ImgHTMLAttributes<HTMLImageElement>>;
  export default Image;
}

declare module 'next/navigation' {
  export function useRouter(): any;
  export function usePathname(): string;
  export function useSearchParams(): any;
  export function useParams(): any;
  export function redirect(url: string): never;
  export function notFound(): never;
}
