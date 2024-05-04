import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface IUserAttendanceFilter extends IBaseFilter {
  course_id?: string
}

export class UserAttendanceFilter extends BaseFilter implements IUserAttendanceFilter {
  public course_id?: string      

  constructor(data?: Partial<IUserAttendanceFilter>) {
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
