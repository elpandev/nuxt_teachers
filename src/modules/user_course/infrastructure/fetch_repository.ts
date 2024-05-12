import { BACKEND_URL, ENV } from "~/src/config/env";
import { UserCourse, type IUserCourse } from "../domain/model";
import type { IUserCourseRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchUserCourseRepository extends BaseFetchModelRepository<UserCourse, IUserCourse> implements IUserCourseRepository {
  public reference() { return `${BACKEND_URL[ENV]}/user_courses` }

  public fromPayload(data: any): UserCourse {
    const model = new UserCourse(data)

    model.exists = true

    return model
  }
}
