import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { UserAttendance } from "../domain/model";
import type { IUserAttendanceRepository } from "../domain/repository";

export class UserAttendanceRequestRepository extends BaseModelRequestRepository<UserAttendance, IUserAttendanceRepository> {

}
