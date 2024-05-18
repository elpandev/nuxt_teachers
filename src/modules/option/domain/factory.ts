import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Option } from "./model";
import { faker } from "@faker-js/faker";

export class OptionFactory extends BaseFactory<Option> {
  public generate(): Option {
    const option = new Option()

    option.option   = `${faker.lorem.words({ min: 1, max: 4 })}`
    option.selected = faker.helpers.arrayElement([true, false])

    return option
  }
}
