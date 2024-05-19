import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";

export interface IUserOption extends IBaseModel {
  id:          string
  user_id:     string
  option_id:   string
  task_id:     string
  question_id: string
  selected:    boolean
}

export class UserOption extends BaseModel<IUserOption> {
  public get id() { return `${this.user_id}_${this.option_id}` }

  public user_id:     string  = ''
  public option_id:   string  = ''
  public task_id:     string  = ''
  public question_id: string  = ''
  public selected:    boolean = false

  constructor(data?: Partial<IUserOption>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      payload: {
        user_id:   this.user_id,
        option_id: this.option_id,
      },
      rules: {
        user_id:   [required(), string()],
        option_id: [required(), string(), min(6)],
      },
    })
  }

  public fromPayload(data?: Partial<IUserOption>): this {
    if (data) {
      if (data.user_id     !== undefined) this.user_id     = data.user_id
      if (data.option_id   !== undefined) this.option_id   = data.option_id
      if (data.task_id     !== undefined) this.task_id     = data.task_id
      if (data.question_id !== undefined) this.question_id = data.question_id
      if (data.selected    !== undefined) this.selected    = data.selected
    }

    return this
  }

  public toPayload(): Partial<IUserOption> {
    return {
      user_id:     this.user_id,
      option_id:   this.option_id,
      task_id:     this.task_id,
      question_id: this.question_id,
      selected:    this.selected,
    }
  }
}
