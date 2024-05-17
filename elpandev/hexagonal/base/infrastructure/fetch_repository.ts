import type { IBaseModelRepository } from "../domain/repository";
import type { BaseModel } from "../domain/model";
import { BaseFilter } from "../domain/filter";


export abstract class BaseFetchModelRepository<T extends BaseModel, U> implements IBaseModelRepository<T> {
  abstract reference(): string

  abstract fromPayload(payload: Partial<U>): T
  abstract toPayload(model: T): Partial<U>

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
      body: JSON.stringify(this.toPayload(model)),
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
    const params = filter.toParams()
    const cursor = last?.cursor(filter.order?.path)

    if (cursor) params.set('cursor', cursor)

    const response = await fetch(`${this.reference()}?${params}`, { method: 'GET' })
    const data     = await response.json() as any

    return data.results.map((e: any) => this.fromPayload(e))
  }

  public async count(filter?: BaseFilter): Promise<Record<string, number>> {
    const response = await fetch(`${this.reference()}/count?${filter?.toParams()}`, { method: 'GET' })
    const data     = await response.json() as any

    if (Array.isArray(data)) {
      return data.reduce((elements, value) => Object.assign(elements, value.results[0]), {})
    }

    return data.results[0].count
  }

  public async sum(path: string, filter?: BaseFilter): Promise<number> {
    return 1
  }

  public async average(path: string, filter?: BaseFilter): Promise<number> {
    return 1
  }
}
