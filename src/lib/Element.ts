import { EventTypeMap, isEventHandlerName } from "./Event";

type ElementProps<T extends HTMLElement = HTMLElement> = Partial<
  Omit<T, keyof GlobalEventHandlers | "children">
> & {
  tagName: string;
  children?: Array<string | number | HTMLElement | boolean>;
  class?: string;
  key?: string | number;
  [k: `data-${string}`]: string;
} & Partial<EventTypeMap>;
type TagProps<T extends HTMLElement> = Omit<ElementProps<T>, "tagName">;

/**
 * @description create element
 */
const Element = <T extends HTMLElement = HTMLElement>({
  tagName,
  children,
  ...props
}: ElementProps<T>): T => {
  const $el = document.createElement(tagName);
  (children ?? []).forEach((child) => {
    if (typeof child === "string") {
      $el.appendChild(document.createTextNode(child));
    }
    if (typeof child === "number") {
      $el.appendChild(document.createTextNode(child.toString()));
    }
    if (child instanceof HTMLElement) {
      $el.appendChild(child);
    }
  });
  Object.keys(props).forEach((key) => {
    if (isEventHandlerName(key)) {
      $el.addEventListener(
        key.substring(2).toLowerCase() as keyof HTMLElementEventMap,
        props[key] as EventListenerOrEventListenerObject,
      );
      return;
    }
    // @ts-ignore
    $el.setAttribute(key, props[key]);
  });
  return $el as T;
};

/**
 * @description create div element
 */
export const Div = ({
  children = [],
  ...props
}: TagProps<HTMLDivElement>): HTMLDivElement =>
  Element({ ...props, tagName: "div", children });

/**
 * @description create h1 element
 */
export const H1 = ({
  children = [],
  ...props
}: TagProps<HTMLHeadingElement>): HTMLHeadingElement =>
  Element({ ...props, tagName: "h1", children });

/**
 * @description create h2 element
 */
export const H2 = ({
  children = [],
  ...props
}: TagProps<HTMLHeadingElement>): HTMLHeadingElement =>
  Element({ ...props, tagName: "h2", children });

/**
 * @description create button element
 */
export const Button = ({
  children = [],
  ...props
}: TagProps<HTMLButtonElement>): HTMLButtonElement =>
  Element({ ...props, tagName: "button", children });

/**
 * @description create span element
 */
export const Span = ({
  children = [],
  ...props
}: TagProps<HTMLSpanElement>): HTMLSpanElement =>
  Element({ ...props, tagName: "span", children });

/**
 * @description create input element
 */
export const Input = ({
  children = [],
  ...props
}: TagProps<HTMLInputElement>): HTMLInputElement =>
  Element({ ...props, tagName: "input", children });
