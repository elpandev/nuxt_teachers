import { nano_id } from "~/elpandev/utils"

interface ISelectOption<T> {
  id:    string
  name:  string
  value: T
}

export class SelectOption<T = any> implements ISelectOption<T> {
  public id:    string = nano_id()
  public name:  string = ''
  public value: T      = undefined as T

  constructor(data?: Partial<ISelectOption<T>>) {
    if (data) {
      if (data.id)    this.id    = data.id
      if (data.name)  this.name  = data.name
      if (data.value) this.value = data.value
    }
  }
}
