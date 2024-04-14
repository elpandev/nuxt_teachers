import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface IColumnFilter extends IBaseFilter {
  table_id?: string
}

export class ColumnFilter extends BaseFilter implements IColumnFilter {
  public table_id?: string

  constructor(data?: Partial<IColumnFilter>) {
    super(data)

    if (data) {
      if (data.table_id) this.table_id = data.table_id
    }
  }

  public queries(): IQueryFilter[] {
    const queries = super.queries()

    if (this.table_id?.isNotEmpty()) {
      queries.push(new QueryWhere(`table_id`, '==', this.table_id))
    }

    return queries
  }

  
  public get enabled(): boolean {
    return (
      this.table_id?.isNotEmpty() == true
    )
  }
}
