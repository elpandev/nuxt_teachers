import { BaseRule } from "../rule"

export class RuleRequired implements BaseRule {
  public readonly name: string = 'required'

  public validate(value: any): boolean {
    return ![null, undefined].includes(value)
  }
}
