import { Validator, required, string, min } from "@/elpandev/validator";
import { Course, type ICourse } from "../../course/domain/model";
import type { ISelectOption } from "~/src/presentation/interfaces/select_option";
import { AttendanceRegisterStatusEnum } from "../../attendance/domain/values/register";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { code_id } from "~/elpandev/utils";

type AttendanceCount = { [key in AttendanceRegisterStatusEnum]?: number }

interface IStudentAttendances {
  unknown: AttendanceCount,
  courses: Record<string, AttendanceCount>
}

export interface IStudent extends IBaseModel {
  id:            string
  name:          string
  email:         string
  courses:       Record<string, Partial<ICourse>>
  courses_count: number
  attendances:   IStudentAttendances
}

export class Student extends BaseModel<IStudent> implements IStudent {
  public id:            string = code_id('yeR2GMIt6E89qKgCYrzvU1O4BTVNuXZWLpAjSslQJ35omchF0knadPibxHw7D');
  public name:          string = '';
  public email:         string = '';
  public courses:       Record<string, Course> = {};
  public attendances:   IStudentAttendances = { unknown: {}, courses: {} };

  constructor(data?: Partial<IStudent>) {
    super()

    this.fromPayload(data)
  }
  
  public validate(): Validator {
    return new Validator({
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

  public fromPayload(data?: Partial<IStudent> | undefined): this {
    if (data) {
      if (data.id          != undefined) this.id          = data.id
      if (data.name        != undefined) this.name        = data.name
      if (data.email       != undefined) this.email       = data.email
      if (data.attendances != undefined) this.attendances = data.attendances

      if (data.courses) {
        this.courses = Object
          .entries(data.courses)
          .reduce((courses, [key, value]) => Object.assign(courses, { [key]: new Course({ id: key, ...value }) }), {})
      }
    }

    return this
  }

  public toPayload(): Partial<IStudent> {
    const payload: Partial<IStudent> = {}

    payload.id            = this.id
    payload.name          = this.name
    payload.email         = this.email
    payload.attendances   = this.attendances
    payload.courses_count = this.courses_count

    payload.courses = Object
      .entries(this.courses)
      .reduce((courses, [key, value]) => Object.assign(courses, { [key]: value.toStudentRelation() }), {})

    Object.assign(payload, {
      search_name:  payload.name.trigram(),
      search_email: payload.email.trigram(),
    })

    return payload
  }

  public toCourseRelation(): Partial<IStudent> {
    return {
      name: this.name,
    }
  }

  public toTaskRelation(): Partial<IStudent> {
    return {
      id:   this.id,
      name: this.name,
    }
  }

  public toSelectOption(): ISelectOption {
    return {
      name:  this.name,
      value: this,
    }
  }

  public get present_count_unknown():          number { return this.attendances.unknown[AttendanceRegisterStatusEnum.PRESENT]          ?? 0 }
  public get late_count_unknown():             number { return this.attendances.unknown[AttendanceRegisterStatusEnum.LATE]             ?? 0 }
  public get absent_count_unknown():           number { return this.attendances.unknown[AttendanceRegisterStatusEnum.ABSENT]           ?? 0 }
  public get expelled_count_unknown():         number { return this.attendances.unknown[AttendanceRegisterStatusEnum.EXPELLED]         ?? 0 }

  public get present_count_courses():          number { return Object.values(this.attendances.courses).reduce((total, value) => total + (value[AttendanceRegisterStatusEnum.PRESENT]          ?? 0), 0) }
  public get late_count_courses():             number { return Object.values(this.attendances.courses).reduce((total, value) => total + (value[AttendanceRegisterStatusEnum.LATE]             ?? 0), 0) }
  public get absent_count_courses():           number { return Object.values(this.attendances.courses).reduce((total, value) => total + (value[AttendanceRegisterStatusEnum.ABSENT]           ?? 0), 0) }
  public get expelled_count_courses():         number { return Object.values(this.attendances.courses).reduce((total, value) => total + (value[AttendanceRegisterStatusEnum.EXPELLED]         ?? 0), 0) }

  public get courses_count(): number   { return Object.keys(this.courses).length }
  public get courses_names(): string[] { return Object.values(this.courses).map(e => e.name) }
}
