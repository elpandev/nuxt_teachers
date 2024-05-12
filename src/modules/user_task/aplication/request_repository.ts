import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { UserTask } from "../domain/model";
import type { IUserTaskRepository } from "../domain/repository";

export class UserTaskRequestRepository extends BaseModelRequestRepository<UserTask, IUserTaskRepository> {
  
}
