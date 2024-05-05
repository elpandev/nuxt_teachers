import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface IUserAttendanceFilter extends IBaseFilter {
  course_id?: string
  attendance_id?: string
}

export class UserAttendanceFilter extends BaseFilter implements IUserAttendanceFilter {
  public course_id?: string      
  public attendance_id?: string      

  constructor(data?: Partial<IUserAttendanceFilter>) {
    super(data)

    if (data) {
      if (data.course_id     !== undefined) { this.course_id     = data.course_id }
      if (data.attendance_id !== undefined) { this.attendance_id = data.attendance_id }
    }
  }

  public toParams(): URLSearchParams {
    const params = super.toParams()

    if (typeof this.course_id == 'string') {
      params.append('course_id', this.course_id)
    }

    if (typeof this.attendance_id == 'string') {
      params.append('attendance_id', this.attendance_id)
    }

    return params
  }
}
