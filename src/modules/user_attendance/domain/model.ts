import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";

export enum UserAttendanceStatusEnum {
  PRESENT  = 'PRESENT',
  LATE     = 'LATE',
  ABSENT   = 'ABSENT',
  EXPELLED = 'EXPELLED',
}

export const user_attendace_status_locale: Record<UserAttendanceStatusEnum, string> = {
  [UserAttendanceStatusEnum.PRESENT]:  'Presente',
  [UserAttendanceStatusEnum.LATE]:     'Tarde',
  [UserAttendanceStatusEnum.ABSENT]:   'Ausente',
  [UserAttendanceStatusEnum.EXPELLED]: 'Explusado',
}

export interface IUserAttendance extends IBaseModel {
  user_id:       string
  user_name:     string
  attendance_id: string
  course_id:     string|null
  course_name:   string|null
  category_id:   string|null
  category_name: string|null
  comment:       string
  status:        UserAttendanceStatusEnum
}

export class UserAttendance extends BaseModel<IUserAttendance> {
  public get id() { return `${this.user_id}_${this.attendance_id}` }

  public user_id:       string      = '';
  public user_name:     string      = '';
  public attendance_id: string      = '';
  public course_id:     string|null = '';
  public course_name:   string|null = '';
  public category_id:   string|null = '';
  public category_name: string|null = '';
  public comment:       string      = '';
  public status:        UserAttendanceStatusEnum = UserAttendanceStatusEnum.PRESENT;

  constructor(data?: Partial<IUserAttendance>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      payload: {
        user_id:   this.user_id,
        attendance_id: this.attendance_id,
      },
      rules: {
        user_id:       [required(), string()],
        attendance_id: [required(), string(), min(6)],
      },
    })
  }

  public fromPayload(data?: Partial<IUserAttendance>): this {
    if (data) {
      if (data.user_id       !== undefined) this.user_id       = data.user_id
      if (data.user_name     !== undefined) this.user_name     = data.user_name
      if (data.attendance_id !== undefined) this.attendance_id = data.attendance_id
      if (data.course_id     !== undefined) this.course_id     = data.course_id
      if (data.course_name   !== undefined) this.course_name   = data.course_name
      if (data.category_id   !== undefined) this.category_id   = data.category_id
      if (data.category_name !== undefined) this.category_name = data.category_name
      if (data.comment       !== undefined) this.comment       = data.comment
      if (data.status        !== undefined) this.status        = data.status
    }

    return this
  }

  public toPayload(): Partial<IUserAttendance> {
    return {
      user_id:       this.user_id,
      user_name:     this.user_name,
      attendance_id: this.attendance_id,
      course_id:     this.course_id,
      course_name:   this.course_name,
      category_id:   this.category_id,
      category_name: this.category_name,
      comment:       this.comment,
      status:        this.status,
    }
  }

  public get is_present():  boolean { return this.status == UserAttendanceStatusEnum.PRESENT }
  public get is_late():     boolean { return this.status == UserAttendanceStatusEnum.LATE }
  public get is_expelled(): boolean { return this.status == UserAttendanceStatusEnum.EXPELLED }
  public get is_absent():   boolean { return this.status == UserAttendanceStatusEnum.ABSENT }
}
