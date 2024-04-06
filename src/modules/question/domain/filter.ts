import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface IQuestionFilter extends IBaseFilter {
  task_id?: string
}

export class QuestionFilter extends BaseFilter implements IQuestionFilter {
  public task_id?: string

  constructor(data?: Partial<IQuestionFilter>) {
    super(data)

    if (data) {
      if (data.task_id) { this.task_id = data.task_id }
    }
  }

  public queries(): IQueryFilter[] {
    const queries = super.queries()

    if (this.task_id?.isNotEmpty()) {
      queries.push(new QueryWhere(`task_id`, '==', this.task_id))
    }

    return queries
  }
}
