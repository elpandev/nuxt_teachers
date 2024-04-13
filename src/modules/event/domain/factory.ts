import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Event, EventTypeEnum } from "./model";
import { faker } from "@faker-js/faker";

export class EventFactory extends BaseFactory<Event> {
  public generate(): Event {
    const event = new Event()

    event.type        = faker.helpers.arrayElement(Object.values(EventTypeEnum))
    event.name        = faker.person.jobArea()
    event.description = faker.lorem.sentence()

    return event
  }
}
