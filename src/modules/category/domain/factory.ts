import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Category, CategoryTypeEnum } from "./model";
import { faker } from "@faker-js/faker";

export class CategoryFactory extends BaseFactory<Category> {
  public generate(): Category {
    const category = new Category()

    category.type        = faker.helpers.arrayElement(Object.values(CategoryTypeEnum))
    category.name        = faker.person.jobArea()
    category.description = faker.lorem.sentence()

    return category
  }
}
