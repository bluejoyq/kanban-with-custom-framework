import { useState } from "../lib";
import { IssueModel } from "../models/Issue";
/**
 * @description 칸반 보드를 사용하는 커스텀 훅
 * @return {{
 *  getKanbanDatas: function():Object,
 *  handleMoveIssue: function(IssueModel, string, string, number):void,
 *  handleWriteIssue: function(string, string, string):void,
 *  handleDeleteIssue: function(IssueModel):void,
 *  handleEditIssue: function(IssueModel, string, string):void,
 *  kanbanTitles: Array<string>
 * }}
 */
export const useKanban = () => {
  const kanbanTitles = ["to-do", "in-progress", "done"];
  let startIdx = 0;
  const initialKanban = kanbanTitles.reduce((acc, cur, idx) => {
    acc[cur] = [];
    return acc;
  }, {});
  const [getKanbanDatas, setKanbanDatas] = useState(initialKanban);

  /**
   * @description 칸반 데이터를 초기화하는 함수
   * 로컬 스토리지에서 칸반 데이터를 가져와서 초기화한다.
   * @return {void}
   */
  const _init = () => {
    const kanbanDatas = localStorage.getItem("kanbanDatas");
    const startIdxData = localStorage.getItem("startIdx");
    if (startIdxData != null) {
      startIdx = Number(startIdxData);
    }
    if (kanbanDatas == null) {
      return;
    }
    const parsedKanbanDatas = JSON.parse(kanbanDatas);
    const newIssues = { ...initialKanban };
    Object.keys(parsedKanbanDatas).forEach((key) => {
      newIssues[key] = parsedKanbanDatas[key].map(
        (i) =>
          new IssueModel({
            ...i,
          }),
      );
    });
    setKanbanDatas(newIssues);
  };

  /**
   * @description 칸반 데이터를 저장하는 함수
   */
  const _saveKanbanDatas = () => {
    localStorage.setItem("kanbanDatas", JSON.stringify(getKanbanDatas()));
    localStorage.setItem("startIdx", startIdx);
  };
  /**
   * @description 이슈를 이동시키는 함수
   * @param {IssueModel} issue
   * @param {string} from
   * @param {string} to
   * @param {number?} idx
   */
  const handleMoveIssue = (issue, from, to, idx) => {
    const targetIdx = idx ?? -1;
    const kanbanDatas = getKanbanDatas();
    // drop 버그로 인해 이슈가 없는 칸반에서 이동 시 방지
    if (kanbanDatas[from].filter((i) => i.id === issue.id).length == 0) {
      return;
    }
    const newIssues = { ...kanbanDatas };
    newIssues[from] = newIssues[from].filter((i) => i.id !== issue.id);
    issue.status = to;
    newIssues[to] = [...newIssues[to]];
    newIssues[to].splice(
      targetIdx === -1 ? newIssues[to].length : targetIdx,
      0,
      issue,
    );
    setKanbanDatas(newIssues);
    _saveKanbanDatas();
  };
  /**
   * @description 이슈를 추가하는 함수
   * @param {string} title 제목
   * @param {string} authorId 담당자 ID
   * @param {string} writingIssueStatus 이슈 상태
   */
  const handleWriteIssue = (title, authorId, writingIssueStatus) => {
    const kanbanDatas = getKanbanDatas();
    const newIssues = { ...kanbanDatas };
    const newIssue = new IssueModel({
      id: `issue-${startIdx}`,
      title,
      status: writingIssueStatus,
      authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    newIssues[writingIssueStatus] = [
      ...newIssues[writingIssueStatus],
      newIssue,
    ];
    setKanbanDatas(newIssues);
    startIdx += 1;
    _saveKanbanDatas();
  };

  /**
   * @param {IssueModel} issue
   * @param {string} title
   * @param {string} authorId
   */
  const handleEditIssue = (issue, title, authorId) => {
    const kanbanDatas = getKanbanDatas();
    const newIssues = { ...kanbanDatas };
    const newIssue = new IssueModel({
      ...issue,
      title,
      authorId,
      updatedAt: new Date(),
    });
    newIssues[issue.status] = newIssues[issue.status].map((i) =>
      i.id === issue.id ? newIssue : i,
    );
    setKanbanDatas(newIssues);
    _saveKanbanDatas();
  };

  /**
   * @description 이슈를 삭제하는 함수
   * @param {IssueModel} issue
   */
  const handleDeleteIssue = (issue) => {
    console.log(issue);
    const kanbanDatas = getKanbanDatas();
    const newIssues = { ...kanbanDatas };
    newIssues[issue.status] = newIssues[issue.status].filter(
      (i) => i.id !== issue.id,
    );
    setKanbanDatas(newIssues);
    _saveKanbanDatas();
  };

  _init();

  return {
    getKanbanDatas,
    handleMoveIssue,
    handleWriteIssue,
    handleDeleteIssue,
    handleEditIssue,
    kanbanTitles,
  };
};
