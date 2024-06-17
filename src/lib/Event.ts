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
  onDragStart: "dragstart";
  onDragEnd: "dragend";
  onDragOver: "dragover";
  onDragEnter: "dragenter";
  onDragLeave: "dragleave";
  onDrop: "drop";
  onDrag: "drag";
};

export type EventTypeMap = {
  [key in keyof EventNameMap]: (
    e: HTMLElementEventMap[EventNameMap[key]],
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
    "onDragStart",
    "onDragEnd",
    "onDragOver",
    "onDragEnter",
    "onDragLeave",
    "onDrop",
    "onDrag",
  ];
  return eventHandlerNames.includes(name as keyof EventNameMap);
};
