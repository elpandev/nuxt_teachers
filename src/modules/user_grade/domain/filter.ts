import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface IUserGradeFilter extends IBaseFilter {
  course_id?: string
  grade_id?: string
}

export class UserGradeFilter extends BaseFilter implements IUserGradeFilter {
  public course_id?: string      
  public grade_id?: string      

  constructor(data?: Partial<IUserGradeFilter>) {
    super(data)

    if (data) {
      if (data.course_id     !== undefined) { this.course_id     = data.course_id }
      if (data.grade_id !== undefined) { this.grade_id = data.grade_id }
    }
  }

  public toParams(): URLSearchParams {
    const params = super.toParams()

    if (typeof this.course_id == 'string') {
      params.append('course_id', this.course_id)
    }

    if (typeof this.grade_id == 'string') {
      params.append('grade_id', this.grade_id)
    }

    return params
  }
}
