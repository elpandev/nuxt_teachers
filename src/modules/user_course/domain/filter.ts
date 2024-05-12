import { BaseFilter, type IBaseFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface IUserCourseFilter extends IBaseFilter {
  course_id?: string
}

export class UserCourseFilter extends BaseFilter implements IUserCourseFilter {
  public course_id?: string      

  constructor(data?: Partial<IUserCourseFilter>) {
    super(data)

    if (data) {
      if (data.course_id != undefined) { this.course_id = data.course_id }
    }
  }

  public toParams(): URLSearchParams {
    const params = super.toParams()

    if (typeof this.course_id == 'string') {
      params.append('course_id', this.course_id)
    }

    return params
  }
}
