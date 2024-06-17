import { Div } from "../lib/Element";

/**
 * @description 모달 껍데기 컴포넌트
 * @return {function():HTMLElement}
 */
export const Modal = () => {
  return ({
    children,
    onClose,
  }: {
    children: HTMLElement[];
    onClose: () => void;
  }) => {
    return Div({
      children: [
        Div({
          children: [...children],
          class: "modal-container",
          onClick: (e) => e.stopPropagation(),
        }),
      ],
      class: "modal-layout",
      onClick: onClose,
    });
  };
};
