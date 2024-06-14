import { describe, test, expect } from "@jest/globals";
import { useKanban } from "../../src/hooks/useKanban";
describe("useKanban", () => {
  test("이슈 상태 3가지가 존재한다.", () => {
    const { getKanbanDatas } = useKanban();
    const kanbanDatas = getKanbanDatas();
    expect(Object.keys(kanbanDatas).length).toBe(3);
  });

  test("이슈 상태는 to-do, in-progress, done 이다.", () => {
    const { getKanbanDatas } = useKanban();
    const kanbanDatas = getKanbanDatas();
    expect(Object.keys(kanbanDatas)).toEqual(["to-do", "in-progress", "done"]);
  });

  test("초기 이슈는 비어있다.", () => {
    const { getKanbanDatas } = useKanban();
    const kanbanDatas = getKanbanDatas();
    expect(
      Object.values(kanbanDatas).every((kanbanData) => kanbanData.length === 0),
    ).toBe(true);
  });

  test('이슈를 추가할 수 있다. "to-do" 상태에 추가한다.', () => {
    const { getKanbanDatas, handleWriteIssue } = useKanban();
    handleWriteIssue("test", "test", "to-do");
    const kanbanDatas = getKanbanDatas();
    expect(kanbanDatas["to-do"].length).toBe(1);
  });

  test("이슈를 추가하면 적절한 값이 들어간다", () => {
    const { getKanbanDatas, handleWriteIssue } = useKanban();
    handleWriteIssue("test", "test", "to-do");
    const kanbanDatas = getKanbanDatas();
    kanbanDatas["to-do"].forEach((issue) => {
      expect(issue.title).toBe("test");
      expect(issue.status).toBe("to-do");
      expect(issue.authorId).toBe("test");
    });
  });

  test('이슈를 움직일 수 있다. "to-do" -> "in-progress"', () => {
    const { getKanbanDatas, handleWriteIssue, handleMoveIssue } = useKanban();
    handleWriteIssue("test", "test", "to-do");
    const kanbanDatas = getKanbanDatas();

    handleMoveIssue(kanbanDatas["to-do"][0], "to-do", "in-progress", 0);
    setTimeout(() => {
      expect(kanbanDatas["to-do"].length).toBe(0);
      expect(kanbanDatas["in-progress"].length).toBe(1);
    }, 0);
  });

  test("이슈 순서를 바꿀 수 있다.", () => {
    const { getKanbanDatas, handleWriteIssue, handleMoveIssue } = useKanban();
    handleWriteIssue("test1", "test", "to-do");
    handleWriteIssue("test2", "test", "to-do");
    const kanbanDatas = getKanbanDatas();

    handleMoveIssue(kanbanDatas["to-do"][0], "to-do", "to-do", 1);
    setTimeout(() => {
      expect(kanbanDatas["to-do"][0].id).toBe("test2");
    }, 0);
  });

  test("이슈를 삭제할 수 있다.", () => {
    const { getKanbanDatas, handleWriteIssue, handleDeleteIssue } = useKanban();
    handleWriteIssue("test", "test", "to-do");
    const kanbanDatas = getKanbanDatas();

    handleDeleteIssue(kanbanDatas["to-do"][0]);
    setTimeout(() => {
      expect(kanbanDatas["to-do"].length).toBe(0);
    }, 0);
  });

  test("이슈를 수정할 수 있다.", () => {
    const { getKanbanDatas, handleWriteIssue, handleEditIssue } = useKanban();
    handleWriteIssue("test", "test", "to-do");
    const kanbanDatas = getKanbanDatas();

    handleEditIssue(kanbanDatas["to-do"][0], "edited", "edited", "to-do");
    setTimeout(() => {
      expect(kanbanDatas["to-do"][0].title).toBe("edited");
      expect(kanbanDatas["to-do"][0].content).toBe("edited");
    }, 0);
  });

  test("이슈를 수정하면 적절한 값이 들어간다", () => {
    const { getKanbanDatas, handleWriteIssue, handleEditIssue } = useKanban();
    handleWriteIssue("test", "test", "to-do");
    const kanbanDatas = getKanbanDatas();

    handleEditIssue(kanbanDatas["to-do"][0], "edited", "edited", "to-do");
    setTimeout(() => {
      expect(kanbanDatas["to-do"][0].title).toBe("edited");
      expect(kanbanDatas["to-do"][0].content).toBe("edited");
      expect(kanbanDatas["to-do"][0].status).toBe("to-do");
    }, 0);
  });
});
