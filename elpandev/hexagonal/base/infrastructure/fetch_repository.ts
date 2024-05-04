import type { IBaseModelRepository } from "../domain/repository";
import type { BaseModel, IBaseModel } from "../domain/model";
import { BaseFilter } from "../domain/filter";


export abstract class BaseFetchModelRepository<T extends BaseModel, U extends IBaseModel> implements IBaseModelRepository<T> {
  abstract reference(): string

  abstract fromPayload(data: any): T

  public toPayload(model: T): Partial<U> {
    const payload = model.toPayload()

    delete payload.id

    return payload
  }

  public async get(id: string): Promise<T|undefined> {
    const response = await fetch(`${this.reference()}/${id}`, { method: 'GET' })
    const data     = await response.json()

    return response.status === 404
      ? undefined
      : this.fromPayload(data.results[0])
  }

  public async store(model: T): Promise<void> {
    await fetch(`${this.reference()}`, {
      method: 'POST',
      body: JSON.stringify(model.toPayload()),
    })
  }

  public async update(id: string, payload: Record<string, any>): Promise<void> {
    await fetch(`${this.reference()}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  public async destroy(id: string): Promise<void> {
    await fetch(`${this.reference()}/${id}`, { method: 'DELETE' })
  }

  public async paginate(filter: BaseFilter, last?: T): Promise<T[]> {
    const response = await fetch(`${this.reference()}?${filter?.toParams()}`, { method: 'GET' })
    const data     = await response.json() as any

    return data.results.map((e: any) => this.fromPayload(e))
  }

  public async count(filter?: BaseFilter): Promise<number> {
    return 1
  }

  public async sum(path: string, filter?: BaseFilter): Promise<number> {
    return 1
  }

  public async average(path: string, filter?: BaseFilter): Promise<number> {
    return 1
  }
}
