import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { UserGrade } from "../domain/model";
import type { IUserGradeRepository } from "../domain/repository";

export class UserGradeRequestRepository extends BaseModelRequestRepository<UserGrade, IUserGradeRepository> {

}
