import { BACKEND_URL, ENV } from "~/src/config/env";
import { UserTask, type IUserTask } from "../domain/model";
import type { IUserTaskRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchUserTaskRepository extends BaseFetchModelRepository<UserTask, IUserTask> implements IUserTaskRepository {
  public reference() { return `${BACKEND_URL[ENV]}/user_tasks` }

  public fromPayload(data: any): UserTask {
    const model = new UserTask(data)

    model.exists = true

    return model
  }
}
