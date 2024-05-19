import { Validator } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { code_id } from "~/elpandev/utils";
import { SelectOption } from "~/src/presentation/models/select_option";
import { Option } from "../../option/domain/model";
import type { UserQuestion } from "../../user_question/domain/model";

export interface IQuestion extends IBaseModel {
  id:          string
  type:        QuestionTypeEnum
  question:    string
  description: string
  points:      number
  task_id:     string
}

export enum QuestionTypeEnum {
  TEXT     = 'TEXT',
  SELECTOR = 'SELECTOR',
}

export function question_type_locale(type: QuestionTypeEnum): string {
  switch (type) {
    case QuestionTypeEnum.TEXT:     return 'Texto';
    case QuestionTypeEnum.SELECTOR: return 'Selección';
  
    default: return 'Desconocido';
  }
}

export const question_type_options: SelectOption<QuestionTypeEnum>[] = Object.values(QuestionTypeEnum)
  .map(value => new SelectOption({ id: value, name: question_type_locale(value), value }))

export class Question extends BaseModel<IQuestion> implements IQuestion {
  public id:          string               = code_id('T4gWkQn73fhuryNcHFa1vpICeKPl9BMjz2dDXsxOYGA6R5LVU8mtEwqSobZi0J')
  public type:        QuestionTypeEnum = QuestionTypeEnum.TEXT
  public question:    string               = ''
  public description: string               = ''
  public points:      number               = 0
  public task_id:     string               = ''

  constructor(data?: Partial<IQuestion>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      payload: {},
      rules: {},
    })
  }

  public fromPayload(data?: Partial<IQuestion> | undefined): this {
    if (data) {
      if (data.id          != undefined) { this.id          = data.id }
      if (data.type        != undefined) { this.type        = data.type }
      if (data.question    != undefined) { this.question    = data.question }
      if (data.description != undefined) { this.description = data.description }
      if (data.points      != undefined) { this.points      = Number(data.points) }
      if (data.task_id     != undefined) { this.task_id     = data.task_id }
    }

    return this
  }

  public toPayload(): Partial<IQuestion> {
    const payload: Partial<IQuestion> = {
      id:          this.id,
      type:        this.type,
      question:    this.question,
      description: this.description,
      points:      Number(this.points),
      task_id:     this.task_id,
    }

    return payload
  }

  public get is_text()     { return this.type == QuestionTypeEnum.TEXT }
  public get is_selector() { return this.type == QuestionTypeEnum.SELECTOR }
}