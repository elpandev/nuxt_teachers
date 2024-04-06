import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { User } from "./model";
import { faker } from "@faker-js/faker";

export class UserFactory extends BaseFactory<User> {
  public generate(): User {
    const user = new User()

    user.name  = faker.person.fullName()
    user.email = faker.internet.email()

    return user
  }
}
