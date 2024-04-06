import { BaseRule } from "../rule"

export class RuleInteger implements BaseRule {
  public readonly name: string = 'integer'

  public validate(value: any): boolean {
    return Number.isSafeInteger(value)
  }
}
