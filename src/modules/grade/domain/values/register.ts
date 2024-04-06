import { Student } from "~/src/modules/student/domain/model";
import { BaseValue, type IBaseValue } from "~/elpandev/hexagonal/base/domain/value";

export interface IGradeRegister extends IBaseValue {
  id:      string
  name:    string
  comment: string
  score:   number
}

export class GradeRegister extends BaseValue<IGradeRegister> implements IGradeRegister {
  public id:      string = ''
  public name:    string = ''
  public comment: string = ''
  public score:   number = 0

  constructor(data?: Partial<IGradeRegister>) {
    super()

    this.fromPayload(data)
  }

  public fromPayload(data?: Partial<IGradeRegister>): this {
    if (data) {
      if (data.id)      { this.id      = data.id }
      if (data.name)    { this.name    = data.name }
      if (data.comment) { this.comment = data.comment }
      if (data.score)   { this.score   = data.score }
    }

    return this
  }

  public toPayload(): Partial<IGradeRegister> {
    const payload: Partial<IGradeRegister> = {}

    payload.id      = this.id
    payload.name    = this.name
    payload.name    = this.name
    payload.comment = this.comment
    payload.score   = this.score

    return payload
  }

  public fromStudent(student: Student): this {
    this.id   = student.id
    this.name = student.name

    return this
  }

  public toStudent(): Student {
    const student = new Student()

    student.id   = this.id
    student.name = this.name

    return student
  }
}
