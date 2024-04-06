import { Validator } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import type { QuestionOption } from "../../question/domain/values/option";
import type { Question } from "../../question/domain/model";

export interface IStudentQuestion extends IBaseModel {
  id:          string
  task_id:     string
  student_id:  string
  question_id: string
  points:      number
  text:        string
  options:     Record<string, true>
}

export class StudentQuestion extends BaseModel<IStudentQuestion> implements IStudentQuestion {
  public id:          string = ''
  public task_id:     string = ''
  public student_id:  string = ''
  public question_id: string = ''
  public text:        string = ''
  public points:      number = 0
  public options:     Record<string, true> = {}

  public initial?: StudentQuestion

  constructor(data?: Partial<IStudentQuestion>) {
    super()

    this.fromPayload(data)
  }

  public copyWith(data?: Partial<IStudentQuestion> | undefined): this {
    const model = super.copyWith(data)

    model.options = JSON.parse(JSON.stringify(model.options))

    return model
  }

  public validate(): Validator {
    return new Validator({
      payload: {},
      rules: {},
    })
  }

  public fromPayload(data?: Partial<IStudentQuestion> | undefined): this {
    if (data) {
      if (data.id)          { this.id          = data.id }
      if (data.task_id)     { this.task_id     = data.task_id }
      if (data.student_id)  { this.student_id  = data.student_id }
      if (data.question_id) { this.question_id = data.question_id }
      if (data.text)        { this.text        = data.text }
      if (data.points)      { this.points      = Number(data.points) }
      if (data.options)     { this.options     = data.options }
    }

    return this
  }

  public toPayload(): Partial<IStudentQuestion> {
    const payload: Partial<IStudentQuestion> = {
      id:          this.id,
      task_id:     this.task_id,
      student_id:  this.student_id,
      question_id: this.question_id,
      text:        this.text,
      points:      this.points,
      options:     this.options,
    }

    return payload
  }

  public get has_changed(): boolean {
    if (this.initial === undefined) return false

    return (
      this.text != this.initial.text ||
      JSON.stringify(this.options) != JSON.stringify(this.initial.options)
    )
  }

  public evaluate(question: Question) {
    if (question.is_selector) {
      for (const option of question.options) {
        if (option.selected && option.selected != this.options[option.id]) {
          return this.points = 0
        }

        if (!option.selected && this.options[option.id]) {
          return this.points = 0
        }
      }
    }

    this.points = question.points
  }

  public on_option_checked(option: QuestionOption) {
    this.options[option.id]
      ? delete this.options[option.id]
      : this.options[option.id] = true
  }
}