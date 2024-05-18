import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface IOptionFilter extends IBaseFilter {
  task_id?:     string
  question_id?: string
}

export class OptionFilter extends BaseFilter implements IOptionFilter {
  public task_id?: string
  public question_id?: string

  constructor(data?: Partial<IOptionFilter>) {
    super(data)

    if (data) {
      if (data.task_id     !== undefined) this.task_id     = data.task_id
      if (data.question_id !== undefined) this.question_id = data.question_id
    }
  }

  public toParams(): URLSearchParams {
    const params = super.toParams()

    if (typeof this.task_id     == 'string') params.set('task_id',     this.task_id)
    if (typeof this.question_id == 'string') params.set('question_id', this.question_id)

    return params
  }
}
