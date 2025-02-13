import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import type { UserOption } from "../../user_option/domain/model";

export const enum UserQuestionStatusEnum {
  PENDING   = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface IUserQuestion extends IBaseModel {
  id:          string
  answer:      string|null
  comment:     string|null
  points:      number
  course_id:   string|null
  task_id:     string
  user_id:     string
  question_id: string
  status:      UserQuestionStatusEnum
}

export class UserQuestion extends BaseModel<IUserQuestion> {
  public get id(): string { return `${this.user_id}_${this.question_id}` }

  public answer:       string|null            = null
  public comment:      string|null            = null
  public points:       number                 = 0
  public course_id:    string|null            = null
  public task_id:      string                 = ''
  public user_id:      string                 = ''
  public question_id:  string                 = ''
  public status:       UserQuestionStatusEnum = UserQuestionStatusEnum.PENDING
  public user_options: UserOption[]           = []

  constructor(data?: Partial<IUserQuestion>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      payload: {
        user_id:   this.user_id,
        question_id: this.question_id,
      },
      rules: {
        user_id:       [required(), string()],
        question_id: [required(), string(), min(6)],
      },
    })
  }

  public fromPayload(data?: Partial<IUserQuestion>): this {
    if (data) {
      if (data.answer      !== undefined) this.answer      = data.answer
      if (data.comment     !== undefined) this.comment     = data.comment
      if (data.points      !== undefined) this.points      = data.points
      if (data.course_id   !== undefined) this.course_id   = data.course_id
      if (data.task_id     !== undefined) this.task_id     = data.task_id
      if (data.user_id     !== undefined) this.user_id     = data.user_id
      if (data.question_id !== undefined) this.question_id = data.question_id
      if (data.status      !== undefined) this.status      = data.status
    }

    return this
  }

  public toPayload(): Partial<IUserQuestion> {
    return {
      id:          this.id,
      answer:      this.answer,
      comment:     this.comment,
      points:      this.points,
      course_id:   this.course_id,
      task_id:     this.task_id,
      user_id:     this.user_id,
      question_id: this.question_id,
      status:      this.status,
    }
  }

  public has_changed(): boolean {
    if (this.initial === undefined) return false

    return (
      this.initial.answer != this.answer
    )
  }

  public get is_pending():   boolean { return this.status == UserQuestionStatusEnum.PENDING }
  public get is_completed(): boolean { return this.status == UserQuestionStatusEnum.COMPLETED }
}
