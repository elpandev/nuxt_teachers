import { UserCourse, type IUserCourse } from "../domain/model";
import type { IUserCourseRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchUserCourseRepository extends BaseFetchModelRepository<UserCourse, IUserCourse> implements IUserCourseRepository {
  public reference() { return 'http://127.0.0.1:8787/user_course' }

  public fromPayload(data: any): UserCourse {
    const model = new UserCourse(data)

    model.exists = true

    return model
  }
}
