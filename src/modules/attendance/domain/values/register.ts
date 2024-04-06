// import { BaseValue, type IBaseValue } from "~/elpandev/hexagonal/base/domain/value";
import { Student } from "~/src/modules/student/domain/model";
import type { Validator } from "@/elpandev/validator";
import type { ISelectOption } from "~/src/presentation/interfaces/select_option";
import { BaseValue, type IBaseValue } from "~/elpandev/hexagonal/base/domain/value";

export enum AttendanceRegisterStatusEnum {
  PRESENT  = 'PRESENT',
  LATE     = 'LATE',
  ABSENT   = 'ABSENT',
  EXPELLED = 'EXPELLED',
}

export interface IAttendanceRegister extends IBaseValue {
  id:      string
  name:    string
  comment: string
  status:  AttendanceRegisterStatusEnum
}

export function attendance_register_status_locale(status: AttendanceRegisterStatusEnum): string {
  switch (status) {
    case AttendanceRegisterStatusEnum.PRESENT:  return 'Presente';
    case AttendanceRegisterStatusEnum.LATE:     return 'Tarde';
    case AttendanceRegisterStatusEnum.ABSENT:   return 'Ausente';
    case AttendanceRegisterStatusEnum.EXPELLED: return 'Explusado';
  
    default: return 'Desconocido';
  }
}

export const attendance_register_status_options: ISelectOption[] = Object.values(AttendanceRegisterStatusEnum)
  .map(value => ({ key: value, name: attendance_register_status_locale(value), value }))

export class AttendanceRegister extends BaseValue<IAttendanceRegister> implements IAttendanceRegister {
  public id:      string   = ''
  public name:    string   = ''
  public comment: string   = ''
  public status:  AttendanceRegisterStatusEnum = AttendanceRegisterStatusEnum.PRESENT

  constructor(data?: Partial<IAttendanceRegister>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator<any, any> {
    throw new Error("Method not implemented.");
  }

  public fromPayload(data?: Partial<IAttendanceRegister> | undefined): this {
    if (data) {
      if (data.id)      { this.id      = data.id }
      if (data.name)    { this.name    = data.name }
      if (data.comment) { this.comment = data.comment }
      if (data.status)  { this.status  = data.status }
    }

    return this
  }

  public toPayload(): Partial<IAttendanceRegister> {
    const payload: Partial<IAttendanceRegister> = {}

    payload.id      = this.id
    payload.name    = this.name
    payload.comment = this.comment
    payload.status  = this.status

    return payload
  }

  public fromStudent(student: Student): this {
    this.id   = student.id
    this.name = student.name

    return this
  }

  public toStudent(): Student {
    const student = new Student()

    student.id   = this.id
    student.name = this.name

    return student
  }
}
