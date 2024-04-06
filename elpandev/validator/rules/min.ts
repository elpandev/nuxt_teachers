import { BaseRule } from "../rule"
import { length } from "../methods/length";

export class RuleMin implements BaseRule {
  public readonly name: string = 'min'

  constructor(public readonly length: number) {}

  public validate(value: any): boolean {
    return length(value) >= this.length
  }
}
