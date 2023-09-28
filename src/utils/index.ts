import * as types from "../../type";
import { IEmitAble } from "../../type";
export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

/**
 * @description Tiny emit base class
 * */
export class EmitAble implements IEmitAble {
  _task: Record<string, types.CallBack[]> = {};

  on<T = any>(event: string, callback: types.CallBack<T>) {
    this._task[event] = this._task[event] || [];
    this._task[event].push(callback);
  }

  fire<T = any>(event: string, payload?: T) {
    const task = this._task[event] || [];
    task.forEach((callback) => callback(payload));
  }

  off(event: string, callback: types.CallBack) {
    const task = this._task[event] || [];
    this._task[event] = task.filter((cb) => cb !== callback);
  }

  clear(event: string) {
    delete this._task[event];
  }
}

/**
 * @description Like jQuery [closest]
 * */
export function closest(
  start: HTMLElement,
  match: (el: HTMLElement | null) => boolean,
  stop = document.body,
) {
  let now: HTMLElement | null | undefined = start;
  do {
    if (match(now)) return now;
    now = now?.parentElement;
  } while (!now || now !== stop);
  return null;
}

export function rectToPoints(rect: types.Rect): types.Points {
  return {
    start: { x: rect.left, y: rect.top },
    end: { x: rect.left + rect.width, y: rect.top + rect.height },
  };
}

export function pointsToRect(points: types.Points): types.Rect {
  const { start, end } = points;
  return {
    top: start.y,
    left: start.x,
    bottom: end.y,
    right: end.x,
    width: end.x - start.x,
    height: end.y - start.y,
  };
}
export const toFixed = (num: number, count = 6) => Number(num.toFixed(count));
export const copy = (o) => JSON.parse(JSON.stringify(o));

/**
 * @description
 * */
export function parseEffect(effect: types.Effect) {
  const [who, what] = effect.split(".") as ["start" | "end", "x" | "y"];
  if (!["start", "end"].includes(who)) return null;
  if (!["x", "y"].includes(what)) return null;
  const deltaProp = `delta${what.toUpperCase()}` as "deltaX" | "deltaY";
  const sizeProp = what === "x" ? "width" : ("height" as "width" | "height");
  return {
    who,
    what,
    deltaProp,
    sizeProp,
  };
}
