import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { Course } from "../domain/model";
import type { ICourseRepository } from "../domain/repository";

export class CourseRequestRepository extends BaseModelRequestRepository<Course, ICourseRepository> {

}
