import { BaseFactory } from "~/elpandev/hexagonal/base/domain/factory";
import { Attendance } from "./model";
import { faker } from "@faker-js/faker";

export class AttendanceFactory extends BaseFactory<Attendance> {
  public generate(): Attendance {
    const attendance = new Attendance()

    attendance.name        = faker.commerce.department()
    attendance.description = faker.lorem.sentence()

    return attendance
  }
}
