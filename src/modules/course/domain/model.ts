import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import type { ISelectOption } from "~/src/presentation/interfaces/select_option";
import { Student, type IStudent } from "../../student/domain/model";
import { SelectOption } from "~/src/presentation/models/select_option";
import { code_id } from "~/elpandev/utils";
import { User, type IUser } from "../../user/domain/model";
import type { IAttendanceCount } from "../../attendance/domain/model";

export interface ICourseCount {
  students_count:    number
  attendances_count: number
}

export interface ICourseTeacher {
  teacher_id:   string|null
  teacher_name: string|null
}

export interface ICourse extends IBaseModel, ICourseTeacher, ICourseCount, IAttendanceCount  {
  id:          string
  name:        string
  description: string
}

export class Course extends BaseModel<ICourse> implements ICourse {
  public id:          string = code_id('tEAFT4gbZi0JyNc6R5LVU8ma1vpICeKPlwhur3fMjz2dDXsxOYG9BqSoHWkQn7')
  public name:        string = ''
  public description: string = ''

  public teacher_id:   string|null = null
  public teacher_name: string|null = null

  public students_count:    number = 0
  public attendances_count: number = 0

  public present_count:  number = 0
  public late_count:     number = 0
  public absent_count:   number = 0
  public expelled_count: number = 0

  constructor(data?: Partial<ICourse>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      bail: true,
      payload: {
        id:   this.id,
        name: this.name,
      },
      rules: {
        id:   [required(), string()],
        name: [required(), string(), min(4)],
      },
    })
  }

  public fromPayload(data?: Partial<ICourse>): this {
    if (data) {
      if (data.id          !== undefined) this.id          = data.id
      if (data.name        !== undefined) this.name        = data.name
      if (data.description !== undefined) this.description = data.description

      if (data.teacher_id   !== undefined) this.teacher_id   = data.teacher_id
      if (data.teacher_name !== undefined) this.teacher_name = data.teacher_name

      if (data.students_count    !== undefined) this.students_count    = data.students_count
      if (data.attendances_count !== undefined) this.attendances_count = data.attendances_count

      if (data.present_count  !== undefined) this.present_count  = data.present_count
      if (data.late_count     !== undefined) this.late_count     = data.late_count
      if (data.absent_count   !== undefined) this.absent_count   = data.absent_count
      if (data.expelled_count !== undefined) this.expelled_count = data.expelled_count
    }

    return this
  }

  public toPayload(): Partial<ICourse> {
    return {
      id:          this.id,
      name:        this.name,
      description: this.description,

      teacher_id:   this.teacher_id,
      teacher_name: this.teacher_name,

      students_count:    this.students_count,
      attendances_count: this.attendances_count,

      present_count:  this.present_count,
      late_count:     this.late_count,
      absent_count:   this.absent_count,
      expelled_count: this.expelled_count,
    }
  }

  public toSelectOption(): SelectOption<Course> {
    return new SelectOption({
      id:    this.id,
      name:  this.name,
      value: this,
    })
  }
}
