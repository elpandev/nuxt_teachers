import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Student } from "./model";
import { faker } from "@faker-js/faker";

export class StudentFactory extends BaseFactory<Student> {
  public generate(): Student {
    const student = new Student()

    student.name  = faker.person.fullName()
    student.email = faker.internet.email()

    return student
  }
}
