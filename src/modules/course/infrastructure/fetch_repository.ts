import { BACKEND_URL, ENV } from "~/src/config/env";
import { Course, type ICourse } from "../domain/model";
import type { ICourseRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchCourseRepository extends BaseFetchModelRepository<Course, ICourse> implements ICourseRepository {
  public reference() { return `${BACKEND_URL[ENV]}/courses` }

  public fromPayload(data: any): Course {
    const model = new Course(data)

    model.exists = true

    return model
  }
}
