interface ISelectOption<T> {
  name:  string
  value: T
}

export class SelectOption<T = any> implements ISelectOption<T> {
  public name:  string = ''
  public value: T      = undefined as T

  constructor(data?: Partial<ISelectOption<T>>) {
    if (data) {
      if (data.name)  this.name  = data.name
      if (data.value) this.value = data.value
    }
  }
}
