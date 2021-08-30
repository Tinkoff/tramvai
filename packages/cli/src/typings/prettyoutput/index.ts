declare module 'prettyoutput' {
  interface Options {
    maxDepth?: number;
    hideUndefined?: boolean;
  }

  export default function prettyoutput(
    data: Record<string, any>,
    options?: Options,
    indent?: number
  ): string;
}
