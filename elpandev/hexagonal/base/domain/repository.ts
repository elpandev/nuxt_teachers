import { BaseFilter } from "./filter";
import { BaseModel } from "./model";

export interface IBaseModelRepository<T extends BaseModel> {
  reference(): string

  get        (id: string): Promise<T|undefined>
  store      (model: T):   Promise<void>
  update     (id: string, payload: Record<string, any>): Promise<void>
  destroy    (id: string): Promise<void>
  paginate   (filter?: BaseFilter, last?: T): Promise<T[]>
  count      (filter?: BaseFilter): Promise<number>
  sum        (path: string, filter?: BaseFilter): Promise<number>
  average    (path: string, filter?: BaseFilter): Promise<number>
}
