import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface ISubscriptionFilter extends IBaseFilter {
  name:           string  |undefined
  email:          string  |undefined
  season_id:      string  |undefined
  course_id:      string  |undefined
  courses_count?: number
}

export class SubscriptionFilter extends BaseFilter implements ISubscriptionFilter {
  public name:      string  |undefined = undefined
  public email:     string  |undefined = undefined
  public season_id: string  |undefined = undefined
  public course_id: string  |undefined = undefined
  public courses_count?: number = undefined

  constructor(data?: Partial<ISubscriptionFilter>) {
    super(data)

    if (data) {
      if (data.name          != undefined) { this.name          = data.name }
      if (data.email         != undefined) { this.email         = data.email }
      if (data.season_id     != undefined) { this.season_id     = data.season_id }
      if (data.course_id     != undefined) { this.course_id     = data.course_id }
      if (data.courses_count != undefined) { this.courses_count = data.courses_count }
    }
  }

  public queries(): IQueryFilter[] {
    const queries = super.queries()

    if (this.name?.isNotEmpty()) {
      for (const key of Object.keys(this.name.trigram())) {
        queries.push(new QueryWhere(`search_name.${key}`, '==', true))
      }
    }

    if (this.email?.isNotEmpty()) {
      for (const key of Object.keys(this.email.trigram())) {
        queries.push(new QueryWhere(`search_email.${key}`, '==', true))
      }
    }

    if      (this.course_id) { queries.push(new QueryWhere(`courses.${this.course_id}`, '==', true)) }
    else if (this.season_id) { queries.push(new QueryWhere(`seasons.${this.season_id}`, '==', true)) }

    if (Number.isInteger(this.courses_count)) {
      queries.push(new QueryWhere('courses_count', '==', this.courses_count))
    }

    return queries
  }
}
