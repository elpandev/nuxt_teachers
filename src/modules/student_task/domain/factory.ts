import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { StudentTask } from "./model";
import { faker } from "@faker-js/faker";
import { nano_id } from "~/elpandev/utils";

export class StudentTaskFactory extends BaseFactory<StudentTask> {
  public generate(): StudentTask {
    const student_task = new StudentTask()

    student_task.start_at = faker.date.between({ from: new Date().toISOString(),                   to: new Date().addMinutes(60).toISOString() }).getTime()
    student_task.end_at   = faker.date.between({ from: new Date(student_task.start_at).toISOString(), to: new Date(student_task.start_at).addMinutes(60).toISOString() }).getTime()
    student_task.password = nano_id()
    student_task.points   = faker.number.int({ min: 0, max: 10 })

    return student_task
  }
}
