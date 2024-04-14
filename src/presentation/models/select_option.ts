import { nano_id } from "~/elpandev/utils"

interface ISelectOption<T> {
  id?:   string
  name?: string
  value: T
}

export class SelectOption<T = any> {
  public id:    string = nano_id()
  public name:  string = ''
  public value: T      = undefined as T

  constructor(data: ISelectOption<T>) {
    if (data.id    !== undefined) this.id    = data.id
    if (data.name  !== undefined) this.name  = data.name
    if (data.value !== undefined) this.value = data.value
  }
}

export const select_option_undefined = new SelectOption({ id: 'undefined', value: undefined })
export const select_option_null      = new SelectOption({ id: 'null', name: 'Ninguno', value: null })
