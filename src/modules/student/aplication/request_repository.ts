import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { Student } from "../domain/model";
import type { IStudentRepository } from "../domain/repository";

export class StudentRequestRepository extends BaseModelRequestRepository<Student, IStudentRepository> {

}
