import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Schedule } from "./model";
import { faker } from "@faker-js/faker";
import { DayEnum, ScheduleElement } from "./values/element";

export class ScheduleFactory extends BaseFactory<Schedule> {
  public generate(): Schedule {
    const schedule = new Schedule()

    for (const day of Object.values(DayEnum)) {
      for (let index = 0; index < faker.number.int({ min: 2, max: 6 }); index++) {
        const element = new ScheduleElement()
  
        element.day         = day
        element.start_at    = faker.number.int({ min: 6 + (index * 3), max: 8 + (index * 3) }) * 60
        element.end_at      = element.start_at + faker.number.int({ min: 2, max: 8 }) * 15
        element.course_name = faker.science.chemicalElement().name
  
        schedule.elements[element.id] = element
      }
    }

    return schedule
  }
}
