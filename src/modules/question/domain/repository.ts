import type { IBaseModelRepository } from "~/elpandev/hexagonal/base/domain/repository";
import { Question } from "./model";

export interface IQuestionRepository extends IBaseModelRepository<Question> {

}
