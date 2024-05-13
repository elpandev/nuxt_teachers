import type { BaseModel } from "./model"

export enum OrderDirectionEnum {
  ASC  = 'ASC',
  DESC = 'DESC',
}

export interface IBaseFilterOrder {
  path:      string
  direction: OrderDirectionEnum
}

export interface IBaseFilter {
  cursor?: string
  limit?:  number
  order?:  IBaseFilterOrder
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

export abstract class BaseFilter<T extends IBaseFilter> {
  public cursor?: string
  public limit?:  number
  public order?:  IBaseFilterOrder

  constructor(data?: Partial<T>) {
    this.fromPayload(data)
  }

  public queries(): IQueryFilter[] {
    const queries: IQueryFilter[] = []

    if (this.limit) { queries.push(new QueryLimit(this.limit)) }

    return queries
  }

  public toParams(): URLSearchParams {
    const params: Record<string, string> = {}

    if (typeof this.limit == 'number' && this.limit > 0) {
      params.limit = this.limit.toString()
    }

    if (typeof this.order == 'object') {
      if (typeof this.order.path == 'string' && Object.values(OrderDirectionEnum).includes(this.order.direction)) {
        params.order_by        = this.order.path.toString()
        params.order_direction = this.order.direction.toString()

        if (this.cursor) params.cursor = this.cursor
      }
    }

    return new URLSearchParams(params)
  }

  public fromPayload(data?: Partial<T>): typeof this {
    if (data) {
      if (data.cursor) { this.cursor = data.cursor }
      if (data.limit)  { this.limit  = data.limit }
      if (data.order)  { this.order  = data.order }
    }

    return this
  }

  public toPayload(): Partial<T> {
    return {
      cursor: this.cursor,
      limit:  this.limit,
      order:  this.order,
    } as any
  }

  // abstract get enabled(): boolean
  // abstract restart(): void
}
