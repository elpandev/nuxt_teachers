import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { code_id } from "~/elpandev/utils";
import { Course } from "../../course/domain/model";
import type { SelectOption } from "~/src/presentation/models/select_option";
import { Category } from "../../category/domain/model";

export interface IGrade extends IBaseModel {
  id:            string
  name:          string
  description:   string
  date_at:       Date
  users_count:   number
  scores_sum:    number
  course_id:     string|null
  course_name:   string|null
  category_id:   string|null
  category_name: string|null
}

export class Grade extends BaseModel<IGrade> implements IGrade {
  public id:            string      = code_id('yeR2GMIt6E89qKgCYrzvU1O4BTVNuXZWLpAjSslQJ35omchF0knadPibxHw7D');
  public name:          string      = ''
  public description:   string      = ''
  public date_at:       Date        = new Date()
  public users_count:   number      = 0
  public scores_sum:    number      = 0
  public course_id:     string|null = null
  public course_name:   string|null = null
  public category_id:   string|null = null
  public category_name: string|null = null

  constructor(data?: Partial<IGrade>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      bail: true,
      payload: {
        id:   this.id,
        name: this.name,
      },
      rules: {
        id:   [required(), string()],
        name: [required(), string(), min(4)],
      },
    })
  }

  public fromPayload(data?: Partial<IGrade>): this {
    if (data) {
      if (data.id            != undefined) this.id            = data.id
      if (data.name          != undefined) this.name          = data.name
      if (data.description   != undefined) this.description   = data.description
      if (data.date_at       != undefined) this.date_at       = data.date_at
      if (data.users_count   != undefined) this.users_count   = data.users_count
      if (data.scores_sum    != undefined) this.scores_sum    = data.scores_sum
      if (data.course_id     != undefined) this.course_id     = data.course_id
      if (data.course_name   != undefined) this.course_name   = data.course_name
      if (data.category_id   != undefined) this.category_id   = data.category_id
      if (data.category_name != undefined) this.category_name = data.category_name
    }

    return this
  }

  public toPayload(): Partial<IGrade> {
    const payload: Partial<IGrade> = {}

    payload.id            = this.id
    payload.name          = this.name
    payload.description   = this.description
    payload.date_at       = this.date_at
    payload.users_count   = this.users_count
    payload.scores_sum    = this.scores_sum
    payload.course_id     = this.course_id
    payload.course_name   = this.course_name
    payload.category_id   = this.category_id
    payload.category_name = this.category_name

    return payload
  }

  public course_select_option(): SelectOption<Course> {
    const course = new Course({
      id:   this.course_id   ?? undefined,
      name: this.course_name ?? undefined,
    })

    return course.toSelectOption()
  }

  public category_select_option(): SelectOption<Category> {
    const category = new Category({
      id:   this.category_id   ?? undefined,
      name: this.category_name ?? undefined,
    })

    return category.toSelectOption()
  }

  public get users_average(): number {    
    return this.users_count > 0
      ? this.scores_sum / this.users_count
      : 0
  }
}
