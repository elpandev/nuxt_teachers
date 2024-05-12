import type { BaseModel } from "./model"

export enum OrderDirectionEnum {
  ASC  = 'ASC',
  DESC = 'DESC',
}

export interface IBaseFilterOrder {
  path:      string
  direction: OrderDirectionEnum
}

export interface IBaseFilter<T extends BaseModel> {
  cursor?: T
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

export abstract class BaseFilter<T extends BaseModel> {
  public cursor?: T
  public limit?:  number
  public order?:  IBaseFilterOrder

  constructor(data?: Partial<IBaseFilter<T>>) {
    if (data) {
      if (data.cursor) { this.cursor = data.cursor }
      if (data.limit)  { this.limit  = data.limit }
      if (data.order)  { this.order  = data.order }
    }
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

        if (this.cursor) {
          const payload = this.cursor.toPayload()

          params.cursor = `${payload[this.order.path]}${payload.id}`
        }
      }
    }

    return new URLSearchParams(params)
  }

  // abstract get enabled(): boolean
  // abstract restart(): void
}
