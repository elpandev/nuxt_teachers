import { BaseFilter, type IBaseFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface IUserTaskFilter extends IBaseFilter {
  task_id?: string
}

export class UserTaskFilter extends BaseFilter implements IUserTaskFilter {
  public task_id?: string

  constructor(data?: Partial<IUserTaskFilter>) {
    super(data)

    if (data) {
      if (data.task_id) { this.task_id = data.task_id }
    }
  }
}
