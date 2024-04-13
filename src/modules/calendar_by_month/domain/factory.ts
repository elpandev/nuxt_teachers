import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { CalendarByMonth } from "./model";
import { faker } from "@faker-js/faker";
import { EventFactory } from "../../event/domain/factory";

export class CalendarByMonthFactory extends BaseFactory<CalendarByMonth> {
  public generate(): CalendarByMonth {
    const calendar_by_month = new CalendarByMonth()
    const now = new Date()

    calendar_by_month.id     = faker.date.recent({ refDate: now }).format('YYYY-MM')
    calendar_by_month.events = new Map()

    for (let i = 0; i < faker.number.int({ min: 4, max: 12 }); i++) {
      const date          = faker.date.recent({ refDate: now, days: 10 })
      const date_formated = date.format('YYYY-MM-DD')
      
      calendar_by_month.events.set(date_formated, new Map())

      for (let ii = 0; ii < faker.number.int({ min: 1, max: 4 }); ii++) {
        const event = new EventFactory().generate()

        calendar_by_month.events.get(date_formated)!.set(event.id, event)
      }
    }

    return calendar_by_month
  }
}
