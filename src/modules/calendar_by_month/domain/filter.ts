import { BaseFilter, QueryWhere, type IBaseFilter, type IQueryFilter } from "~/elpandev/hexagonal/base/domain/filter";

interface ICalendarByMonthFilter extends IBaseFilter {
  name?: string
}

export class CalendarByMonthFilter extends BaseFilter implements ICalendarByMonthFilter {
  public name?: string

  constructor(data?: Partial<ICalendarByMonthFilter>) {
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
