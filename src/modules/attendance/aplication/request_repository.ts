
import { Attendance } from "../domain/model";
import type { IAttendanceRepository } from "../domain/repository";
import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";

export class AttendanceRequestRepository extends BaseModelRequestRepository<Attendance, IAttendanceRepository> {

}
