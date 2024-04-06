import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter, QueryOrderBy } from "~/elpandev/hexagonal/base/domain/filter";
import type { Course } from "../../course/domain/model";
import type { Student } from "../../student/domain/model";
import type { Category } from "../../category/domain/model";
import type { AttendanceRegisterStatusEnum } from "./values/register";

interface IAttendanceFilter extends IBaseFilter {
  name?:     string
  course?:   Course|null
  category?: Category|null
  student?:  Student
  student_status?: AttendanceRegisterStatusEnum
}

export class AttendanceFilter extends BaseFilter implements IAttendanceFilter {
  public name?:     string
  public course?:   Course|null
  public category?: Category|null
  public student?:  Student
  public student_status?: AttendanceRegisterStatusEnum

  constructor(data?: Partial<IAttendanceFilter>) {
    super(data)

    this.fromPayload(data)
  }

  public fromPayload(data?: Partial<IAttendanceFilter>): this {
    if (data) {
      if (this.name_enabled          (data.name))           this.name           = data.name
      if (this.course_enabled        (data.course))         this.course         = data.course
      if (this.category_enabled      (data.category))       this.category       = data.category
      if (this.student_enabled       (data.student))        this.student        = data.student
      if (this.student_status_enabled(data.student_status)) this.student_status = data.student_status
    }

    return this
  }

  public generate_contains(): string {
    const contains = [] as string[]

    if (this.student_enabled(this.student)) {
      this.student_status_enabled(this.student_status)
        ? contains.push(`student_${this.student!.id}_${this.student_status}`)
        : contains.push(`student_${this.student!.id}`)
    }

    contains.sort((a, b) => a.localeCompare(b))

    return contains.join('')
  }

  public queries(): IQueryFilter[] {
    const queries  = super.queries()
    const contains = this.generate_contains()

    if (this.name_enabled(this.name)) {
      for (const key of Object.keys(this.name!.trigram())) {
        queries.push(new QueryWhere(`search_name.${key}`, '==', true))
      }
    }

    if (!this.name_enabled(this.name)) {
      if (this.course_enabled(this.course)) {
        this.course === null
          ? queries.push(new QueryWhere('course',    '==', null))
          : queries.push(new QueryWhere('course.id', '==', this.course!.id))
      }
  
      if (this.category_enabled(this.category)) {
        this.category === null
          ? queries.push(new QueryWhere('category',    '==', null))
          : queries.push(new QueryWhere('category.id', '==', this.category!.id))
      }
  
      if (contains.isNotEmpty()) {
        queries.push(new QueryWhere('contains', 'array-contains', contains))
      }

      if (this.order) {
        queries.push(new QueryOrderBy(this.order.path, this.order.direction))
      }
    }

    return queries
  }

  public name_enabled          (value: string  |undefined):                     boolean { return value?.isNotEmpty() === true }
  public course_enabled        (value: Course  |undefined|null):                boolean { return value !== undefined || value === null }
  public category_enabled      (value: Category|undefined|null):                boolean { return value !== undefined || value === null }
  public student_enabled       (value: Student |undefined):                     boolean { return value !== undefined && value !== null }
  public student_status_enabled(value: AttendanceRegisterStatusEnum|undefined): boolean { return value !== undefined && value !== null }

  public enabled(): boolean {
    return (
      this.course_enabled        (this.course) ||
      this.category_enabled      (this.category) ||
      this.student_enabled       (this.student) ||
      this.student_status_enabled(this.student_status)
    )
  }

  public restart(data?: IAttendanceFilter) {
    this.name           = undefined
    this.course         = undefined
    this.category       = undefined
    this.student        = undefined
    this.student_status = undefined

    this.fromPayload(data)
  }
}
