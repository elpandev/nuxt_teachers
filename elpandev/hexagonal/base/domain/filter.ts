export enum OrderDirectionEnum {
  ASC  = 'asc',
  DESC = 'desc',
}

export interface IBaseFilterOrder {
  path:      string
  direction: OrderDirectionEnum
}

export interface IBaseFilter {
  limit?: number
  order?: IBaseFilterOrder
}

export type IQueryFilter = QueryWhere|QueryOrderBy|QueryLimit

export class QueryWhere<T = unknown> {
  constructor(
    public path: string,
    public operator: '=='|'!='|'array-contains'|'>'|'>='|'<'|'<='|'in',
    public value: T,
  ) {}
}

export class QueryOrderBy {
  constructor(
    public path: string,
    public direction: OrderDirectionEnum,
  ) {}
}

export class QueryLimit {
  constructor(
    public limit: number,
  ) {}
}

export abstract class BaseFilter implements IBaseFilter {
  public limit?: number           = undefined
  public order?: IBaseFilterOrder = undefined

  constructor(data?: Partial<IBaseFilter>) {
    if (data) {
      if (data.limit) { this.limit = data.limit }
      if (data.order) { this.order = data.order }
    }
  }

  public queries(): IQueryFilter[] {
    const queries: IQueryFilter[] = []

    if (this.limit) { queries.push(new QueryLimit(this.limit)) }

    return queries
  }

  // abstract get enabled(): boolean
  // abstract restart(): void
}
