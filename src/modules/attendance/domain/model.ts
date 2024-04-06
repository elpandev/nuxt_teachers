import { Validator, required, string, min } from "@/elpandev/validator";
import { AttendanceRegister, AttendanceRegisterStatusEnum } from "./values/register";
import { Course } from "../../course/domain/model";
import type { IAttendanceRegister } from "./values/register";
import type { ICourse } from "../../course/domain/model";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { ErrorMessage } from "~/elpandev/hexagonal/module/domain/error";
import { code_id } from "~/elpandev/utils";
import { Category } from "../../category/domain/model";

export interface IAttendance extends IBaseModel {
  name:        string
  description: string
  date_at:     number
  category:    Partial<ICourse>|null
  course:      Partial<ICourse>|null
  registers:   Record<string, Partial<IAttendanceRegister>>
}

export class Attendance extends BaseModel<IAttendance> implements IAttendance {
  public id:          string        = code_id('yeR2GMIt6E89qKgCYrzvU1O4BTVNuXZWLpAjSslQJ35omchF0knadPibxHw7D');
  public name:        string        = '';
  public description: string        = '';
  public date_at:     number        = Date.now();
  public category:    Category|null = null;
  public course:      Course|null   = null;
  public registers:   Record<string, AttendanceRegister> = {};

  constructor(data?: Partial<IAttendance>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      bail: true,
      payload: {
        id:   this.id,
        name: this.name,
      },
      rules: {
        id:   [required(), string()],
        name: [required(), string(), min(4)],
      },
    })
  }

  public fromPayload(data?: Partial<IAttendance>): this {
    if (data) {
      if (data.id          != undefined) this.id          = data.id
      if (data.name        != undefined) this.name        = data.name
      if (data.description != undefined) this.description = data.description
      if (data.date_at     != undefined) this.date_at     = data.date_at
      if (data.category    != undefined) this.category    = new Category().fromPayload(data.category)
      if (data.course      != undefined) this.course      = new Course().fromPayload(data.course)

      if (data.registers) {
        this.registers = Object
          .entries(data.registers)
          .reduce((payload, [key, value]) => Object.assign(payload, { [key]: new AttendanceRegister({ id: key, ...value }) }), {})
      }
    }

    return this
  }

  public toPayload(): Partial<IAttendance> {
    const payload: Partial<IAttendance> = {}

    payload.id          = this.id
    payload.name        = this.name
    payload.description = this.description
    payload.date_at     = this.date_at
    payload.category    = this.category ? this.category?.toAttendanceRelation() : null
    payload.course      = this.course   ? this.course?.toAttendanceRelation()   : null

    payload.registers = Object.entries(this.registers)
      .reduce((payload, [key, value]) => Object.assign(payload, { [key]: value.toPayload() }), {})

    return payload
  }

  public toRelation(): Partial<IAttendance> {
    return {
      id:   this.id,
      name: this.name,
    }
  }

  public async store_register(register: AttendanceRegister): Promise<void> {
    Object.assign(this.registers, { [register.id]: register })
  }

  public async destroy_register(register: AttendanceRegister): Promise<void> {
    delete this.registers[register.id]
  }

  public update_register_status(student_id: string, status: AttendanceRegisterStatusEnum): void {
    const register = this.registers[student_id]
    
    if (!register) {
      throw new ErrorMessage('El estudiante no está registrado en la hoja de asistencia');
    }

    register.status = status
  }

  public get present_names():  string[] { return Object.values(this.registers).filter(register => register.status == AttendanceRegisterStatusEnum.PRESENT) .map(e => e.name) }
  public get late_names():     string[] { return Object.values(this.registers).filter(register => register.status == AttendanceRegisterStatusEnum.LATE)    .map(e => e.name) }
  public get absent_names():   string[] { return Object.values(this.registers).filter(register => register.status == AttendanceRegisterStatusEnum.ABSENT)  .map(e => e.name) }
  public get expelled_names(): string[] { return Object.values(this.registers).filter(register => register.status == AttendanceRegisterStatusEnum.EXPELLED).map(e => e.name) }

  public get registers_count(): number {
    return Object.keys(this.registers).length
  }

  public get registers_names(): string[][] {
    return [
      this.present_names,
      this.late_names,
      this.absent_names,
      this.expelled_names,
    ]
  }
}
