import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { UserTask } from "../domain/model";
import type { IUserTaskRepository } from "../domain/repository";

export class UserTaskRequestRepository extends BaseModelRequestRepository<UserTask, IUserTaskRepository> {
  public store(model: UserTask): Promise<void> {
    model.id = `${model.user.id}_${model.task.id}`

    return super.store(model)
  }
}
