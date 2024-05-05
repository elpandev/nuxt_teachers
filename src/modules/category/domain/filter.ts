import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";
import type { CategoryTypeEnum } from "./model";

interface ICategoryFilter extends IBaseFilter {
  type?: CategoryTypeEnum
  name?: string
}

export class CategoryFilter extends BaseFilter implements ICategoryFilter {
  public type?: CategoryTypeEnum
  public name?: string

  constructor(data?: Partial<ICategoryFilter>) {
    super(data)

    if (data) {
      if (data.type) this.type = data.type
      if (data.name) this.name = data.name
    }
  }

  public queries(): IQueryFilter[] {
    const queries = super.queries()

    if (this.type?.isNotEmpty()) {
      queries.push(new QueryWhere(`type`, '==', this.type))
    }

    if (this.name?.isNotEmpty()) {
      for (const key of Object.keys(this.name.trigram())) {
        queries.push(new QueryWhere(`search_name.${key}`, '==', true))
      }
    }

    return queries
  }

  public toParams(): URLSearchParams {
    const params = super.toParams()

    this.type && params.append('type', this.type)
    this.name && params.append('name', this.name)

    return params
  }
  
  public get enabled(): boolean {
    return (
      this.type?.isNotEmpty() == true ||
      this.name?.isNotEmpty() == true
    )
  }
}
