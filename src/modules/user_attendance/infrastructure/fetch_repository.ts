import { BACKEND_URL, ENV } from "~/src/config/env";
import { UserAttendance, type IUserAttendance } from "../domain/model";
import type { IUserAttendanceRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchUserAttendanceRepository extends BaseFetchModelRepository<UserAttendance, IUserAttendance> implements IUserAttendanceRepository {
  public reference() { return `${BACKEND_URL[ENV]}/user_attendances` }

  public fromPayload(data: any): UserAttendance {
    const model = new UserAttendance(data)

    model.exists = true

    return model
  }
}
