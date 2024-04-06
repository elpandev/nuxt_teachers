import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface IStudentQuestionFilter extends IBaseFilter {
  student_id?: string
  task_id?: string
  question_id?: string
}

export class StudentQuestionFilter extends BaseFilter implements IStudentQuestionFilter {
  public student_id?: string
  public task_id?: string
  public question_id?: string

  constructor(data?: Partial<IStudentQuestionFilter>) {
    super(data)

    if (data) {
      if (data.student_id)  { this.student_id  = data.student_id }
      if (data.task_id)     { this.task_id     = data.task_id }
      if (data.question_id) { this.question_id = data.question_id }
    }
  }

  public queries(): IQueryFilter[] {
    const queries = super.queries()

    if (this.student_id ?.isNotEmpty()) queries.push(new QueryWhere(`student_id`,  '==', this.student_id))
    if (this.task_id    ?.isNotEmpty()) queries.push(new QueryWhere(`task_id`,     '==', this.task_id))
    if (this.question_id?.isNotEmpty()) queries.push(new QueryWhere(`question_id`, '==', this.question_id))

    return queries
  }
}
