declare module 'epubjs' {
  interface Rendition {
    display(target?: string): Promise<unknown>
    next(): Promise<unknown>
    prev(): Promise<unknown>
    destroy(): void
    themes: {
      register(name: string, rules: Record<string, Record<string, string>>): void
      select(name: string): void
      fontSize(size: string): void
    }
    on(event: string, callback: (...args: unknown[]) => void): void
  }

  interface Book {
    ready: Promise<void>
    loaded: {
      metadata: Promise<{ title?: string; creator?: string }>
    }
    renderTo(
      element: HTMLElement,
      options: Record<string, unknown>,
    ): Rendition
    coverUrl(): Promise<string | null>
    destroy(): void
  }

  export default function ePub(input: ArrayBuffer | string): Book
}
