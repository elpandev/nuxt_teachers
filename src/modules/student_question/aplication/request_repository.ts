import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { StudentQuestion } from "../domain/model";
import type { IStudentQuestionRepository } from "../domain/repository";
import { queue } from "~/src/config/queue";
import { QueueTask } from "~/elpandev/utils/helpers/queue";
import { user_task_request } from "~/src/config/repositories";
import { StudentQuestionFilter } from "../domain/filter";

export class StudentQuestionRequestRepository extends BaseModelRequestRepository<StudentQuestion, IStudentQuestionRepository> {
  public async store(model: StudentQuestion): Promise<void> {
    await super.store(model)

    queue.push(new QueueTask(async () => {
      const [student_task, points] = await Promise.all([
        user_task_request.get(`${model.student_id}_${model.task_id}`),
        this.sum(`points`, new StudentQuestionFilter({ task_id: model.task_id, student_id: model.student_id }))
      ])

      if (student_task) {
        student_task.points = points
  
        await user_task_request.store(student_task)
      }
    }))
  }
}
