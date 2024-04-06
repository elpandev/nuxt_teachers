import type { IBaseModelRepository } from "~/elpandev/hexagonal/base/domain/repository";
import { Student } from "./model";

export interface IStudentRepository extends IBaseModelRepository<Student> {

}
