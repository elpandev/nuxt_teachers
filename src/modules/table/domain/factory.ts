import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Table } from "./model";
import { faker } from "@faker-js/faker";

export class TableFactory extends BaseFactory<Table> {
  public generate(): Table {
    const table = new Table()

    table.name        = faker.person.jobArea()
    table.description = faker.lorem.sentence()

    return table
  }
}
