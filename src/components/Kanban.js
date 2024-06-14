import { Div, Button, H2, Span } from "../lib/Element";
import { debounce } from "../lib/utils";
import { IssueModel } from "../models/Issue";

/**
 * @description 칸반 보드의 한 열을 생성하는 함수
 * @param {string} title
 * @param {function():Array<IssueModel>} getKanbanIssues
 * @param {function(IssueModel, string, string,number):void} handleMoveIssue
 * @param {function(IssueModel):void} handleDeleteIssue
 * @param {function(IssueModel):void} setEditingIssue
 * @param {function(string):void} setWritingStatus
 * @return {function():HTMLElement}
 */
export const KanbanCol = (
  title,
  getKanbanIssues,
  handleMoveIssue,
  handleDeleteIssue,
  setEditingIssue,
  setWritingStatus,
) => {
  let targetIdx = null;
  const setTargetIndex = (idx) => {
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
     * @param {DragEvent} e
     * @return {void}
     */
    const debouncedHandleDragOver = debounce((e) => {
      const $zone = document.querySelector(`#${title}`);
      const $dragging = document.querySelector(".is-dragging");
      if ($zone == null || $dragging == null) {
        return;
      }
      $dragging.parentElement.removeChild($dragging);
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
     * @param {issue} data
     * @return {void}
     * @description 이슈를 이동시키는 함수
     */
    const debouncedHandleDrop = debounce((data) => {
      handleMoveIssue(data, data.status, title, targetIdx);
      setTargetIndex(null);
    }, 10);
    /**
     * @param {HTMLElement} $container
     * @param {number} y
     * @return {HTMLElement?}
     * @reference https://codepen.io/joshuacerbito/pen/MWbZEPx
     */
    const getDragAfterElement = ($container, y) => {
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
              children: [title],
              class: "kanban-col-title",
            }),
            Button({
              children: ["추가"],
              onclick: () => {
                setWritingStatus(title);
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
          id: title,
        }),
      ],
      class: "kanban-col",
      ondragenter: (e) => {
        e.preventDefault();
      },
      ondrop: (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("text/plain");
        const issue = new IssueModel(JSON.parse(data));
        debouncedHandleDrop(issue);
      },
      ondragleave: (e) => {
        e.preventDefault();
      },
      ondragover: (e) => {
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
const KanbanItem = (issue, handleDeleteIssue, setEditingIssue) => {
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
              onclick: handleEdit,
            }),
            Button({
              children: ["삭제"],
              onclick: handleRemove,
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
      ondragstart: (e) => {
        e.target.classList.add("is-dragging");
        e.dataTransfer.setData("text/plain", JSON.stringify(issue));
      },
      ondragend: (e) => {
        e.target.classList.remove("is-dragging");
        e.preventDefault();
      },
    });
  };
};
