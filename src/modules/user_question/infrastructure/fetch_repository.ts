import { BACKEND_URL, ENV } from "~/src/config/env";
import { UserQuestion, type IUserQuestion } from "../domain/model";
import type { IUserQuestionRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchUserQuestionRepository extends BaseFetchModelRepository<UserQuestion, IUserQuestion> implements IUserQuestionRepository {
  public reference() { return `${BACKEND_URL[ENV]}/user_questions` }

  public fromPayload(data: any): UserQuestion {
    const model = new UserQuestion(data)

    model.exists = true

    return model
  }
}
