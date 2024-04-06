import { BaseFilter, type IBaseFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface IStudentTaskFilter extends IBaseFilter {
  task_id?: string
}

export class StudentTaskFilter extends BaseFilter implements IStudentTaskFilter {
  public task_id?: string

  constructor(data?: Partial<IStudentTaskFilter>) {
    super(data)

    if (data) {
      if (data.task_id) { this.task_id = data.task_id }
    }
  }
}
