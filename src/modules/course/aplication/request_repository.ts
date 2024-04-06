import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { Course } from "../domain/model";
import type { ICourseRepository } from "../domain/repository";
import type { Student } from "../../student/domain/model";

export class CourseRequestRepository extends BaseModelRequestRepository<Course, ICourseRepository> {
  public async attach_student(course: Course, student: Student): Promise<void> {
    return this.repository.attach_student(course, student)
  }

  public async detach_student(course: Course, student: Student): Promise<void> {
    return this.repository.detach_student(course, student)
  }
}
