import { BACKEND_URL, ENV } from "~/src/config/env";
import { Question, type IQuestion } from "../domain/model";
import type { IQuestionRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchQuestionRepository extends BaseFetchModelRepository<Question, IQuestion> implements IQuestionRepository {
  public reference() { return `${BACKEND_URL[ENV]}/questions` }

  public fromPayload(data: any): Question {
    const model = new Question(data)

    model.exists = true

    return model
  }
}
