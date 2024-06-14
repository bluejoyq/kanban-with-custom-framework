/**
 * @description create element
 * @param {Object} param
 * @param {string} param.tagName
 * @param {Array<string | number | HTMLElement>} param.children
 * @param {Object} param.props
 * @return {HTMLElement}
 */
const Element = ({ tagName, children, ...props }) => {
  const $el = document.createElement(tagName);
  children.forEach((child) => {
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
 * @param {Object} param
 * @param {Array<string | number | HTMLElement>} param.children
 * @param {HTMLDivElement} param.props
 * @return {HTMLDivElement}
 */
export const Div = ({ children = [], ...props }) => {
  return Element({ tagName: "div", children: children, ...props });
};
/**
 * @description create h1 element
 * @param {Object} param
 * @param {Array<string | number | HTMLElement>} param.children - H1 태그의 자식 요소들
 * @param {HTMLHeadingElement} param.props - H1 태그에 적용할 속성들
 * @return {HTMLHeadingElement} 생성된 H1 요소
 */
export const H1 = ({ children = [], ...props }) =>
  Element({ tagName: "h1", children, ...props });

/**
 * @description create h2 element
 * @param {Object} param
 * @param {Array<string | number | HTMLElement>} param.children - H2 태그의 자식 요소들
 * @param {HTMLHeadingElement} param.props - H2 태그에 적용할 속성들
 * @return {HTMLHeadingElement} 생성된 H2 요소
 */
export const H2 = ({ children = [], ...props }) =>
  Element({ tagName: "h2", children, ...props });
/**
 * @description create button element
 * @param {Object} param
 * @param {Array<string | number | HTMLElement>} param.children - Button 태그의 자식 요소들
 * @param {HTMLButtonElement} param.props - Button 태그에 적용할 속성들
 * @return {HTMLButtonElement} 생성된 Button 요소
 */
export const Button = ({ children = [], ...props }) =>
  Element({ tagName: "button", children, ...props });
/**
 * @description create span element
 * @param {Object} param
 * @param {Array<string | number | HTMLElement>} param.children - Span 태그의 자식 요소들
 * @param {HTMLSpanElement} param.props - Span 태그에 적용할 속성들
 * @return {HTMLSpanElement} 생성된 Span 요소
 */
export const Span = ({ children = [], ...props }) =>
  Element({ tagName: "span", children, ...props });

/**
 * @description create input element
 * @param {Object} param
 * @param {Array<string | number | HTMLElement>} param.children
 * @param {HTMLInputElement} param.props
 * @return {HTMLInputElement }
 */
export const Input = ({ children = [], ...props }) => {
  return Element({ tagName: "input", children: children, ...props });
};
