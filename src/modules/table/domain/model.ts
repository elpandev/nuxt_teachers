import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";

export interface ITable extends IBaseModel  {
  name:        string
  description: string
}

export class Table extends BaseModel<ITable> {
  public name:        string = '';
  public description: string = '';

  constructor(data?: Partial<ITable>) {
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

  public fromPayload(data?: Partial<ITable>): this {
    if (data) {
      if (data.id)          this.id          = data.id
      if (data.name)        this.name        = data.name
      if (data.description) this.description = data.description
    }

    return this
  }

  public toPayload(): Partial<ITable> {
    const payload: Partial<ITable> = {}

    payload.id          = this.id
    payload.name        = this.name
    payload.description = this.description

    return payload
  }
}
