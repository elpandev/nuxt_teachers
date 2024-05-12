import { BaseFilter } from "../domain/filter";
import { BaseModel } from "../domain/model";
import type { IBaseModelRepository } from "../domain/repository";

export abstract class BaseModelRequestRepository<T extends BaseModel, U extends IBaseModelRepository<T>> {
  constructor(public repository: U) {}

  public async get    (id: string) { return this.repository.get(id) }
  public async destroy(id: string) { return this.repository.destroy(id) }
  public async update (id: string, payload: Record<string, any>) { return this.repository.update(id, payload) }
  public async count  (filter?: BaseFilter) { return this.repository.count(filter) }
  
  public async paginate(filter?: BaseFilter, cursor?: string) { return this.repository.paginate(filter, cursor) }

  public async sum    (path: string, filter?: BaseFilter) { return this.repository.sum(path, filter) }
  public async average(path: string, filter?: BaseFilter) { return this.repository.average(path, filter) }

  public async store(model: T) {
    const validator = model.validate()
  
    if (!validator.validated) { throw validator }
  
    return this.repository.store(model)
  }
}
