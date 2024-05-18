import { BACKEND_URL, ENV } from "~/src/config/env";
import { Task, type ITask } from "../domain/model";
import type { ITaskRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

interface ITaskPayload extends ITask {}

export class FetchTaskRepository extends BaseFetchModelRepository<Task, ITaskPayload> implements ITaskRepository {
  public reference() { return `${BACKEND_URL[ENV]}/tasks` }

  public fromPayload(payload: ITaskPayload): Task {
    const model = new Task(payload)

    model.exists = true

    return model
  }

  public toPayload(model: Task): Partial<ITaskPayload> {
    return model.toPayload()
  }
}
