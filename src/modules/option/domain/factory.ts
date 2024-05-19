import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Option } from "./model";
import { faker } from "@faker-js/faker";

export class OptionFactory extends BaseFactory<Option> {
  constructor(public params: { task_id?: string, question_id?: string, exists?: boolean } = {}) {
    super()
  }

  public generate(): Option {
    const option = new Option()

    option.option   = `${faker.lorem.words({ min: 1, max: 4 })}`
    option.selected = faker.helpers.arrayElement([true, false])
    
    if (this.params.task_id     !== undefined) option.task_id     = this.params.task_id
    if (this.params.question_id !== undefined) option.question_id = this.params.question_id
    if (this.params.exists      !== undefined) option.exists      = this.params.exists

    return option
  }
}
