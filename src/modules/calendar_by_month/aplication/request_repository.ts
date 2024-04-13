import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { CalendarByMonth } from "../domain/model";
import type { ICalendarByMonthRepository } from "../domain/repository";

export class CalendarByMonthRequestRepository extends BaseModelRequestRepository<CalendarByMonth, ICalendarByMonthRepository> {

}
