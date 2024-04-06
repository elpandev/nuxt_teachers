import { BaseValue, type IBaseValue } from "~/elpandev/hexagonal/base/domain/value";
import { code_id } from "~/elpandev/utils";

export enum DayEnum {
  MONDAY    = 'MONDAY',
  TUESDAY   = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY  = 'THURSDAY',
  FRIDAY    = 'FRIDAY',
  SATURDAY  = 'SATURDAY',
  SUNDAY    = 'SUNDAY',
}

export interface IScheduleElement extends IBaseValue {
  id: string
  day: DayEnum
  start_at: number
  end_at: number
  course_id: string
  course_name: string
}

export class ScheduleElement extends BaseValue<IScheduleElement> implements IScheduleElement {
  public id:          string  = code_id('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890')
  public day:         DayEnum = DayEnum.MONDAY
  public start_at:    number  = 0
  public end_at:      number  = 0
  public course_id:   string  = ''
  public course_name: string  = ''

  constructor(data?: Partial<IScheduleElement>) {
    super()

    this.fromPayload(data)
  }

  public fromPayload(data?: Partial<IScheduleElement>): this {
    if (data) {
      if (data.id)          { this.id          = data.id }
      if (data.day)         { this.day         = data.day }
      if (data.start_at)    { this.start_at    = data.start_at }
      if (data.end_at)      { this.end_at      = data.end_at }
      if (data.course_id)   { this.course_id   = data.course_id }
      if (data.course_name) { this.course_name = data.course_name }
    }

    return this
  }

  public toPayload(): Partial<IScheduleElement> {
    const payload: Partial<IScheduleElement> = {}

    payload.id          = this.id
    payload.day         = this.day
    payload.start_at    = this.start_at
    payload.end_at      = this.end_at
    payload.course_id   = this.course_id
    payload.course_name = this.course_name

    return payload
  }
}
