import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { UserQuestion } from "../domain/model";
import type { IUserQuestionRepository } from "../domain/repository";

export class UserQuestionRequestRepository extends BaseModelRequestRepository<UserQuestion, IUserQuestionRepository> {

}
