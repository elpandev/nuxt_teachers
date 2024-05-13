import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { code_id } from "~/elpandev/utils";
import { SelectOption } from "~/src/presentation/models/select_option";
import type { IAttendanceCount } from "../../attendance/domain/model";

export enum UserRoleEnum {
  ADMIN   = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT  = 'PARENT',
}

export function user_role_locale(type: UserRoleEnum): string {
  switch (type) {
    case UserRoleEnum.ADMIN:   return 'Administrador';
    case UserRoleEnum.TEACHER: return 'Profesor';
    case UserRoleEnum.STUDENT: return 'Estudiante';
    case UserRoleEnum.PARENT:  return 'Representante';
  
    default: return 'Desconocido';
  }
}

export const user_role_options: SelectOption[] = Object.values(UserRoleEnum)
  .map(value => new SelectOption(({  id: value, name: user_role_locale(value), value })))

export interface IUser extends IBaseModel, IAttendanceCount {
  id:                  string
  name:                string
  email:               string
  role:                UserRoleEnum
  courses_count:       number
  order_name:          string
  order_courses_count: string
}

export class User extends BaseModel<IUser> {
  public id:                  string       = code_id('T4gWkQn73fhuryNcHFa1vpICeKPl9BMjz2dDXsxOYGA6R5LVU8mtEwqSobZi0J');
  public name:                string       = '';
  public email:               string       = '';
  public role:                UserRoleEnum = UserRoleEnum.STUDENT;
  public courses_count:       number       = 0;
  public present_count:       number       = 0
  public late_count:          number       = 0
  public absent_count:        number       = 0
  public expelled_count:      number       = 0
  public order_name:          string       = ''
  public order_courses_count: string       = ''

  constructor(data?: Partial<IUser>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      payload: {
        id:   this.id,
        name: this.name,
      },
      rules: {
        id:   [required(), string()],
        name: [required(), string(), min(6)],
      },
    })
  }

  public fromPayload(data?: Partial<IUser>): this {
    if (data) {
      if (data.id                  !== undefined) this.id                  = data.id
      if (data.name                !== undefined) this.name                = data.name
      if (data.email               !== undefined) this.email               = data.email
      if (data.role                !== undefined) this.role                = data.role
      if (data.courses_count       !== undefined) this.courses_count       = data.courses_count
      if (data.present_count       !== undefined) this.present_count       = data.present_count
      if (data.late_count          !== undefined) this.late_count          = data.late_count
      if (data.absent_count        !== undefined) this.absent_count        = data.absent_count
      if (data.expelled_count      !== undefined) this.expelled_count      = data.expelled_count
      if (data.order_name          !== undefined) this.order_name          = data.order_name
      if (data.order_courses_count !== undefined) this.order_courses_count = data.order_courses_count
    }

    return this
  }

  public toPayload(): Partial<IUser> {
    return {
      id:                  this.id,
      name:                this.name,
      email:               this.email,
      role:                this.role,
      courses_count:       this.courses_count,
      present_count:       this.present_count,
      late_count:          this.late_count,
      absent_count:        this.absent_count,
      expelled_count:      this.expelled_count,
      order_name:          this.order_name,
      order_courses_count: this.order_courses_count,
    }
  }

  public toSelectOption(): SelectOption<User> {
    return new SelectOption({
      id:    this.id,
      name:  this.name,
      value: this,
    })
  }

  public cursor(order_by?: string): string|undefined {
    if (order_by === undefined) return undefined

    switch (order_by) {
      case 'name':          return `${this.name}${this.id}`
      case 'courses_count': return `${this.courses_count}${this.id}`
    
      default: return undefined
    }
  }
}
