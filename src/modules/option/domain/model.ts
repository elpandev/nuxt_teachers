import { Validator } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { code_id } from "~/elpandev/utils";

export interface IOption extends IBaseModel {
  id:          string
  option:      string
  selected:    boolean
  task_id:     string
  question_id: string
}

export class Option extends BaseModel<IOption> {
  public id:          string  = code_id('T4gWkQn73fhuryNcHFa1vpICeKPl9BMjz2dDXsxOYGA6R5LVU8mtEwqSobZi0J')
  public option:      string  = ''
  public selected:    boolean = false
  public task_id:     string  = ''
  public question_id: string  = ''

  constructor(data?: Partial<IOption>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      payload: {},
      rules: {},
    })
  }

  public fromPayload(data?: Partial<IOption> | undefined): this {
    if (data) {
      if (data.id          !== undefined) this.id          = data.id
      if (data.option      !== undefined) this.option      = data.option
      if (data.selected    !== undefined) this.selected    = Boolean(data.selected)
      if (data.task_id     !== undefined) this.task_id     = data.task_id
      if (data.question_id !== undefined) this.question_id = data.question_id
    }

    return this
  }

  public toPayload(): Partial<IOption> {
    return {
      id:          this.id,
      option:      this.option,
      selected:    this.selected,
      task_id:     this.task_id,
      question_id: this.question_id,
    }
  }
}