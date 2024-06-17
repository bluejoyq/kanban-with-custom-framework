import { Div, Input, Button, Span } from "../lib/Element";
import { IssueModel } from "../models/Issue";
/**
 * @typedef {import("../Model").IssueModel} IssueModel
 */
/**
 * @description 이슈 수정 혹은 추가를 위한 폼
 * @return {function():HTMLElement}
 */
export const IssueForm = () => {
  /**
   * @param {Object} param
   * @param {IssueModel?} param.issue
   * @param {function():void} param.onClose
   * @param {function(string, string):void} param.onSubmit
   * @return {HTMLElement}
   */
  return ({
    issue,
    onClose,
    onSubmit,
  }: {
    issue: IssueModel | null;
    onClose: () => void;
    onSubmit: (title: string, authorId: string) => void;
  }) => {
    let currentTitle = issue?.title ?? "";
    let currentAuthorId = issue?.authorId ?? "";
    const handleSubmit = () => {
      if (!currentTitle.trim() || !currentAuthorId.trim()) {
        alert("빈칸을 모두 채워주세요");
        return;
      }
      onSubmit(currentTitle, currentAuthorId);
      onClose();
    };
    return Div({
      children: [
        Div({
          children: [
            Span({
              children: ["이슈 제목"],
            }),
            Input({
              placeholder: "이슈 제목을 입력해주세요",
              value: currentTitle,
              onChange: (e) => {
                const target = e.target as HTMLInputElement;
                if (target == null) return;
                currentTitle = target.value;
              },
            }),
          ],
        }),
        Div({
          children: [
            Span({
              children: ["담당자 id"],
            }),
            Input({
              placeholder: "담당자 id를 입력해주세요",
              value: currentAuthorId,
              onChange: (e) => {
                const target = e.target as HTMLInputElement;
                if (target == null) return;
                currentAuthorId = target.value;
              },
            }),
          ],
        }),
        Div({
          children: [
            Button({
              children: ["취소"],
              onClick: onClose,
            }),
            Button({
              children: ["확인"],
              onClick: handleSubmit,
            }),
          ],
        }),
      ],
    });
  };
};
