import { BaseRule } from "../rule"

export class RuleArray implements BaseRule {
  public readonly name: string = 'array'

  public validate(value: any): boolean {
    return Array.isArray(value)
  }
}
