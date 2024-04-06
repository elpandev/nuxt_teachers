import { BaseRule, type RuleName } from "./rule";

interface IValidate<T extends boolean = any> {
  errors: T extends true ? string : string[]
  validated: boolean
}

interface IValidateConstructor<T extends boolean = any> {
  bail?:    T,
  value:    any,
  rules:    BaseRule[],
  messages?: Partial<{ [key in RuleName]: string }>,
}

export class Validate<T extends boolean = any> implements IValidate<T> {
  public errors: T extends true ? string : string[] = [] as any
  public validated: boolean

  constructor(private readonly data: IValidateConstructor<T>) {
    for (const rule of this.data.rules) {
      if (!rule.validate(this.data.value)) {
        const error = (this.data.messages as any)?.[rule.name] ?? rule.name

        if (this.data.bail) { this.errors = error; break; }

        (this.errors as Array<any>).push(error)
      }
    }
    
    this.validated = this.errors.length == 0
  }
}

export default Validate