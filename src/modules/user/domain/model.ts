import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { code_id } from "~/elpandev/utils";
import { SelectOption } from "~/src/presentation/models/select_option";

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

export interface IUser extends IBaseModel {
  id:            string
  name:          string
  email:         string
  role:          UserRoleEnum
  courses_count: number
}

export class User extends BaseModel<IUser> implements IUser {
  public id:    string = code_id('T4gWkQn73fhuryNcHFa1vpICeKPl9BMjz2dDXsxOYGA6R5LVU8mtEwqSobZi0J');
  public name:  string = '';
  public email: string = '';
  public role:  UserRoleEnum = UserRoleEnum.STUDENT;
  public courses_count: number = 0;

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
      if (data.id            !== undefined) this.id            = data.id
      if (data.name          !== undefined) this.name          = data.name
      if (data.email         !== undefined) this.email         = data.email
      if (data.role          !== undefined) this.role          = data.role
      if (data.courses_count !== undefined) this.courses_count = data.courses_count
    }

    return this
  }

  public toPayload(): Partial<IUser> {
    return {
      id:            this.id,
      name:          this.name,
      email:         this.email,
      role:          this.role,
      courses_count: this.courses_count,
    }
  }
}
