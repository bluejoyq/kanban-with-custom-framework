type EventNameMap = {
  onClick: "click";
  onDoubleClick: "dblclick";
  onMouseDown: "mousedown";
  onMouseUp: "mouseup";
  onMouseMove: "mousemove";
  onMouseEnter: "mouseenter";
  onMouseLeave: "mouseleave";
  onChange: "change";
  onInput: "input";
  onSubmit: "submit";
  onFocus: "focus";
  onBlur: "blur";
  onKeyDown: "keydown";
  onKeyUp: "keyup";
  onKeyPress: "keypress";
  onResize: "resize";
  onScroll: "scroll";
  onWheel: "wheel";
  onContextMenu: "contextmenu";
};

export type EventTypeMap = {
  [key in keyof EventNameMap]: (
    e: GlobalEventHandlersEventMap[EventNameMap[key]],
  ) => void;
};
export const isEventHandlerName = (
  name: string,
): name is keyof EventNameMap => {
  const eventHandlerNames: (keyof EventNameMap)[] = [
    "onClick",
    "onDoubleClick",
    "onMouseDown",
    "onMouseUp",
    "onMouseMove",
    "onMouseEnter",
    "onMouseLeave",
    "onChange",
    "onInput",
    "onSubmit",
    "onFocus",
    "onBlur",
    "onKeyDown",
    "onKeyUp",
    "onKeyPress",
    "onResize",
    "onScroll",
    "onWheel",
    "onContextMenu",
  ];
  return eventHandlerNames.includes(name as keyof EventNameMap);
};
export interface EventHandlers {
  onClick: (event: MouseEvent) => void;
  onDoubleClick: (event: MouseEvent) => void;
  onMouseDown: (event: MouseEvent) => void;
  onMouseUp: (event: MouseEvent) => void;
  onMouseMove: (event: MouseEvent) => void;
  onMouseEnter: (event: MouseEvent) => void;
  onMouseLeave: (event: MouseEvent) => void;
  onChange: (event: Event) => void;
  onInput: (event: Event) => void;
  onSubmit: (event: Event) => void;
  onFocus: (event: FocusEvent) => void;
  onBlur: (event: FocusEvent) => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onKeyUp: (event: KeyboardEvent) => void;
  onKeyPress: (event: KeyboardEvent) => void;
  onResize: (event: UIEvent) => void;
  onScroll: (event: UIEvent) => void;
  onWheel: (event: WheelEvent) => void;
  onContextMenu: (event: MouseEvent) => void;
}
