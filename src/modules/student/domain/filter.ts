import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter, QueryOrderBy } from "~/elpandev/hexagonal/base/domain/filter";

interface IStudentFilter extends IBaseFilter {
  name?:          string
  email?:         string
  course_id?:     string
  courses_count?: number
}

export class StudentFilter extends BaseFilter implements IStudentFilter {
  public name?:          string
  public email?:         string
  public course_id?:     string
  public courses_count?: number

  constructor(data?: Partial<IStudentFilter>) {
    super(data)

    if (data) {
      if (data.name)          { this.name          = data.name }
      if (data.email)         { this.email         = data.email }
      if (data.course_id)     { this.course_id     = data.course_id }
      if (data.courses_count) { this.courses_count = data.courses_count }
    }
  }

  public queries(): IQueryFilter[] {
    const queries = super.queries()

    if (this.name_enabled) {
      for (const key of Object.keys(this.name!.trigram())) {
        queries.push(new QueryWhere(`search_name.${key}`, '==', true))
      }
    }

    if (this.email_enabled) {
      for (const key of Object.keys(this.email!.trigram())) {
        queries.push(new QueryWhere(`search_email.${key}`, '==', true))
      }
    }

    if (this.course_id_enabled)     queries.push(new QueryWhere(`courses.${this.course_id}`, '!=', null))
    if (this.courses_count_enabled) queries.push(new QueryWhere('courses_count', '==', this.courses_count))

    if (!this.enabled) {
      if (this.order) queries.push(new QueryOrderBy(this.order.path, this.order.direction))
    }

    return queries
  }

  public get name_enabled():          boolean { return this.name          !== undefined && this.name.isNotEmpty() }
  public get email_enabled():         boolean { return this.email         !== undefined && this.email.isNotEmpty() }
  public get course_id_enabled():     boolean { return this.course_id     !== undefined && this.course_id.isNotEmpty() }
  public get courses_count_enabled(): boolean { return this.courses_count !== undefined && this.courses_count >= 0 }

  public get enabled(): boolean {
    return (
      this.name_enabled ||
      this.email_enabled ||
      this.course_id_enabled ||
      this.courses_count_enabled
    )
  }

  public restart(): void {
    this.name          = undefined
    this.email         = undefined
    this.course_id     = undefined
    this.courses_count = undefined
  }
}
