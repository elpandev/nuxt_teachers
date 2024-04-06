import type { IBaseModelRepository } from "~/elpandev/hexagonal/base/domain/repository";
import { Attendance } from "./model";

export interface IAttendanceRepository extends IBaseModelRepository<Attendance> {

}
