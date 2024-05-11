import { BACKEND_URL, ENV } from "~/src/config/env";
import { UserGrade, type IUserGrade } from "../domain/model";
import type { IUserGradeRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchUserGradeRepository extends BaseFetchModelRepository<UserGrade, IUserGrade> implements IUserGradeRepository {
  public reference() { return `${BACKEND_URL[ENV]}/user_grades` }

  public fromPayload(data: any): UserGrade {
    const model = new UserGrade(data)

    model.exists = true

    return model
  }
}
