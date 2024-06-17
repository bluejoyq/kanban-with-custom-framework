interface ElementProps {
  tagName: string;
  children?: Array<string | number | HTMLElement>;
  [key: string]: any;
}

interface TagProps extends Omit<ElementProps, "tagName"> {}

/**
 * @description create element
 */
const Element = ({
  tagName,
  children,
  ...props
}: ElementProps): HTMLElement => {
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
    if (key.startsWith("on")) {
      $el.addEventListener(key.substring(2).toLowerCase(), props[key]);
      return;
    }
    $el.setAttribute(key, props[key]);
  });
  return $el;
};

/**
 * @description create div element
 */
export const Div = ({ children = [], ...props }: TagProps): HTMLDivElement =>
  Element({ ...props, tagName: "div", children }) as HTMLDivElement;

/**
 * @description create h1 element
 */
export const H1 = ({ children = [], ...props }: TagProps): HTMLHeadingElement =>
  Element({ ...props, tagName: "h1", children }) as HTMLHeadingElement;

/**
 * @description create h2 element
 */
export const H2 = ({ children = [], ...props }: TagProps): HTMLHeadingElement =>
  Element({ ...props, tagName: "h2", children }) as HTMLHeadingElement;

/**
 * @description create button element
 */
export const Button = ({
  children = [],
  ...props
}: TagProps): HTMLButtonElement =>
  Element({ ...props, tagName: "button", children }) as HTMLButtonElement;

/**
 * @description create span element
 */
export const Span = ({ children = [], ...props }: TagProps): HTMLSpanElement =>
  Element({ ...props, tagName: "span", children }) as HTMLSpanElement;

/**
 * @description create input element
 */
export const Input = ({
  children = [],
  ...props
}: TagProps): HTMLInputElement =>
  Element({ ...props, tagName: "input", children }) as HTMLInputElement;
