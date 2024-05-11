import { Grade, type IGrade } from "../domain/model";
import type { IGradeRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchGradeRepository extends BaseFetchModelRepository<Grade, IGrade> implements IGradeRepository {
  public reference() { return 'http://127.0.0.1:8787/grades' }

  public fromPayload(data: any): Grade {
    const model = new Grade(data)

    model.exists = true

    return model
  }
}
