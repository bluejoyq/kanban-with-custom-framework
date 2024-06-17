import { describe, test, expect, beforeEach } from "@jest/globals";
import { useKanban } from "../../src/hooks/useKanban";

describe("useKanban<KanbanStatus>", () => {
  type KanbanStatus = "to-do" | "in-progress" | "done";
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("초기 이슈는 비어있다.", () => {
    const { getKanbanDatas } = useKanban<KanbanStatus>();
    const kanbanDatas = getKanbanDatas();
    expect(
      [...kanbanDatas.values()].every((kanbanData) => kanbanData.length === 0),
    ).toBe(true);
  });

  test('이슈를 추가할 수 있다. "to-do" 상태에 추가한다.', () => {
    const { getKanbanDatas, handleWriteIssue } = useKanban<KanbanStatus>();
    handleWriteIssue("test", "test", "to-do");
    const kanbanDatas = getKanbanDatas();
    expect(kanbanDatas.get("to-do")?.length).toBe(1);
  });

  test("이슈를 추가하면 적절한 값이 들어간다", () => {
    const { getKanbanDatas, handleWriteIssue } = useKanban<KanbanStatus>();
    handleWriteIssue("test", "test", "to-do");
    const kanbanDatas = getKanbanDatas();
    kanbanDatas.get("to-do")?.forEach((issue) => {
      expect(issue.title).toBe("test");
      expect(issue.status).toBe("to-do");
      expect(issue.authorId).toBe("test");
    });
  });

  test('이슈를 움직일 수 있다. "to-do" -> "in-progress"', () => {
    const { getKanbanDatas, handleWriteIssue, handleMoveIssue } =
      useKanban<KanbanStatus>();
    handleWriteIssue("test", "test", "to-do");
    const kanbanDatas = getKanbanDatas();
    const issues = kanbanDatas.get("to-do");
    if (issues == null) return;
    handleMoveIssue(issues[0], "to-do", "in-progress", 0);
    const updatedKanbanDatas = getKanbanDatas();
    expect(updatedKanbanDatas.get("to-do")?.length).toBe(0);
    expect(updatedKanbanDatas.get("in-progress")?.length).toBe(1);
  });

  test("이슈 순서를 바꿀 수 있다.", () => {
    const { getKanbanDatas, handleWriteIssue, handleMoveIssue } =
      useKanban<KanbanStatus>();
    handleWriteIssue("test1", "test", "to-do");
    handleWriteIssue("test2", "test", "to-do");
    const kanbanDatas = getKanbanDatas();
    const issues = kanbanDatas.get("to-do") ?? [];
    handleMoveIssue(issues[0], "to-do", "to-do", 1);
    const newKanban = getKanbanDatas();
    const newIssues = newKanban.get("to-do") ?? [];
    expect(newIssues[0].title).toBe("test2");
  });

  test("이슈를 삭제할 수 있다.", () => {
    const { getKanbanDatas, handleWriteIssue, handleDeleteIssue } =
      useKanban<KanbanStatus>();
    handleWriteIssue("test", "test", "to-do");
    const kanbanDatas = getKanbanDatas();
    const issues = kanbanDatas.get("to-do") ?? [];
    handleDeleteIssue(issues[0]);
    const newKanban = getKanbanDatas();
    const newIssues = newKanban.get("to-do") ?? [];
    expect(newIssues.length).toBe(0);
  });

  test("이슈를 수정할 수 있다.", () => {
    const { getKanbanDatas, handleWriteIssue, handleEditIssue } =
      useKanban<KanbanStatus>();
    handleWriteIssue("test", "test", "to-do");
    const kanbanDatas = getKanbanDatas();
    const issues = kanbanDatas.get("to-do") ?? [];
    handleEditIssue(issues[0], "edited", "edited");
    const newKanban = getKanbanDatas();
    const newIssues = newKanban.get("to-do") ?? [];
    expect(newIssues[0].title).toBe("edited");
    expect(newIssues[0].authorId).toBe("edited");
  });

  test("이슈를 수정하면 적절한 값이 들어간다", () => {
    const { getKanbanDatas, handleWriteIssue, handleEditIssue } =
      useKanban<KanbanStatus>();
    handleWriteIssue("test", "test", "to-do");
    const kanbanDatas = getKanbanDatas();
    const issues = kanbanDatas.get("to-do") ?? [];
    handleEditIssue(issues[0], "edited", "edited");
    const newKanban = getKanbanDatas();
    const newIssues = newKanban.get("to-do") ?? [];
    expect(newIssues[0].title).toBe("edited");
    expect(newIssues[0].authorId).toBe("edited");
    expect(newIssues[0].status).toBe("to-do");
  });
});
