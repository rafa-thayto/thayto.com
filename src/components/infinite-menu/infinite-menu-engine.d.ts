export interface InfiniteMenuItem {
  image: string
  link: string
  title: string
  description: string
}

export class InfiniteGridMenu {
  constructor(
    canvas: HTMLCanvasElement,
    items: InfiniteMenuItem[],
    onActiveItemChange: (index: number) => void,
    onMovementChange: (isMoving: boolean) => void,
    onInit?: ((instance: InfiniteGridMenu) => void) | null,
    scale?: number,
  )
  run(time?: number): void
  resize(): void
  /** Cancels the requestAnimationFrame loop. */
  stop(): void
  /** Full teardown: stops the loop, removes listeners, frees GL resources. */
  dispose(): void
}

export const defaultItems: InfiniteMenuItem[]
