import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface IUserQuestionFilter extends IBaseFilter {
  course_id?: string
  question_id?: string
}

export class UserQuestionFilter extends BaseFilter implements IUserQuestionFilter {
  public course_id?: string      
  public question_id?: string      

  constructor(data?: Partial<IUserQuestionFilter>) {
    super(data)

    if (data) {
      if (data.course_id     !== undefined) { this.course_id     = data.course_id }
      if (data.question_id !== undefined) { this.question_id = data.question_id }
    }
  }

  public toParams(): URLSearchParams {
    const params = super.toParams()

    if (typeof this.course_id == 'string') {
      params.append('course_id', this.course_id)
    }

    if (typeof this.question_id == 'string') {
      params.append('question_id', this.question_id)
    }

    return params
  }
}
