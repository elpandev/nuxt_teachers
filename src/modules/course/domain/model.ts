import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import type { ISelectOption } from "~/src/presentation/interfaces/select_option";
import { Student, type IStudent } from "../../student/domain/model";
import { SelectOption } from "~/src/presentation/models/select_option";
import { code_id } from "~/elpandev/utils";
import { User, type IUser } from "../../user/domain/model";

export interface ICourse extends IBaseModel  {
  id:             string
  name:           string
  description:    string
  students_count: number
  teachers_count: number
  teachers:       Partial<IUser>[]
}

export class Course extends BaseModel<ICourse> implements ICourse {
  public id:             string = code_id('tEAFT4gbZi0JyNc6R5LVU8ma1vpICeKPlwhur3fMjz2dDXsxOYG9BqSoHWkQn7');
  public name:           string = '';
  public description:    string = '';
  public students_count: number = 0;
  public teachers_count: number = 0;
  public teachers:       User[] = [];

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
      if (data.id)             this.id             = data.id
      if (data.name)           this.name           = data.name
      if (data.description)    this.description    = data.description
      if (data.teachers_count) this.teachers_count = data.teachers_count
      if (data.students_count) this.students_count = data.students_count
      if (data.teachers)       this.teachers       = data.teachers.map(e => new User(e))
    }

    return this
  }

  public toPayload(): Partial<ICourse> {
    const payload: Partial<ICourse> = {}

    payload.id             = this.id
    payload.name           = this.name
    payload.description    = this.description
    payload.teachers_count = this.teachers_count
    payload.students_count = this.students_count
    payload.teachers       = this.teachers.map(e => e.toPayload())

    return payload
  }

  public toStudentRelation(): Partial<ICourse> {
    return {
      id:   this.id,
      name: this.name,
    }
  }

  public toAttendanceRelation(): Partial<ICourse> {
    return {
      id:   this.id,
      name: this.name,
    }
  }

  public toGradeRelation(): Partial<ICourse> {
    return {
      id:   this.id,
      name: this.name,
    }
  }

  public toSelectOption(): SelectOption<Course> {
    return new SelectOption({
      id:    this.id,
      name:  this.name,
      value: this,
    })
  }

  public get teachers_name():  string[] { return this.teachers.map(e => e.name) }
  public get students_names(): string[] { return [] }
}
