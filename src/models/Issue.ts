/**
 * 칸반의 이슈를 위한 모델
 * @class IssueModel
 * @property {string} title 이슈 제목
 * @property {string} authorId 담당자 id
 * @property {string} id 이슈 고유 id
 * @property {string} status 이슈 상태
 * @property {Date | string} createdAt 생성된 날짜
 * @property {Date | string} updatedAt 최근 업데이트된 날짜
 */
export class IssueModel<
  KanbanStatus extends string = "to-do" | "doing" | "done",
> {
  title: string;
  authorId: string;
  id: string;
  status: KanbanStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    title,
    status,
    authorId,
    id,
    createdAt,
    updatedAt,
  }: {
    title: string;
    status: KanbanStatus;
    authorId: string;
    id: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  }) {
    this.title = title;
    this.authorId = authorId;
    this.id = id;
    this.status = status;
    if (createdAt instanceof Date) {
      this.createdAt = createdAt;
    } else if (typeof createdAt === "string") {
      this.createdAt = new Date(createdAt);
    } else {
      throw new Error("Invalid createdAt type");
    }

    if (updatedAt instanceof Date) {
      this.updatedAt = updatedAt;
    } else if (typeof updatedAt === "string") {
      this.updatedAt = new Date(updatedAt);
    } else {
      throw new Error("Invalid updatedAt type");
    }
  }
}
