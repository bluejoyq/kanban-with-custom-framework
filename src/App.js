import { Div, H1 } from "./lib/Element";
import { useState } from "./lib";
import { Modal } from "./components/Modal";
import { IssueForm } from "./components/IssueForm";
import { KanbanCol } from "./components/Kanban";
import { useKanban } from "./hooks/useKanban";

/**
 * @return {function():HTMLElement}
 * @description 어플리케이션 진입점
 * 앞으로의 모든 컴포넌트는 네이티브 엘리먼트를 생성하는 함수로 구성된다.
 * 커스텀 컴포넌트 함수가 실행되는 시점은 마운트로 가정.
 * 네이티브 엘리먼트를 생성하는 함수가 실행되는 시점은 렌더로 가정.
 */
export const App = () => {
  const {
    kanbanTitles,
    getKanbanDatas,
    handleMoveIssue,
    handleWriteIssue,
    handleEditIssue,
    handleDeleteIssue,
  } = useKanban();
  const [getEditingIssue, setEditingIssue] = useState(null);
  const [getWritingStatus, setWritingStatus] = useState(null);

  const handleWritingModalClose = () => {
    setWritingStatus(null);
  };

  const handleEditingModalClose = () => {
    setEditingIssue(null);
  };

  const KanbanColComponents = kanbanTitles.map((title) => {
    const getKanbanIssues = () => getKanbanDatas()[title];
    return KanbanCol(
      title,
      getKanbanIssues,
      handleMoveIssue,
      handleDeleteIssue,
      setEditingIssue,
      setWritingStatus,
    );
  });
  const ModalComponent = Modal();
  const IssueFormComponent = IssueForm();
  return () => {
    const writingIssue = getWritingStatus();
    const editingIssue = getEditingIssue();
    return Div({
      children: [
        H1({
          children: ["칸반 보드"],
        }),
        Div({
          children: [
            ...KanbanColComponents.map((KanbanColComponent) =>
              KanbanColComponent(),
            ),
          ],
          class: "kanban",
        }),
        writingIssue != null &&
          ModalComponent({
            children: [
              IssueFormComponent({
                issue: writingIssue,
                onSubmit: (title, authorId) => {
                  handleWriteIssue(title, authorId, writingIssue);
                },
                onClose: handleWritingModalClose,
              }),
            ],
            onClose: handleWritingModalClose,
          }),
        editingIssue != null &&
          ModalComponent({
            children: [
              IssueFormComponent({
                issue: editingIssue,
                onSubmit: (title, authorId) => {
                  handleEditIssue(editingIssue, title, authorId);
                },
                onClose: handleEditingModalClose,
              }),
            ],
            onClose: handleEditingModalClose,
          }),
      ],
      class: "layout",
    });
  };
};
