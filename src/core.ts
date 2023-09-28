import * as types from "../type";
import * as utils from "@/utils";
import { DragListenerInterface } from "../type";

export class Resizable
  extends utils.EmitAble
  implements types.IResizableInterface
{
  /**
   * @description deal with ui, should emit start/move/end event when drag happened
   * */
  listener?: DragListenerInterface;
  /**
   * @description options after parser, every item complete
   * */
  option: types.SolidResizableOption;
  /**
   * @description current effect element
   * */
  currentTarget?: HTMLElement;
  /**
   * @description current effect points
   * */
  currentPoints?: types.Points;
  /**
   * @description effect in on drag
   * */
  effects?: types.Effect[];

  constructor(option: types.Option) {
    super();
    this.option = this.dealOption(option);
    this.setup();
  }

  private setup() {
    const { effectManual } = this.option;
    this.listener?.listen(this.option.container);
    this.listener?.on("start", (target) => {
      this.effects = this.option.getEffectOnStart(target);
      const child = this.option.getItemOnStart(target) || undefined;
      if (!child) return;
      this.currentTarget = child;
      this.currentPoints = this.option.getPointsOnStart(child);
      Resizable.activeInstance = this;
    });
    this.listener?.on("move", this.effect.bind(this));
    this.listener?.on("end", () => {
      if (Resizable.activeInstance === this) {
        Resizable.activeInstance = undefined;
      }
      this.currentPoints = undefined;
      this.currentTarget = undefined;
      this.effects = undefined;
    });

    if (!effectManual) {
      this.on("effect", Resizable.effectItem);
    }
  }

  /**
     * @description Get points of child in container coordinate system
     * the points is left-top corner and right-bottom corner
     * points: {start: {x: 10, y: 10}, end: {x: 20, y: 20}}
     [--------------------]
     |                    |
     |   [---]            |
     |   |   |            |
     |   [---]            |
     |                    |
     |                    |
     [--------------------]
     * */
  static getPoints(container: HTMLElement, child: HTMLElement) {
    if (!child) return;
    const pRect = container.getBoundingClientRect().toJSON();
    const { width, height, ...cRect } = child.getBoundingClientRect().toJSON();
    const left = cRect.left - pRect.left;
    const right = left + width;
    const top = cRect.top - pRect.top;
    const bottom = top + height;

    const points = utils.rectToPoints({
      top,
      left,
      right,
      bottom,
      height,
      width,
    });
    return points;
  }

  /**
   * @description Make sure user option tobe complete
   * */
  private dealOption(option: types.Option): types.SolidResizableOption {
    const opt =
      typeof option === "string" || option instanceof HTMLElement
        ? { container: option }
        : option;

    const el =
      typeof opt.container === "string"
        ? document.querySelector(opt.container)
        : opt.container;

    if (!(el instanceof HTMLElement))
      throw new Error("el must valid Selector or HTMLElement");

    const dftGetItem = (target: HTMLElement) =>
      utils.closest(
        target,
        (e) => e?.classList.contains(this.option.itemClassName) ?? false,
      );

    const dftEffect = (target: HTMLElement) =>
      target.dataset["effect"]?.split(",") as types.Effect[];

    const dftPoints = Resizable.getPoints.bind(null, el);

    if (opt.listenerFactory) {
      this.listener = opt.listenerFactory();
    }
    return {
      container: el,
      itemClassName: opt.itemClassName || "resize-item",
      effectManual: Boolean(opt.effectManual),
      getItemOnStart: opt.getItemOnStart || dftGetItem,
      getEffectOnStart: opt.getEffectOnStart || dftEffect,
      getPointsOnStart: opt.getPointsOnStart || dftPoints,
    };
  }

  /**
   * @description When drag happened, emit points
   * points = fn(effect, delta)
   * */
  private effect(delta: { deltaX: number; deltaY: number }) {
    if (Resizable.activeInstance !== this) return;
    if (!this.effects) return;
    if (!this.currentPoints) return;
    if (!this.currentTarget) return;
    const points = {
      start: { ...this.currentPoints.start },
      end: { ...this.currentPoints.end },
    };
    // 按effect指定操作命中的点
    this.effects.forEach((effect) => {
      const map = utils.parseEffect(effect);
      if (!map) return;
      if (!points) return;
      const { who, what, deltaProp, sizeProp } = map;
      points[who][what] += delta[deltaProp];
    });

    this.currentPoints = points;
    this.fire<types.EffectEventPayload>("effect", {
      target: this.currentTarget,
      points: this.currentPoints,
      rect: utils.pointsToRect(points),
    });
  }

  /**
   * @description Turely effect element render with points
   * */
  static effectItem({ points, target }: types.EffectEventPayload) {
    const rect = utils.pointsToRect(points);
    target.style.cssText = `
        position: absolute;
        left: 0;
        right: 0;
        width: ${rect.width}px;
        height: ${rect.height}px;
        transform: translate3d(${rect.left}px, ${rect.top}px, 0);
    `;
  }

  static activeInstance?: Resizable;
}
