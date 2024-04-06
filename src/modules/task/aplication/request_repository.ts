import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { Task } from "../domain/model";
import type { ITaskRepository } from "../domain/repository";
import { auth } from "~/src/presentation/states/auth";

export class TaskRequestRepository extends BaseModelRequestRepository<Task, ITaskRepository> {
  public store(model: Task): Promise<void> {
    model.user = auth.user

    return super.store(model)
  }
}
