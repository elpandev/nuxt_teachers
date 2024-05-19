import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { code_id } from "~/elpandev/utils";
import type { Question } from "../../question/domain/model";
import type { UserTask } from "../../user_task/domain/model";

export interface ITask extends IBaseModel {
  id:                   string
  name:                 string
  description:          string
  enabled:              boolean
  start_at:             number|null
  end_at:               number|null
  pending_count:        number
  started_count:        number
  completed_count:      number
  questions_count:      number
  questions_points_sum: number
  users_count:          number
  users_points_sum:     number
}

export class Task extends BaseModel<ITask> implements ITask {
  public id:                   string      = code_id('T4gWkQn73fhuryNcHFa1vpICeKPl9BMjz2dDXsxOYGA6R5LVU8mtEwqSobZi0J')
  public name:                 string      = '';
  public description:          string      = '';
  public enabled:              boolean     = true;
  public start_at:             number|null = null;
  public end_at:               number|null = null;
  public pending_count:        number      = 0
  public started_count:        number      = 0
  public completed_count:      number      = 0
  public questions_count:      number      = 0
  public questions_points_sum: number      = 0
  public users_count:          number      = 0
  public users_points_sum:     number      = 0

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
      if (data.id                   !== undefined) this.id                   = data.id
      if (data.name                 !== undefined) this.name                 = data.name
      if (data.description          !== undefined) this.description          = data.description
      if (data.enabled              !== undefined) this.enabled              = data.enabled
      if (data.start_at             !== undefined) this.start_at             = data.start_at
      if (data.end_at               !== undefined) this.end_at               = data.end_at
      if (data.pending_count        !== undefined) this.pending_count        = data.pending_count
      if (data.started_count        !== undefined) this.started_count        = data.started_count
      if (data.completed_count      !== undefined) this.completed_count      = data.completed_count
      if (data.questions_count      !== undefined) this.questions_count      = data.questions_count
      if (data.questions_points_sum !== undefined) this.questions_points_sum = data.questions_points_sum
      if (data.users_count          !== undefined) this.users_count          = data.users_count
      if (data.users_points_sum     !== undefined) this.users_points_sum     = data.users_points_sum
    }

    return this
  }

  public toPayload(): Partial<ITask> {
    return {
      id:                   this.id,
      name:                 this.name,
      description:          this.description,
      enabled:              this.enabled,
      start_at:             this.start_at,
      end_at:               this.end_at,
      pending_count:        this.pending_count,
      started_count:        this.started_count,
      completed_count:      this.completed_count,
      questions_count:      this.questions_count,
      questions_points_sum: this.questions_points_sum,
      users_count:          this.users_count,
      users_points_sum:     this.users_points_sum,
    }
  }

  public get start_at_expired(): boolean {
    return this.start_at != null && Date.now() >= this.start_at
  }

  public get end_at_expired(): boolean {
    return this.end_at != null && Date.now() >= this.end_at
  }

  public get users_points_average(): number {
    if (this.users_count <= 0) return 0

    return this.users_points_sum / this.users_count
  }
}
