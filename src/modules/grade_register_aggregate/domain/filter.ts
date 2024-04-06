import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface IGradeRegisterAggregateFilter extends IBaseFilter {
  course_id?:   string|null
  grade_id?:    string
  category_id?: string|null
  student_id?:  string
}

export class GradeRegisterAggregateFilter extends BaseFilter implements IGradeRegisterAggregateFilter {
  public course_id?:   string|null
  public grade_id?:    string
  public category_id?: string|null
  public student_id?:  string
  
  constructor(data?: Partial<IGradeRegisterAggregateFilter>) {
    super(data)

    if (data) {
      if (this.course_id_enabled  (data.course_id))   this.course_id   = data.course_id
      if (this.grade_id_enabled   (data.grade_id))    this.grade_id    = data.grade_id
      if (this.category_id_enabled(data.category_id)) this.category_id = data.category_id
      if (this.student_id_enabled (data.student_id))  this.student_id  = data.student_id
    }
  }

  public queries(): IQueryFilter[] {
    const queries = super.queries()

    if (this.course_id_enabled  (this.course_id))   queries.push(new QueryWhere('course_id',   '==', this.course_id))
    if (this.grade_id_enabled   (this.grade_id))    queries.push(new QueryWhere('grade_id',    '==', this.grade_id))
    if (this.category_id_enabled(this.category_id)) queries.push(new QueryWhere('category_id', '==', this.category_id))
    if (this.student_id_enabled (this.student_id))  queries.push(new QueryWhere('student_id',  '==', this.student_id))

    return queries
  }

  public course_id_enabled  (value?: string|null) { return value !== undefined || value === null }
  public grade_id_enabled   (value?: string)      { return value !== undefined && value !== null }
  public category_id_enabled(value?: string|null) { return value !== undefined || value === null }
  public student_id_enabled (value?: string)      { return value !== undefined && value !== null }

  public enabled(): boolean {
    return (
      this.course_id_enabled  (this.course_id) ||
      this.grade_id_enabled   (this.grade_id) ||
      this.category_id_enabled(this.category_id) ||
      this.student_id_enabled (this.student_id)
    )
  }
}
