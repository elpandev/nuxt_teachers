import { BACKEND_URL, ENV } from "~/src/config/env";
import { UserTask, type IUserTask } from "../domain/model";
import type { IUserTaskRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

interface IUserTaskPayload extends IUserTask {}

export class FetchUserTaskRepository extends BaseFetchModelRepository<UserTask, IUserTaskPayload> implements IUserTaskRepository {
  public reference() { return `${BACKEND_URL[ENV]}/user_tasks` }

  public fromPayload(payload: IUserTaskPayload): UserTask {
    const model = new UserTask(payload)

    model.exists = true

    return model
  }

  public toPayload(model: UserTask): Partial<IUserTaskPayload> {
    return model.toPayload()
  }
}
