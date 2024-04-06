import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Grade } from "./model";
import { faker } from "@faker-js/faker";

export class GradeFactory extends BaseFactory<Grade> {
  public generate(): Grade {
    const grade = new Grade()

    grade.name        = faker.commerce.department()
    grade.description = faker.lorem.sentence()

    return grade
  }
}
