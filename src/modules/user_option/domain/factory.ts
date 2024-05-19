import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { UserOption } from "./model";
import { faker } from "@faker-js/faker";

export class UserOptionFactory extends BaseFactory<UserOption> {
  constructor(public params: { exists?: boolean } = {}) {
    super()
  }

  public generate(): UserOption {
    const option = new UserOption()

    option.selected = faker.helpers.arrayElement([true, false])

    if (typeof this.params.exists  == 'boolean') option.exists = this.params.exists

    return option
  }
}
