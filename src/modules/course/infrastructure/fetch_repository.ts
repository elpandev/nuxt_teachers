import { Course, type ICourse } from "../domain/model";
import type { ICourseRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchCourseRepository extends BaseFetchModelRepository<Course, ICourse> implements ICourseRepository {
  public reference() { return 'http://127.0.0.1:8787/courses' }

  public fromPayload(data: any): Course {
    const model = new Course(data)

    model.exists = true

    return model
  }
}
