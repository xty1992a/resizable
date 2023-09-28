import { EmitAble } from "@/utils/index";
import * as types from "../../type";
export const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

export class DomListener
  extends EmitAble
  implements types.DragListenerInterface
{
  unListenList: Function[] = [];
  private started = false;
  currentX = 0;
  currentY = 0;
  deltaX = 0;
  deltaY = 0;

  unListen() {
    this.unListenList.forEach((fn) => fn());
    this.unListenList = [];
  }

  listen(el: HTMLElement) {
    this.unListen();
    if (isMobile) {
      el.addEventListener("touchstart", this.start, { capture: true });
      el.addEventListener("touchmove", this.move);
      el.addEventListener("touchend", this.end);
      el.addEventListener("touchcancel", this.end);
      this.unListenList.push(() => {
        el.removeEventListener("touchstart", this.start);
        el.removeEventListener("touchmove", this.move);
        el.removeEventListener("touchend", this.end);
        el.removeEventListener("touchcancel", this.end);
      });
    } else {
      el.addEventListener("mousedown", this.start, { capture: true });
      el.addEventListener("mousemove", this.move);
      el.addEventListener("mouseup", this.end);
      el.addEventListener("mouseleave", this.end);
      this.unListenList.push(() => {
        el.removeEventListener("mousedown", this.start);
        el.removeEventListener("mousemove", this.move);
        el.removeEventListener("mouseup", this.end);
        el.removeEventListener("mouseleave", this.end);
      });
    }
  }

  start = (e: TouchEvent | MouseEvent) => {
    this.started = true;
    const point = DomListener.toPoint(e);
    this.fire("start", e.target);
    this.currentX = point.x;
    this.currentY = point.y;
  };

  move = (e: TouchEvent | MouseEvent) => {
    if (!this.started) return;
    const point = DomListener.toPoint(e);

    this.deltaX = point.x - this.currentX;
    this.deltaY = point.y - this.currentY;

    this.currentX = point.x;
    this.currentY = point.y;

    this.fire<types.MoveEventPayload>("move", {
      currentX: this.currentX,
      currentY: this.currentY,
      deltaX: this.deltaX,
      deltaY: this.deltaY,
    });
  };

  end = (e: TouchEvent | MouseEvent) => {
    if (!this.started) return;
    this.started = false;
    const point = DomListener.toPoint(e);
    this.fire("end");
  };

  static toPoint(e: TouchEvent | MouseEvent) {
    if (e instanceof TouchEvent) {
      const p = e.changedTouches[0];
      return { x: p.clientX, y: p.clientY };
    } else {
      return { x: e.clientX, y: e.clientY };
    }
  }
}
