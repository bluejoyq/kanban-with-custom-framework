import { useState } from "../lib";
import { IssueModel } from "../models/Issue";

interface UseKanbanProps {
  kanbanTitles?: readonly string[];
  storage?: Storage;
  storageKey?: string;
}

/**
 * @description 칸반 보드를 사용하는 커스텀 훅
 */
export const useKanban = <
  KanbanStatus extends string = "to-do" | "in-progress" | "done",
>(
  {
    storage = localStorage,
    storageKey = "kanban",
  }: UseKanbanProps | undefined = {
    storage: localStorage,
    storageKey: "kanban",
  },
) => {
  type KanbanMap = Map<KanbanStatus, IssueModel<KanbanStatus>[]>;
  const initialKanban = new Map();
  const [getKanban, setKanban] = useState<KanbanMap>(initialKanban);

  /**
   * @description 로컬 스토리지에서 저장된 이슈들을 가져오는 함수
   */
  const _loadKanbanFromStorage = (): KanbanMap => {
    const kanbanDatas = storage.getItem(storageKey);

    if (kanbanDatas == null) {
      return new Map();
    }
    const parsedKanbanDatas = JSON.parse(kanbanDatas);
    const newKanban = new Map();
    Object.keys(parsedKanbanDatas).forEach((key) => {
      newKanban.set(
        key,
        parsedKanbanDatas[key].map(
          (i: IssueModel<KanbanStatus>) =>
            new IssueModel({
              ...i,
            }),
        ),
      );
    });
    return newKanban;
  };

  /**
   * @description 칸반 데이터를 저장하는 함수
   */
  const _saveKanbanToStorage = () => {
    storage.setItem(storageKey, JSON.stringify(getKanban()));
  };
  /**
   * @description 칸반 데이터를 초기화하는 함수
   * 로컬 스토리지에서 칸반 데이터를 가져와서 초기화한다.
   */
  const _init = (): void => {
    const initIssues = _loadKanbanFromStorage();
    setKanban(initIssues);
  };

  /**
   * @description 칸반 데이터를 업데이트하는 함수
   */
  const _updateKanban = (newKanban: KanbanMap) => {
    setKanban(newKanban);
    _saveKanbanToStorage();
  };
  /**
   * @description 이슈를 이동시키는 함수
   */
  const handleMoveIssue = (
    issue: IssueModel<KanbanStatus>,
    from: KanbanStatus,
    to: KanbanStatus,
    idx: number | undefined,
  ) => {
    const targetIdx = idx ?? -1;
    const kanbanDatas = getKanban();
    const fromIssues = kanbanDatas.get(from) ?? [];

    // drop 버그로 인해 이슈가 없는 칸반에서 이동 시 방지
    if (fromIssues.find((i) => i.id === issue.id) == null) {
      return;
    }
    const newKanban = new Map(kanbanDatas);
    newKanban.set(
      from,
      fromIssues.filter((i) => i.id !== issue.id),
    );
    const toIssues = newKanban.get(to) ?? [];
    issue.status = to;

    if (targetIdx === -1 || targetIdx >= toIssues.length) {
      toIssues.push(issue);
    } else {
      toIssues.splice(targetIdx, 0, issue);
    }
    console.log(targetIdx, issue, toIssues);

    newKanban.set(to, toIssues);
    _updateKanban(newKanban);
  };
  /**
   * @description 이슈를 추가하는 함수
   */
  const handleWriteIssue = (
    title: string,
    authorId: string,
    writingIssueStatus: KanbanStatus,
  ) => {
    const kanban = getKanban();
    const newKanban = new Map(kanban);
    const newIssue = new IssueModel({
      id: `issue-${performance.now()}`,
      title,
      status: writingIssueStatus,
      authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const targetIssues = newKanban.get(writingIssueStatus);
    if (targetIssues == null) {
      newKanban.set(writingIssueStatus, [newIssue]);
    } else {
      newKanban.set(writingIssueStatus, [...targetIssues, newIssue]);
    }
    _updateKanban(newKanban);
  };

  /**
   * @description 이슈를 수정하는 함수
   */
  const handleEditIssue = (
    issue: IssueModel<KanbanStatus>,
    title: string,
    authorId: string,
  ) => {
    const kanban = getKanban();
    const newKanban = new Map(kanban);
    const newIssue = new IssueModel({
      ...issue,
      title,
      authorId,
      updatedAt: new Date(),
    });
    const targetIssues = newKanban.get(issue.status) ?? [];
    newKanban.set(
      issue.status,
      targetIssues.map((i) => (i.id === issue.id ? newIssue : i)),
    );

    _updateKanban(newKanban);
  };

  /**
   * @description 이슈를 삭제하는 함수
   */
  const handleDeleteIssue = (issue: IssueModel<KanbanStatus>) => {
    const kanban = getKanban();
    const newKanban = new Map(kanban);
    const targetIssues = newKanban.get(issue.status) ?? [];
    newKanban.set(
      issue.status,
      targetIssues.filter((i) => i.id !== issue.id),
    );

    _updateKanban(newKanban);
  };

  _init();

  return {
    getKanbanDatas: getKanban,
    handleMoveIssue,
    handleWriteIssue,
    handleDeleteIssue,
    handleEditIssue,
  };
};
