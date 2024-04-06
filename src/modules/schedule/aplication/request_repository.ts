import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { Schedule } from "../domain/model";
import type { IScheduleRepository } from "../domain/repository";

export class ScheduleRequestRepository extends BaseModelRequestRepository<Schedule, IScheduleRepository> {
  
}
