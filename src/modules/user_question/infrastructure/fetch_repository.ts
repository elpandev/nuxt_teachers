import { BACKEND_URL, ENV } from "~/src/config/env";
import { UserQuestion, type IUserQuestion } from "../domain/model";
import type { IUserQuestionRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

interface IUserQuestionPayload extends IUserQuestion {}

export class FetchUserQuestionRepository extends BaseFetchModelRepository<UserQuestion, IUserQuestionPayload> implements IUserQuestionRepository {
  public reference() { return `${BACKEND_URL[ENV]}/user_questions` }

  public fromPayload(payload: IUserQuestionPayload): UserQuestion {
    const model = new UserQuestion(payload)

    model.exists = true

    return model
  }

  public toPayload(model: UserQuestion): Partial<IUserQuestionPayload> {
    return model.toPayload()
  }
}
