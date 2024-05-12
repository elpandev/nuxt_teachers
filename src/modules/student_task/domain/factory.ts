import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { UserTask } from "./model";
import { faker } from "@faker-js/faker";
import { nano_id } from "~/elpandev/utils";

export class UserTaskFactory extends BaseFactory<UserTask> {
  public generate(): UserTask {
    const user_task = new UserTask()

    user_task.start_at = faker.date.between({ from: new Date().toISOString(),                   to: new Date().addMinutes(60).toISOString() }).getTime()
    user_task.end_at   = faker.date.between({ from: new Date(user_task.start_at).toISOString(), to: new Date(user_task.start_at).addMinutes(60).toISOString() }).getTime()
    user_task.password = nano_id()
    user_task.points   = faker.number.int({ min: 0, max: 10 })

    return user_task
  }
}
