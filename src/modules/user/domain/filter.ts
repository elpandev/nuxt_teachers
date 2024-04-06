import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";
import type { RoleEnum } from "./model";

interface IUserFilter extends IBaseFilter {
  role:      RoleEnum|undefined
  email:     string  |undefined
  season_id: string  |undefined
  course_id: string  |undefined
}

export class UserFilter extends BaseFilter implements IUserFilter {
  public role:      RoleEnum|undefined = undefined
  public email:     string  |undefined = undefined
  public season_id: string  |undefined = undefined
  public course_id: string  |undefined = undefined

  constructor(data?: Partial<IUserFilter>) {
    super(data)

    if (data) {
      if (data.email     != undefined) { this.email     = data.email }
      if (data.role      != undefined) { this.role      = data.role }
      if (data.season_id != undefined) { this.season_id = data.season_id }
      if (data.course_id != undefined) { this.course_id = data.course_id }
    }
  }

  public queries(): IQueryFilter[] {
    const queries = super.queries()

    if (this.email) { queries.push(new QueryWhere('email', '==', this.email)) }
    if (this.role)  { queries.push(new QueryWhere('role',  '==', this.role)) }

    if      (this.course_id) { queries.push(new QueryWhere('contains', 'array-contains', `COURSE_${this.course_id}`)) }
    else if (this.season_id) { queries.push(new QueryWhere('contains', 'array-contains', `SEASON_${this.season_id}`)) }

    return queries
  }
}
