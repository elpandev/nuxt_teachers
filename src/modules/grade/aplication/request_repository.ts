import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { Grade } from "../domain/model";
import type { IGradeRepository } from "../domain/repository";

export class GradeRequestRepository extends BaseModelRequestRepository<Grade, IGradeRepository> {

}
