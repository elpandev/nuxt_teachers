import { get_value_by_path } from "@/elpandev/utils";
import { BaseFilter, QuerySearch, QueryWhere } from "../domain/filter";
import { BaseModel } from "../domain/model";
import type { IBaseModelRepository } from "../domain/repository";

function validate(element: Record<string, any>, filter?: BaseFilter): boolean {
  try {
    const results: boolean[] = []

    for (const query of filter?.queries() ?? []) {
      if (query instanceof QueryWhere) {
        const value = get_value_by_path(element, query.path)

        switch (query.operator) {
          case '==': results.push(value == (query.value as any)); break
          case '!=': results.push(value != (query.value as any)); break
          case '>=': results.push(value >= (query.value as any)); break
          case '<=': results.push(value <= (query.value as any)); break
          case '>':  results.push(value >  (query.value as any)); break
          case '<':  results.push(value <  (query.value as any)); break

          case 'array-contains': results.push((value as any[]).includes(query.value)); break

          default: break;
        }
      }

      if (query instanceof QuerySearch) {
        const value = get_value_by_path(element, query.path)

        results.push(
          (value as string)
            .removeAccents()
            .toLowerCase()
            .includes(
              (query.value as string)
                .removeAccents()
                .toLowerCase()
            )
        )
      }
    }

    return results.every(result => result)
  }
  
  catch (error) {}

  return true
}

export abstract class BaseLocalModelRepository<T extends BaseModel> implements IBaseModelRepository<T> {
  abstract reference(): string
  abstract fromLocal(payload: Record<string, any>): T
  abstract toLocal(model: T): Record<string, any>

  public async get(id: string): Promise<T | undefined> {
    await Promise.delay(300)

    const payload = JSON.parse(localStorage.getItem(this.reference()) ?? '{}') as Record<string, any>
    
    if (payload[id] == undefined) { return undefined }
    
    return this.fromLocal(payload[id])
  }

  public async store(model: T): Promise<void> {
    await Promise.delay(300)

    const payload = JSON.parse(localStorage.getItem(this.reference()) ?? '{}') as Record<string, any>
    
    payload[model.id] = this.toLocal(model)

    localStorage.setItem(this.reference(), JSON.stringify(payload))
  }

  public async destroy(id: string): Promise<void> {
    await Promise.delay(300)

    const payload = JSON.parse(localStorage.getItem(this.reference()) ?? '{}') as Record<string, any>
    
    delete payload[id]

    localStorage.setItem(this.reference(), JSON.stringify(payload))
  }

  public async paginate(filter?: BaseFilter, last?: T): Promise<T[]> {
    await Promise.delay(300)

    const item     = localStorage.getItem(this.reference()) ?? '{}'
    const payload  = JSON.parse(item) as Record<string, any>
    const elements = Object.values(payload).filter(element => validate(element, filter))

    if (last) {
      const index = elements.findIndex(element => get_value_by_path(element, 'id') == get_value_by_path(last, 'id'))

      if (index >= 0) {
        return elements
          .slice(index, filter?.limit)
          .map(e => this.fromLocal(e))
      }
  
    }

    return elements.map(e => this.fromLocal(e))
  }

  public async count(filter?: BaseFilter): Promise<number> {
    await Promise.delay(300)

    const item    = localStorage.getItem(this.reference()) ?? ''
    const payload = JSON.parse(item) as Record<string, any>
    const elements = Object.values(payload).filter(element => validate(element, filter))

    return elements.length
  }

  public async sum(path: string, filter?: BaseFilter): Promise<number> {
    await Promise.delay(300)

    const item    = localStorage.getItem(this.reference()) ?? ''
    const payload = JSON.parse(item) as Record<string, any>
    const elements = Object.values(payload).filter(element => validate(element, filter))

    return elements.reduce((sum, element) => sum + (get_value_by_path(element, path) ?? 0), 0)
  }

  public async average(path: string, filter?: BaseFilter): Promise<number> {
    await Promise.delay(300)

    const item    = localStorage.getItem(this.reference()) ?? ''
    const payload = JSON.parse(item) as Record<string, any>
    const elements = Object.values(payload).filter(element => validate(element, filter))
    const sum      = elements.reduce((sum, element) => sum + (get_value_by_path(element, path) ?? 0), 0)

    return sum/elements.length
  }
}
