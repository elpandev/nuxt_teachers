import { BaseRule } from "../rule"

export class RuleString implements BaseRule {
  public readonly name: string = 'string'

  public validate(value: any): boolean {
    return typeof value == 'string'
  }
}
