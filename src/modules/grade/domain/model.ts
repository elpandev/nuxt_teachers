import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { GradeRegister } from "./values/register";
import { Course } from "../../course/domain/model";
import type { IGradeRegister } from "./values/register";
import type { ICourse } from "../../course/domain/model";
import { code_id } from "~/elpandev/utils";
import { Category, type ICategory } from "../../category/domain/model";

export interface IGrade extends IBaseModel {
  id:          string
  name:        string
  description: string
  date_at:     number
  course:      Partial<ICourse|null>
  category:    Partial<ICategory|null>
  registers:   Record<string, Partial<IGradeRegister>>
}

export class Grade extends BaseModel<IGrade> implements IGrade {
  public id:          string        = code_id('yeR2GMIt6E89qKgCYrzvU1O4BTVNuXZWLpAjSslQJ35omchF0knadPibxHw7D');
  public name:        string        = '';
  public description: string        = '';
  public date_at:     number        = Date.now();
  public course:      Course|null   = null;
  public category:    Category|null = null;
  public registers:   Record<string, GradeRegister> = {};

  constructor(data?: Partial<IGrade>) {
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

  public fromPayload(data?: Partial<IGrade>): this {
    if (data) {
      if (data.id          != undefined) this.id          = data.id
      if (data.name        != undefined) this.name        = data.name
      if (data.description != undefined) this.description = data.description
      if (data.date_at     != undefined) this.date_at     = data.date_at
      if (data.course      != undefined) this.course      = new Course().fromPayload(data.course)
      if (data.category    != undefined) this.category    = new Category().fromPayload(data.category)
      if (data.registers   != undefined) this.registers   = Object.entries(data.registers).reduce((payload, [key, value]) => Object.assign(payload, { [key]: new GradeRegister().fromPayload(value) }), {})
    }

    return this
  }

  public toPayload(): Partial<IGrade> {
    const payload: Partial<IGrade> = {}

    payload.id          = this.id
    payload.name        = this.name
    payload.description = this.description
    payload.date_at     = this.date_at
    payload.course      = this.course  ?.toGradeRelation() ?? null
    payload.category    = this.category?.toGradeRelation() ?? null
    payload.registers   = Object.entries(this.registers).reduce((payload, [key, value]) => Object.assign(payload, { [key]: value.toPayload() }), {})

    return payload
  }

  public async store_register(register: GradeRegister): Promise<void> {
    Object.assign(this.registers, { [register.id]: register })
  }

  public async destroy_register(register: GradeRegister): Promise<void> {
    delete this.registers[register.id]
  }

  public get registers_total(): number {
    const values = Object.values(this.registers)

    try { return values.reduce((total, register) => total += register.score, 0) }

    catch (error) {}

    return 0
  }

  public get registers_average(): number {    
    try {
      const length = Object.keys(this.registers).length

      return length > 0
        ? this.registers_total / length
        : 0
    }

    catch (error) {}
  
    return 0
  }
}
