import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { Subscription, type ISubscription } from "../../subscription/domain/model";

export interface IUser extends IBaseModel {
  name:  string
  email: string
}

export class User extends BaseModel<IUser> implements IUser {
  public id:    string = '';
  public name:  string = '';
  public email: string = '';

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
      if (data.id)    this.id    = data.id
      if (data.name)  this.name  = data.name
      if (data.email) this.email = data.email
    }

    return this
  }

  public toPayload(): Partial<IUser> {
    return {
      id:    this.id,
      name:  this.name,
      email: this.email,
    }
  }
}
