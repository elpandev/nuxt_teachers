import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";

export interface IUserGrade extends IBaseModel {
  id:            string
  user_id:       string
  user_name:     string
  grade_id:      string
  course_id:     string|null
  course_name:   string|null
  category_id:   string|null
  category_name: string|null
  comment:       string
  score:         number
}

export class UserGrade extends BaseModel<IUserGrade> {
  public get id() { return `${this.user_id}_${this.grade_id}` }

  public user_id:       string      = '';
  public user_name:     string      = '';
  public grade_id:      string      = '';
  public course_id:     string|null = '';
  public course_name:   string|null = '';
  public category_id:   string|null = '';
  public category_name: string|null = '';
  public comment:       string      = '';
  public score:         number      = 0

  constructor(data?: Partial<IUserGrade>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      payload: {
        user_id:   this.user_id,
        grade_id: this.grade_id,
      },
      rules: {
        user_id:  [required(), string()],
        grade_id: [required(), string(), min(6)],
      },
    })
  }

  public fromPayload(data?: Partial<IUserGrade>): this {
    if (data) {
      if (data.user_id       !== undefined) this.user_id       = data.user_id
      if (data.user_name     !== undefined) this.user_name     = data.user_name
      if (data.grade_id      !== undefined) this.grade_id      = data.grade_id
      if (data.course_id     !== undefined) this.course_id     = data.course_id
      if (data.course_name   !== undefined) this.course_name   = data.course_name
      if (data.category_id   !== undefined) this.category_id   = data.category_id
      if (data.category_name !== undefined) this.category_name = data.category_name
      if (data.comment       !== undefined) this.comment       = data.comment
      if (data.score         !== undefined) this.score         = data.score
    }

    return this
  }

  public toPayload(): Partial<IUserGrade> {
    return {
      id:            this.id,
      user_id:       this.user_id,
      user_name:     this.user_name,
      grade_id:      this.grade_id,
      course_id:     this.course_id,
      course_name:   this.course_name,
      category_id:   this.category_id,
      category_name: this.category_name,
      comment:       this.comment,
      score:         this.score,
    }
  }
}
