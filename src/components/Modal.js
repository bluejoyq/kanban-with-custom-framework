import { Div } from "../lib/Element";

/**
 * @description 모달 껍데기 컴포넌트
 * @return {function():HTMLElement}
 */
export const Modal = () => {
  /**
   * @param {Object} param
   * @param {Array<HTMLElement>} param.children
   * @param {function():void} param.onClose
   * @return {HTMLElement}
   */
  return ({ children, onClose }) => {
    return Div({
      children: [
        Div({
          children: [...children],
          class: "modal-container",
          onclick: (e) => {
            e.stopPropagation();
          },
        }),
      ],
      class: "modal-layout",
      onclick: onClose,
    });
  };
};
