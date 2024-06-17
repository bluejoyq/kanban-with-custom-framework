import { Div, H1 } from "./lib/Element";
import { useState } from "./lib";
import { Modal } from "./components/Modal";
import { IssueForm } from "./components/IssueForm";
import { KanbanCol } from "./components/Kanban";
import { useKanban } from "./hooks/useKanban";
import { IssueModel } from "./models/Issue";
export type KanbanStatus = "to-do" | "doing" | "done";
/**
 * @return {function():HTMLElement}
 * @description 어플리케이션 진입점
 * 앞으로의 모든 컴포넌트는 네이티브 엘리먼트를 생성하는 함수로 구성된다.
 * 커스텀 컴포넌트 함수가 실행되는 시점은 마운트로 가정.
 * 네이티브 엘리먼트를 생성하는 함수가 실행되는 시점은 렌더로 가정.
 */
export const App = () => {
  const kanbanStatus: KanbanStatus[] = ["to-do", "doing", "done"];
  const {
    getKanbanDatas,
    handleMoveIssue,
    handleWriteIssue,
    handleEditIssue,
    handleDeleteIssue,
  } = useKanban();
  const [getEditingIssue, setEditingIssue] = useState<IssueModel | null>(null);
  const [getWritingStatus, setWritingStatus] = useState<KanbanStatus | null>(
    null,
  );

  const handleWritingModalClose = () => {
    setWritingStatus(null);
  };

  const handleEditingModalClose = () => {
    setEditingIssue(null);
  };

  const KanbanColComponents = kanbanStatus.map((status) => {
    const getKanbanIssues = () => getKanbanDatas().get(status) ?? [];
    return KanbanCol(
      status,
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
    const writingStatus = getWritingStatus();
    const writingIssue = new IssueModel({
      id: performance.now().toString(),
      title: "",
      authorId: "",
      status: writingStatus ?? "to-do",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
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
        writingStatus != null &&
          ModalComponent({
            children: [
              IssueFormComponent({
                issue: writingIssue,
                onSubmit: (title, authorId) => {
                  handleWriteIssue(title, authorId, writingStatus);
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
