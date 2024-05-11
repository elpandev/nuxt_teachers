import { BACKEND_URL, ENV } from "~/src/config/env";
import { Task, type ITask } from "../domain/model";
import type { ITaskRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchTaskRepository extends BaseFetchModelRepository<Task, ITask> implements ITaskRepository {
  public reference() { return `${BACKEND_URL[ENV]}/tasks` }

  public fromPayload(data: any): Task {
    const model = new Task(data)

    model.exists = true

    return model
  }
}
