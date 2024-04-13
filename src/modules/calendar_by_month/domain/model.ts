import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import type { ISelectOption } from "~/src/presentation/interfaces/select_option";
import { Event, type IEvent } from "../../event/domain/model";


export interface ICalendarByMonth extends IBaseModel  {
  events: Record<string, Record<string, Partial<IEvent>>>
}

export class CalendarByMonth extends BaseModel<ICalendarByMonth> {
  public id     = new Date().format('YYYY-MM')
  public events: Map<string, Map<string, Event>> = new Map<string, Map<string, Event>>()

  constructor(data?: Partial<ICalendarByMonth>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      bail: true,
      payload: {
        id:   this.id,
      },
      rules: {
        id:   [required(), string()],
      },
    })
  }

  public fromPayload(data?: Partial<ICalendarByMonth>): this {
    if (data) {
      if (data.id) this.id = data.id

      if (data.events) {
        this.events.clear()

        for (const [key, record] of Object.entries(data.events)) {
          const map = new Map()

          for (const [id, payload] of Object.entries(record)) {
            map.set(id, new Event(payload))
          }

          this.events.set(key, map)
        }
      }
    }

    return this
  }

  public toPayload(): Partial<ICalendarByMonth> {
    const payload: Partial<ICalendarByMonth> = {}

    payload.id = this.id
    payload.events = {}

    for (const [key, map] of this.events.entries()) {
      payload.events[key] = {}

      for (const [id, event] of map) {
        payload.events[key][id] = event.toPayload()
      }
    }

    return payload
  }

  public get date(): Date {
    const [year, month] = this.id.split('-').map(e => parseInt(e))

    return new Date().replace({ year, month })
  }

  public get dates(): Date[] {
    const dates: Date[] = []
    const first_date = this.date.firstDateMonth().firstDateWeek()
  
    for (let index = -1; index < 34; index++) {
      dates.push(first_date.addDays(index))
    }
  
    return dates
  }
}
