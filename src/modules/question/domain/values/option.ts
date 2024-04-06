import { BaseValue, type IBaseValue } from "~/elpandev/hexagonal/base/domain/value"
import { code_id } from "~/elpandev/utils"
import type { Validator } from "~/elpandev/validator"

export interface IQuestionOption extends IBaseValue {
  id:       string
  option:   string
  selected: boolean
}

export class QuestionOption extends BaseValue<IQuestionOption> implements IQuestionOption {
  public id:       string  = code_id('T4gWkQn73fhuryNcHFa1vpICeKPl9BMjz2dDXsxOYGA6R5LVU8mtEwqSobZi0J')
  public option:   string  = ''
  public selected: boolean = false

  public validate(): Validator {
    throw new Error("Method not implemented.");
  }

  public fromPayload(data?: Partial<IQuestionOption> | undefined): this {
    if (data) {
      if (data.id       != undefined) { this.id       = data.id }
      if (data.option   != undefined) { this.option   = data.option }
      if (data.selected != undefined) { this.selected = data.selected }
    }

    return this
  }

  public toPayload(): Partial<IQuestionOption> {
    const payload: Partial<IQuestionOption> = {}

    payload.id       = this.id
    payload.option   = this.option
    payload.selected = this.selected

    return payload
  }
}
