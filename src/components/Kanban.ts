import { KanbanStatus } from "../App";
import { Div, Button, H2, Span } from "../lib/Element";
import { debounce } from "../lib/utils";
import { IssueModel } from "../models/Issue";

/**
 * @description 칸반 보드의 한 열을 생성하는 함수
 * @return {function():HTMLElement}
 */
export const KanbanCol = (
  status: KanbanStatus,
  getKanbanIssues: () => Array<IssueModel>,
  handleMoveIssue: (
    issue: IssueModel,
    from: KanbanStatus,
    to: KanbanStatus,
    targetIdx: number,
  ) => void,
  handleDeleteIssue: (issue: IssueModel) => void,
  setEditingIssue: (issue: IssueModel) => void,
  setWritingStatus: (status: KanbanStatus) => void,
): (() => HTMLElement) => {
  let targetIdx: number | null = null;
  const setTargetIndex = (idx: number | null) => {
    targetIdx = idx;
  };
  /**
   * @param {Array<IssueModel>} kanbanDatas
   * @return {HTMLElement}
   */
  return () => {
    const kanbanIssues = getKanbanIssues();
    const KanbanItemComponents = kanbanIssues.map((issue) => {
      return KanbanItem(issue, handleDeleteIssue, setEditingIssue);
    });

    /**
     * @return {void}
     */
    const debouncedHandleDragOver = debounce((e: DragEvent) => {
      const $zone = document.querySelector(`#${status}`);
      const $dragging = document.querySelector(".is-dragging");
      if ($zone == null || $dragging == null) {
        return;
      }
      $dragging.parentElement?.removeChild($dragging);
      const $afterElement = getDragAfterElement($zone, e.clientY);
      // 명시적 리렌더링을 위해 key를 추가함.
      $dragging.setAttribute("key", new Date().getTime().toString());
      if ($afterElement == null) {
        setTargetIndex(-1);
        $zone.appendChild($dragging);
        return;
      }
      setTargetIndex([...$zone.children].indexOf($afterElement));
      $zone.insertBefore($dragging, $afterElement);
    }, 10);

    /**
     * @description 이슈를 이동시키는 함수
     */
    const debouncedHandleDrop = debounce((issue: IssueModel) => {
      handleMoveIssue(issue, issue.status, status, targetIdx ?? -1);
      setTargetIndex(null);
    }, 10);
    /**
     * @reference https://codepen.io/joshuacerbito/pen/MWbZEPx
     */
    const getDragAfterElement = ($container: Element, y: number) => {
      const queryResult = $container.querySelectorAll(".kanban-item");
      if (queryResult.length === 0) return null;
      const $draggableElements = [...queryResult];

      return $draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;

          if (offset < 0 && offset > closest.offset) {
            return {
              offset,
              element: child,
            };
          }
          return closest;
        },
        { offset: Number.NEGATIVE_INFINITY },
      ).element;
    };

    return Div({
      children: [
        Div({
          children: [
            H2({
              children: [status],
              class: "kanban-col-title",
            }),
            Button({
              children: ["추가"],
              onClick: () => {
                setWritingStatus(status);
              },
            }),
          ],
          class: "kanban-col-header",
        }),
        Div({
          children: [
            ...KanbanItemComponents.map((KanbanItemComponent) => {
              if (KanbanItemComponent === null) {
                return Div({
                  class: "kanban-item-placeholder",
                });
              }
              return KanbanItemComponent();
            }),
          ],
          class: "kanban-items-container",
          id: status,
        }),
      ],
      class: "kanban-col",
      onDragEnter: (e) => {
        e.preventDefault();
      },
      onDrop: (e) => {
        e.preventDefault();
        const data = e.dataTransfer?.getData("text/plain");
        if (data == null) return;
        const issue = new IssueModel(JSON.parse(data));
        debouncedHandleDrop(issue);
      },
      onDragLeave: (e) => {
        e.preventDefault();
      },
      onDragOver: (e) => {
        e.preventDefault();
        debouncedHandleDragOver(e);
      },
    });
  };
};

/**
 * @param {IssueModel} issue
 * @param {function(IssueModel):void} handleDeleteIssue
 * @param {function(IssueModel):void} setEditingIssue
 * @return {function():HTMLElement}
 */
const KanbanItem = (
  issue: IssueModel,
  handleDeleteIssue: (issue: IssueModel) => void,
  setEditingIssue: (issue: IssueModel) => void,
) => {
  const handleRemove = () => {
    if (!confirm("삭제하시겠습니까?")) return;
    handleDeleteIssue(issue);
  };

  const handleEdit = () => {
    setEditingIssue(issue);
  };
  return () => {
    return Div({
      ["data-id"]: issue.id,
      key: JSON.stringify(issue),
      children: [
        Div({
          children: [
            Span({
              children: [issue.id],
            }),
            Button({
              children: ["수정"],
              onClick: handleEdit,
            }),
            Button({
              children: ["삭제"],
              onClick: handleRemove,
            }),
          ],
          class: "kanban-item-header",
        }),
        Div({
          children: [
            Span({
              children: [issue.title],
              class: "kanban-item-title",
            }),
          ],
          class: "kanban-item-body",
        }),
        Div({
          children: [
            Span({
              children: [issue.authorId],
              class: "kanban-item-content",
            }),
            Span({
              children: [issue.createdAt.toLocaleString()],
              class: "kanban-item-content",
            }),
          ],
          class: "kanban-item-footer",
        }),
      ],
      draggable: true,
      class: "kanban-item",
      onDragStart: (e) => {
        const target = e.target as HTMLElement;
        target.classList.add("is-dragging");
        e.dataTransfer?.setData("text/plain", JSON.stringify(issue));
      },
      onDragEnd: (e) => {
        const target = e.target as HTMLElement;
        target.classList.remove("is-dragging");
        e.preventDefault();
      },
    });
  };
};
