import { Resizable } from "./core";
import * as types from "../type";
import { DomListener } from "./utils/web-listener";

export default class FullResizable extends Resizable {
  constructor(props: types.Option) {
    if (!(props as types.ResizableOption).listenerFactory) {
      if (typeof props === "string" || props instanceof HTMLElement) {
        props = { container: props };
      }
      props.listenerFactory = () => new DomListener();
    }

    super(props);
  }
}
