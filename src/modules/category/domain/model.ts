import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import type { ISelectOption } from "~/src/presentation/interfaces/select_option";

export enum CategoryTypeEnum {
  ATTENDANCE = 'ATTENDANCE',
  GRADE      = 'GRADE',
}

export interface ICategory extends IBaseModel  {
  type:        CategoryTypeEnum
  name:        string
  description: string
}

export function category_type_locale(type: CategoryTypeEnum): string {
  switch (type) {
    case CategoryTypeEnum.ATTENDANCE: return 'Asistencia';
    case CategoryTypeEnum.GRADE:      return 'Calificación';
  
    default: return 'Desconocido';
  }
}

export const category_type_options: ISelectOption[] = Object.values(CategoryTypeEnum)
  .map(value => ({ key: value, name: category_type_locale(value), value }))

export class Category extends BaseModel<ICategory> implements ICategory {
  public type: CategoryTypeEnum = CategoryTypeEnum.ATTENDANCE;
  public name:        string = '';
  public description: string = '';

  constructor(data?: Partial<ICategory>) {
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

  public fromPayload(data?: Partial<ICategory>): this {
    if (data) {
      if (data.id)          this.id          = data.id
      if (data.type)        this.type        = data.type
      if (data.name)        this.name        = data.name
      if (data.description) this.description = data.description
    }

    return this
  }

  public toPayload(): Partial<ICategory> {
    const payload: Partial<ICategory> = {}

    payload.id             = this.id
    payload.type           = this.type
    payload.name           = this.name
    payload.description    = this.description

    return payload
  }

  public toAttendanceRelation(): Partial<ICategory> {
    return {
      id:   this.id,
      name: this.name,
    }
  }

  public toGradeRelation(): Partial<ICategory> {
    return {
      id:   this.id,
      name: this.name,
    }
  }

  public toSelectOption(): ISelectOption<Category> {
    return {
      name:  this.name,
      value: this,
    }
  }
}
