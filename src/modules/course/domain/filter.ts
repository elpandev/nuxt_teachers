import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface ICourseFilter extends IBaseFilter {
  name?:           string
  student_id?:     string
  students_count?: number
  teachers?:       boolean
}

export class CourseFilter extends BaseFilter implements ICourseFilter {
  public name?:           string
  public student_id?:     string
  public students_count?: number
  public teachers?: boolean

  constructor(data?: Partial<ICourseFilter>) {
    super(data)

    if (data) {
      if (data.name)           { this.name           = data.name }
      if (data.student_id)     { this.student_id     = data.student_id }
      if (data.students_count) { this.students_count = data.students_count }
      if (data.teachers)       { this.teachers       = data.teachers }
    }
  }

  public queries(): IQueryFilter[] {
    const queries = super.queries()

    if (this.name?.isNotEmpty()) {
      for (const key of Object.keys(this.name.trigram())) {
        queries.push(new QueryWhere(`search_name.${key}`, '==', true))
      }
    }

    if (this.student_id?.isNotEmpty()) {
      queries.push(new QueryWhere(`students.${this.student_id}`, '==', true))
    }

    if (Number.isInteger(this.students_count)) {
      queries.push(new QueryWhere('students_count', '==', this.students_count))
    }

    return queries
  }

  public toParams(): URLSearchParams {
    const params = super.toParams()

    if (this.teachers === true) {
      params.set('teachers', `${this.teachers}`)
    }

    return params
  }
}
