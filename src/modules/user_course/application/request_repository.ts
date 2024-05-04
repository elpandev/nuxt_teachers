import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { UserCourse } from "../domain/model";
import type { IUserCourseRepository } from "../domain/repository";

export class UserCourseRequestRepository extends BaseModelRequestRepository<UserCourse, IUserCourseRepository> {

}
