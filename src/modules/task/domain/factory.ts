import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Task } from "./model";
import { faker } from "@faker-js/faker";

export class TaskFactory extends BaseFactory<Task> {
  public generate(): Task {
    const task = new Task()

    task.name        = faker.lorem.words({ min: 2, max: 6 })
    task.description = faker.lorem.sentence()
    task.start_at    = faker.date.between({ from: new Date().toISOString(),              to: new Date().addMinutes(60).toISOString() }).getTime()
    task.end_at      = faker.date.between({ from: new Date(task.start_at).toISOString(), to: new Date(task.start_at).addMinutes(60).toISOString() }).getTime()

    return task
  }
}
