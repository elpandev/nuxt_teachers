import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { code_id } from "~/elpandev/utils";
import { User, type IUser } from "../../user/domain/model";

export enum SubscriptionTypeEnum {
  BASIC = 'BASIC',
  PRO = 'PRO',
}


export interface ISubscriptionPermissions {
  task_count: number
}

export const permissions_by_subscription_type: Record<SubscriptionTypeEnum, ISubscriptionPermissions> = {
  [SubscriptionTypeEnum.BASIC]: {
    task_count: 100
  },
  [SubscriptionTypeEnum.PRO]: {
    task_count: 1000
  },
}

export interface ISubscription extends IBaseModel {
  id:    string
  type:  SubscriptionTypeEnum
  user:  Partial<IUser>
}

export class Subscription extends BaseModel<ISubscription> implements ISubscription {
  public id:    string               = code_id('yeR2GMIt6E89qKgCYrzvU1O4BTVNuXZWLpAjSslQJ35omchF0knadPibxHw7D');
  public type:  SubscriptionTypeEnum = SubscriptionTypeEnum.BASIC;
  public user:  User                 = new User();

  constructor(data?: Partial<ISubscription>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      payload: {
        id: this.id,
      },
      rules: {
        id: [required(), string()],
      },
    })
  }

  public fromPayload(data?: Partial<ISubscription>): this {
    if (data) {
      if (data.id)   this.id   = data.id
      if (data.type) this.type = data.type
      if (data.user) this.user = new User(data.user)
    }

    return this
  }

  public toPayload(): Partial<ISubscription> {
    const payload: Partial<ISubscription> = {
      id:   this.id,
      type: this.type,
      user: {
        id:   this.user.id,
        name: this.user.name,
      }
    }

    return payload
  }

  public get permissions(): ISubscriptionPermissions {
    return permissions_by_subscription_type[this.type]
  }
}
