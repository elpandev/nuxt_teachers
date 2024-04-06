import { Validator, required, string } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";

export interface IGradeRegisterAggregate extends IBaseModel  {
  course_id:   string|null
  grade_id:    string
  category_id: string|null
  student_id:  string
  score:       number
}

export class GradeRegisterAggregate extends BaseModel<IGradeRegisterAggregate> implements IGradeRegisterAggregate {
  public course_id:   string|null = null
  public grade_id:    string = ''
  public category_id: string|null = null
  public student_id:  string = ''
  public score:       number = 0

  constructor(data?: Partial<IGradeRegisterAggregate>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      bail: true,
      payload: {
        id:          this.id,
        grade_id:    this.grade_id,
        student_id:  this.student_id,
        category_id: this.category_id,
        course_id:   this.course_id,
      },
      rules: {
        id:          [required(), string()],
        grade_id:    [required(), string()],
        student_id:  [required(), string()],
        category_id: [required(), string()],
        course_id:   [required(), string()],
      },
    })
  }

  public fromPayload(data?: Partial<IGradeRegisterAggregate>): this {
    if (data) {
      if (data.id)         this.id         = data.id
      if (data.grade_id)   this.grade_id   = data.grade_id
      if (data.student_id) this.student_id = data.student_id
      if (data.score)      this.score      = data.score
      if (data.category_id || data.category_id === null) this.category_id = data.category_id
      if (data.course_id   || data.course_id   === null) this.course_id   = data.course_id
    }

    return this
  }

  public toPayload(): Partial<IGradeRegisterAggregate> {
    const payload: Partial<IGradeRegisterAggregate> = {}

    payload.id          = this.id
    payload.grade_id    = this.grade_id
    payload.student_id  = this.student_id
    payload.category_id = this.category_id
    payload.course_id   = this.course_id
    payload.score       = this.score

    return payload
  }
}
