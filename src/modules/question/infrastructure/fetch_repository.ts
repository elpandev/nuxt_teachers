import { BACKEND_URL, ENV } from "~/src/config/env";
import { Question, type IQuestion } from "../domain/model";
import type { IQuestionRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

interface IQuestionPayload extends IQuestion {}

export class FetchQuestionRepository extends BaseFetchModelRepository<Question, IQuestionPayload> implements IQuestionRepository {
  public reference() { return `${BACKEND_URL[ENV]}/questions` }

  public fromPayload(payload: IQuestionPayload): Question {
    const model = new Question(payload)

    model.exists = true

    return model
  }

  public toPayload(model: Question): Partial<IQuestionPayload> {
    return model.toPayload()
  }
}
