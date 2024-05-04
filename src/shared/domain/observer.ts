import { BaseEvent } from "~/elpandev/hexagonal/base/domain/event";
import { Observer } from "~/elpandev/hexagonal/module/domain/observer";
import type { AttendanceRegisterStatusEnum } from "~/src/modules/attendance/domain/values/register";
import type { Token } from "~/src/presentation/models/token";

export const observer = new Observer()

export class EventAuthRegister extends BaseEvent {
  constructor(public token: Token) {
    super()
  }
}

export class EventAuthLogin extends BaseEvent {
  constructor(public token: Token) {
    super()
  }
}

export class EventAuthLogout extends BaseEvent {}

export class EventAttendanceUpdateRegisterStatus extends BaseEvent {
  constructor(
    public course_id:   string|null,
    public student_id:  string,
    public prev_status: AttendanceRegisterStatusEnum,
    public status:      AttendanceRegisterStatusEnum,
  )
  { super() }
}
