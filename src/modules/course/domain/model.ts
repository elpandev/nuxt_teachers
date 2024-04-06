import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import type { ISelectOption } from "~/src/presentation/interfaces/select_option";
import { Student, type IStudent } from "../../student/domain/model";

export interface ICourse extends IBaseModel  {
  name:           string
  description:    string
  students:       Record<string, Partial<IStudent>>
  students_count: number
}

export class Course extends BaseModel<ICourse> implements ICourse {
  public name:        string = '';
  public description: string = '';
  public students:    Record<string, Student> = {};

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
      if (data.id)          this.id          = data.id
      if (data.name)        this.name        = data.name
      if (data.description) this.description = data.description

      if (data.students) {
        this.students = Object
          .entries(data.students)
          .reduce((students, [key, value]) => Object.assign(students, { [key]: new Student({ id: key, ...value }) }), {})
      }
    }

    return this
  }

  public toPayload(): Partial<ICourse> {
    const payload: Partial<ICourse> = {}

    payload.id             = this.id
    payload.name           = this.name
    payload.description    = this.description
    payload.students_count = this.students_count

    payload.students = Object
      .entries(this.students)
      .reduce((students, [key, value]) => Object.assign(students, { [key]: value.toCourseRelation() }), {})

    Object.assign(payload, { search_name: payload.name.trigram() })

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

  public toSelectOption(): ISelectOption<Course> {
    return {
      name:  this.name,
      value: this,
    }
  }

  public get students_count(): number   { return Object.keys(this.students).length }
  public get students_names(): string[] { return Object.values(this.students).map(e => e.name) }
}
