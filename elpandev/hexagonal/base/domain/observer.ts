import { BaseEvent } from "./event"

export abstract class BaseObserver {
  private listeners: { [key: string]: ((event: any) => void)[] } = {}

  private ensure_name(name: string) {
    if (this.listeners[name] == undefined) {
      this.listeners[name] = []
    }
  }

  public listen<T extends BaseEvent>(key: new (...args: any[]) => T, listener: (event: T) => void) {
    this.ensure_name(key.name)

    this.listeners[key.name].push(listener)
  }

  public once<T extends BaseEvent>(key: new (...args: any[]) => T, listener: (event: T) => void) {
    const method = (event: T) => {
      listener(event)
      this.remove(key, method)
    }

    this.listen(key, method)
  }

  public remove<T extends BaseEvent>(key: new (...args: any[]) => T, listener: (event: any) => void) {
    this.ensure_name(key.name)

    this.listeners[key.name].remove(listener)
  }

  public async notify<T extends BaseEvent>(event: T) {
    for (const listener of this.listeners[event.constructor.name] ?? []) {
      listener(event)
    }
  }
}
