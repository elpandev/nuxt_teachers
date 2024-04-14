import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { SelectOption } from "~/src/presentation/models/select_option";

export interface IColumn extends IBaseModel {
  type:        ColumnTypeEnum
  name:        string
  description: string
  students:    Record<string, any>
  table_id:    string
}

export enum ColumnTypeEnum {
  TEXT    = 'TEXT',
  NUMBER  = 'NUMBER',
  FORMULA = 'FORMULA',
}

export function column_type_locale(type: ColumnTypeEnum): string {
  switch (type) {
    case ColumnTypeEnum.TEXT:    return 'Texto';
    case ColumnTypeEnum.NUMBER:  return 'Número';
    case ColumnTypeEnum.FORMULA: return 'Fórmula';
  
    default: return 'Desconocido';
  }
}

export const column_type_options: SelectOption<ColumnTypeEnum>[] = Object.values(ColumnTypeEnum)
  .map(value => new SelectOption({ id: value, name: column_type_locale(value), value }))

export class Column extends BaseModel<IColumn> {
  public type: ColumnTypeEnum = ColumnTypeEnum.NUMBER;
  public name:         string = '';
  public description:  string = '';
  public students:     Record<string, any> = {};
  public table_id:     string = '';

  constructor(data?: Partial<IColumn>) {
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

  public fromPayload(data?: Partial<IColumn>): this {
    if (data) {
      if (data.id)          this.id          = data.id
      if (data.type)        this.type        = data.type
      if (data.name)        this.name        = data.name
      if (data.description) this.description = data.description
      if (data.students)    this.students    = data.students
      if (data.table_id)    this.table_id    = data.table_id
    }

    return this
  }

  public toPayload(): Partial<IColumn> {
    const payload: Partial<IColumn> = {}

    payload.id          = this.id
    payload.type        = this.type
    payload.name        = this.name
    payload.description = this.description
    payload.students    = this.students
    payload.table_id    = this.table_id

    return payload
  }

  public get is_text():    boolean { return this.type == ColumnTypeEnum.TEXT }
  public get is_number():  boolean { return this.type == ColumnTypeEnum.NUMBER }
  public get is_formula(): boolean { return this.type == ColumnTypeEnum.FORMULA }
}
