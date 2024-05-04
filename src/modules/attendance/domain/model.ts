import { Validator, required, string, min } from "@/elpandev/validator";
import { AttendanceRegister, AttendanceRegisterStatusEnum } from "./values/register";
import { Course } from "../../course/domain/model";
import type { IAttendanceRegister } from "./values/register";
import type { ICourse } from "../../course/domain/model";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { ErrorMessage } from "~/elpandev/hexagonal/module/domain/error";
import { code_id } from "~/elpandev/utils";
import { Category } from "../../category/domain/model";
import { SelectOption } from "~/src/presentation/models/select_option";

export interface IAttendanceCategory {
  category_id:   string|null
  category_name: string|null
}

export interface IAttendanceCourse {
  course_id:     string|null
  course_name:   string|null
}

export interface IAttendance extends IBaseModel, IAttendanceCategory, IAttendanceCourse {
  id:             string
  name:           string
  description:    string
  date_at:        number
  present_count:  number
  late_count:     number
  absent_count:   number
  expelled_count: number
}

export class Attendance extends BaseModel<IAttendance> {
  public id:             string      = code_id('yeR2GMIt6E89qKgCYrzvU1O4BTVNuXZWLpAjSslQJ35omchF0knadPibxHw7D');
  public name:           string      = '';
  public description:    string      = '';
  public date_at:        number      = Date.now();
  public present_count:  number      = 0
  public late_count:     number      = 0
  public absent_count:   number      = 0
  public expelled_count: number      = 0
  public category_id:    string|null = null;
  public category_name:  string|null = null;
  public course_id:      string|null = null;
  public course_name:    string|null = null;

  constructor(data?: Partial<IAttendance>) {
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

  public fromPayload(data?: Partial<IAttendance>): this {
    if (data) {
      if (data.id             != undefined) this.id             = data.id
      if (data.name           != undefined) this.name           = data.name
      if (data.description    != undefined) this.description    = data.description
      if (data.date_at        != undefined) this.date_at        = data.date_at
      if (data.present_count  != undefined) this.present_count  = data.present_count
      if (data.late_count     != undefined) this.late_count     = data.late_count
      if (data.absent_count   != undefined) this.absent_count   = data.absent_count
      if (data.expelled_count != undefined) this.expelled_count = data.expelled_count
      if (data.category_id    != undefined) this.category_id    = data.category_id
      if (data.category_name  != undefined) this.category_name  = data.category_name
      if (data.course_id      != undefined) this.course_id      = data.course_id
      if (data.course_name    != undefined) this.course_name    = data.course_name
    }

    return this
  }

  public toPayload(): Partial<IAttendance> {
    const payload: Partial<IAttendance> = {}

    payload.id             = this.id
    payload.name           = this.name
    payload.description    = this.description
    payload.date_at        = this.date_at
    payload.present_count  = this.present_count
    payload.late_count     = this.late_count
    payload.absent_count   = this.absent_count
    payload.expelled_count = this.expelled_count
    payload.category_id    = this.category_id
    payload.category_name  = this.category_name
    payload.course_id      = this.course_id
    payload.course_name    = this.course_name

    return payload
  }

  public toRelation(): Partial<IAttendance> {
    return {
      id:   this.id,
      name: this.name,
    }
  }

  public category_select_option(): SelectOption<Category> {
    const category = new Category({
      id:   this.category_id   ?? undefined,
      name: this.category_name ?? undefined,
    })

    return category.toSelectOption()
  }

  public course_select_option(): SelectOption<Course> {
    const course = new Course({
      id:   this.course_id   ?? undefined,
      name: this.course_name ?? undefined,
    })

    return course.toSelectOption()
  }
}
