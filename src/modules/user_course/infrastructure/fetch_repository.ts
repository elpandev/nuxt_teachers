import { BACKEND_URL, ENV } from "~/src/config/env";
import { UserCourse, type IUserCourse } from "../domain/model";
import type { IUserCourseRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

interface IUserCoursePayload extends IUserCourse {}

export class FetchUserCourseRepository extends BaseFetchModelRepository<UserCourse, IUserCoursePayload> implements IUserCourseRepository {
  public reference() { return `${BACKEND_URL[ENV]}/user_courses` }

  public fromPayload(payload: IUserCoursePayload): UserCourse {
    const model = new UserCourse(payload)

    model.exists = true

    return model
  }

  public toPayload(model: UserCourse): Partial<IUserCoursePayload> {
    return model.toPayload()
  }
}
