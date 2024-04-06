import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Subscription, SubscriptionTypeEnum } from "./model";
import { faker } from "@faker-js/faker";

export class SubscriptionFactory extends BaseFactory<Subscription> {
  public generate(): Subscription {
    const subscription = new Subscription()

    subscription.type = faker.helpers.arrayElement(Object.values(SubscriptionTypeEnum))

    return subscription
  }
}
