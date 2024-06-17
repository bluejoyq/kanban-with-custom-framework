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
export class IssueModel {
  title: string;
  authorId: string;
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    title: string;
    status: string;
    authorId: string;
    id: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  }) {
    this.title = params.title;
    this.authorId = params.authorId;
    this.id = params.id;
    this.status = params.status;
    
    if (params.createdAt instanceof Date) {
      this.createdAt = params.createdAt;
    } else if (typeof params.createdAt === "string") {
      this.createdAt = new Date(params.createdAt);
    } else {
      throw new Error("Invalid createdAt type");
    }

    if (params.updatedAt instanceof Date) {
      this.updatedAt = params.updatedAt;
    } else if (typeof params.updatedAt === "string") {
      this.updatedAt = new Date(params.updatedAt);
    } else {
      throw new Error("Invalid updatedAt type");
    }
  }
}
