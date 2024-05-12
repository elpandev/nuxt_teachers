import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";
import { UserRoleEnum } from "./model";

interface IUserFilter extends IBaseFilter {
  name?:      string
  email?:     string
  roles?:     UserRoleEnum[]
  season_id?: string
  course_id?: string
}

export class UserFilter extends BaseFilter implements IUserFilter {
  public name?:      string      
  public email?:     string      
  public roles?:     UserRoleEnum[]
  public season_id?: string      
  public course_id?: string      

  constructor(data?: Partial<IUserFilter>) {
    super(data)

    if (data) {
      if (data.name       != undefined) { this.name     = data.name }
      if (data.email     != undefined) { this.email     = data.email }
      if (data.roles     != undefined) { this.roles     = data.roles }
      if (data.season_id != undefined) { this.season_id = data.season_id }
      if (data.course_id != undefined) { this.course_id = data.course_id }
    }
  }

  public queries(): IQueryFilter[] {
    const queries = super.queries()

    if (this.email) { queries.push(new QueryWhere('email', '==', this.email)) }
    // if (this.role)  { queries.push(new QueryWhere('role',  '==', this.role)) }

    if      (this.course_id) { queries.push(new QueryWhere('contains', 'array-contains', `COURSE_${this.course_id}`)) }
    else if (this.season_id) { queries.push(new QueryWhere('contains', 'array-contains', `SEASON_${this.season_id}`)) }

    return queries
  }

  public toParams(): URLSearchParams {
    const params = super.toParams()

    if (typeof this.name == 'string') {
      params.append('name', this.name)
    }

    if (typeof this.email == 'string') {
      params.append('email', this.email)
    }

    if (Array.isArray(this.roles)) {
      for (const role of this.roles) {
        params.append('roles[]', role)
      }
    }
    
    if (typeof this.course_id == 'string') {
      params.append('course_id', this.course_id)
    }

    return params
  }
}
