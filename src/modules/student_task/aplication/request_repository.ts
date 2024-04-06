import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { StudentTask } from "../domain/model";
import type { IStudentTaskRepository } from "../domain/repository";

export class StudentTaskRequestRepository extends BaseModelRequestRepository<StudentTask, IStudentTaskRepository> {
  public store(model: StudentTask): Promise<void> {
    model.id = `${model.student.id}_${model.task.id}`

    return super.store(model)
  }
}
