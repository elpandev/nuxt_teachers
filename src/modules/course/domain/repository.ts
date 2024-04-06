import type { IBaseModelRepository } from "~/elpandev/hexagonal/base/domain/repository";
import { Course } from "./model";
import type { Student } from "../../student/domain/model";

export interface ICourseRepository extends IBaseModelRepository<Course> {
  attach_student(course: Course, student: Student): Promise<void>
  detach_student(course: Course, student: Student): Promise<void>
}
