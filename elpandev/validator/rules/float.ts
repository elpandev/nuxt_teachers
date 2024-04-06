import { BaseRule } from "../rule"

export class RuleFloat implements BaseRule {
  public readonly name: string = 'float'

  public validate(value: any): boolean {
    return typeof value == 'number' && !Number.isSafeInteger(value)
  }
}
