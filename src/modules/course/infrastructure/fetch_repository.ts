import { BACKEND_URL, ENV } from "~/src/config/env";
import { Course, type ICourse } from "../domain/model";
import type { ICourseRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

interface ICoursePayload extends ICourse {}

export class FetchCourseRepository extends BaseFetchModelRepository<Course, ICoursePayload> implements ICourseRepository {
  public reference() { return `${BACKEND_URL[ENV]}/courses` }

  public fromPayload(payload: ICoursePayload): Course {
    const model = new Course(payload)

    model.exists = true

    return model
  }

  public toPayload(model: Course): Partial<ICoursePayload> {
    return model.toPayload()
  }
}
