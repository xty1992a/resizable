export type Option = string | HTMLElement | ResizableOption;

export interface ResizableOption {
  container: string | HTMLElement;
  /**
   * Which child element under el will effect
   * default is resize-item
   * */
  itemClassName?: string;
  /**
   * Should resizer instance effect dom manual , MvvM developer maybe prefer effect dom by data
   * default is false
   * */
  effectManual?: boolean;
  /**
   * When drag start, carry the touched element call this function to get which item should be effect
   * default is find ancestors(include self) which one`s classList contain itemClassName
   * */
  getItemOnStart?: (el: HTMLElement) => HTMLElement | null;

  /**
   * When drag start, carry the touched element call this function to get effect in this drag
   * default is el => el.dataset.effect.split(',')
   * */
  getEffectOnStart?: (el: HTMLElement) => Effect[] | undefined;

  /**
   * When drag start, carry the touched element call this function to get initial points in this drag
   * default is el => el.dataset.effect.split(',')
   * */
  getPointsOnStart?: (el: HTMLElement) => Points | undefined;

  listenerFactory?: () => DragListenerInterface;
}

export interface SolidResizableOption {
  container: HTMLElement;
  itemClassName: string;
  effectManual: boolean;
  getItemOnStart: (el: HTMLElement) => HTMLElement | null;
  getEffectOnStart: (el: HTMLElement) => Effect[] | undefined;
  getPointsOnStart: (el: HTMLElement) => Points | undefined;
}

export type Effect = "start.x" | "start.y" | "end.x" | "end.y";

export type CallBack<T = any> = (payload: T) => any;

export interface IEmitAble {
  on<T = any>(event: string, cb: CallBack<T>): void;
  fire<T = any>(event: string, payload?: T): void;
  off(event: string, cb: CallBack): void;
  clear(event: string): void;
}

export interface DragListenerInterface {
  on(event: "start", cb: CallBack<HTMLElement>): void;
  on(event: "move", cb: CallBack<MoveEventPayload>): void;
  on(event: "end", cb: CallBack): void;

  fire(event: "start", payload: HTMLElement): void;
  fire(event: "move", payload: MoveEventPayload): void;
  fire(event: "end", payload?: any): void;

  listen(el: HTMLElement): void;
}

export interface IResizableInterface {
  on(event: "effect", cb: CallBack<EffectEventPayload>): void;
  fire(event: "effect", payload: EffectEventPayload): void;
}

export interface MoveEventPayload {
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
}

export interface EffectEventPayload {
  points: Points;
  target: HTMLElement;
  rect: Rect;
}

export interface Rect {
  width: number;
  height: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Points {
  start: Point;
  end: Point;
}
