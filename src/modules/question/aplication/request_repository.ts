import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { Question } from "../domain/model";
import type { IQuestionRepository } from "../domain/repository";

export class QuestionRequestRepository extends BaseModelRequestRepository<Question, IQuestionRepository> {
  
}
