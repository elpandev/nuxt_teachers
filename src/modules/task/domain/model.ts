import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { User } from "../../user/domain/model";
import { code_id } from "~/elpandev/utils";
import type { Question } from "../../question/domain/model";

export interface ITask extends IBaseModel {
  id:              string
  name:            string
  description:     string
  enabled:         boolean
  start_at:        number|null
  end_at:          number|null
  users_count:     number
  questions_count: number
  points_sum:      number
}

export class Task extends BaseModel<ITask> implements ITask {
  public id:              string      = code_id('T4gWkQn73fhuryNcHFa1vpICeKPl9BMjz2dDXsxOYGA6R5LVU8mtEwqSobZi0J')
  public name:            string      = '';
  public description:     string      = '';
  public enabled:         boolean     = true;
  public start_at:        number|null = null;
  public end_at:          number|null = null;
  public users_count:     number      = 0;
  public questions_count: number      = 0;
  public points_sum:      number      = 0;

  constructor(data?: Partial<ITask>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      payload: {
        id:   this.id,
        name: this.name,
      },
      rules: {
        id:   [required(), string()],
        name: [required(), string(), min(6)],
      },
    })
  }

  public fromPayload(data?: Partial<ITask> | undefined): this {
    if (data) {
      if (data.id              != undefined) this.id              = data.id
      if (data.name            != undefined) this.name            = data.name
      if (data.description     != undefined) this.description     = data.description
      if (data.enabled         != undefined) this.enabled         = data.enabled
      if (data.start_at        != undefined) this.start_at        = data.start_at
      if (data.end_at          != undefined) this.end_at          = data.end_at
      if (data.users_count     != undefined) this.users_count     = data.users_count
      if (data.questions_count != undefined) this.questions_count = data.questions_count
      if (data.points_sum      != undefined) this.points_sum      = data.points_sum
    }

    return this
  }

  public toPayload(): Partial<ITask> {
    const payload: Partial<ITask> = {}

    payload.id              = this.id
    payload.name            = this.name
    payload.description     = this.description
    payload.enabled         = this.enabled
    payload.start_at        = this.start_at
    payload.end_at          = this.end_at
    payload.users_count     = this.users_count
    payload.questions_count = this.questions_count
    payload.points_sum      = this.points_sum

    return payload
  }

  public toStudentRelation(): Partial<ITask> {
    return {
      id:   this.id,
      name: this.name,
    }
  }

  public calculate_points(questions: Question[]): number {
    return questions
      .reduce((points, question) => points += question.points, 0)
  }

  public get start_at_expired(): boolean {
    return this.start_at != null && Date.now() >= this.start_at
  }

  public get end_at_expired(): boolean {
    return this.end_at != null && Date.now() >= this.end_at
  }
}
