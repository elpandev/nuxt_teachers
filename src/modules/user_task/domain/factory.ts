import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { UserTask } from "./model";
import { faker } from "@faker-js/faker";
import { nano_id } from "~/elpandev/utils";

export class UserTaskFactory extends BaseFactory<UserTask> {
  constructor(public params: { task_id?: string, exists?: boolean } = {}) {
    super()
  }

  public generate(): UserTask {
    const user_task = new UserTask()

    user_task.start_at = faker.date.between({ from: new Date().toISOString(),                   to: new Date().addMinutes(60).toISOString() }).getTime()
    user_task.end_at   = faker.date.between({ from: new Date(user_task.start_at).toISOString(), to: new Date(user_task.start_at).addMinutes(60).toISOString() }).getTime()
    user_task.password = nano_id()
    user_task.points   = faker.number.int({ min: 0, max: 10 })

    if (typeof this.params.task_id == 'boolean') user_task.task_id = this.params.task_id
    if (typeof this.params.exists  == 'boolean') user_task.exists  = this.params.exists

    return user_task
  }
}
