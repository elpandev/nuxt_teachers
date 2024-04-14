import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface ITableFilter extends IBaseFilter {
  name?: string
}

export class TableFilter extends BaseFilter implements ITableFilter {
  public name?: string

  constructor(data?: Partial<ITableFilter>) {
    super(data)

    if (data) {
      if (data.name) this.name = data.name
    }
  }

  public queries(): IQueryFilter[] {
    const queries = super.queries()

    if (this.name?.isNotEmpty()) {
      for (const key of Object.keys(this.name.trigram())) {
        queries.push(new QueryWhere(`search_name.${key}`, '==', true))
      }
    }

    return queries
  }

  
  public get enabled(): boolean {
    return (
      this.name?.isNotEmpty() == true
    )
  }
}
