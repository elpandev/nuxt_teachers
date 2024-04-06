import { RuleArray } from "./rules/array"
import { RuleFloat } from "./rules/float"
import { RuleInteger } from "./rules/integer"
import { RuleMin } from "./rules/min"
import { RuleRequired } from "./rules/required"
import { RuleString } from "./rules/string"

export type RuleName =
  `accepted_if`|
  `accepted`|
  `active_url`|
  `after_or_equal`|
  `after`|
  `alpha_dash`|
  `alpha_num`|
  `alpha`|
  `array`|
  `bail`|
  `before_or_equal`|
  `before`|
  `boolean`|
  `confirmed`|
  `current_password`|
  `date_equals`|
  `date_format`|
  `date`|
  `different`|
  `digits_between`|
  `digits`|
  `dimensions`|
  `distinct`|
  `email`|
  `ends_with`|
  `exclude_if`|
  `exclude_unless`|
  `exists`|
  `file`|
  `filled`|
  `gt`|
  `gte`|
  `image`|
  `in_array`|
  `in`|
  `integer`|
  `ip`|
  `ipv4`|
  `ipv6`|
  `json`|
  `length`|
  `lt`|
  `lte`|
  `max`|
  `mime_types}`|
  `mimes`|
  `min`|
  `number`|
  `present`|
  `prohibited_if`|
  `prohibited_unless`|
  `prohibited`|
  `regex`|
  `required_if`|
  `required_unless`|
  `required_with_all`|
  `required_with`|
  `required_without_all`|
  `required_without`|
  `required`|
  `same`|
  `size`|
  `sometimes`|
  `starts_with`|
  `string`|
  `timezone`|
  `unique`|
  `url`|
  `uuid`

export abstract class BaseRule {
  abstract name: string
  abstract validate(value: any): boolean
}

export function required()         { return new RuleRequired() }
export function string()           { return new RuleString() }
export function float()            { return new RuleFloat() }
export function integer()          { return new RuleInteger() }
export function min(value: number) { return new RuleMin(value) }
export function array()            { return new RuleArray() }