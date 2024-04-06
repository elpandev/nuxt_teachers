import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Course } from "./model";
import { faker } from "@faker-js/faker";

export class CourseFactory extends BaseFactory<Course> {
  public generate(): Course {
    const course = new Course()

    course.name        = faker.person.jobArea()
    course.description = faker.lorem.sentence()

    return course
  }
}
