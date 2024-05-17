import { BACKEND_URL, ENV } from "~/src/config/env";
import { UserGrade, type IUserGrade } from "../domain/model";
import type { IUserGradeRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

interface IUserGradePayload extends IUserGrade {}

export class FetchUserGradeRepository extends BaseFetchModelRepository<UserGrade, IUserGradePayload> implements IUserGradeRepository {
  public reference() { return `${BACKEND_URL[ENV]}/user_grades` }

  public fromPayload(payload: IUserGradePayload): UserGrade {
    const model = new UserGrade(payload)

    model.exists = true

    return model
  }

  public toPayload(model: UserGrade): Partial<IUserGradePayload> {
    return model.toPayload()
  }
}
