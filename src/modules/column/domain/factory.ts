import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Column } from "./model";
import { faker } from "@faker-js/faker";

export class ColumnFactory extends BaseFactory<Column> {
  public generate(): Column {
    const column = new Column()

    column.name        = faker.person.jobArea()
    column.description = faker.lorem.sentence()

    return column
  }
}
