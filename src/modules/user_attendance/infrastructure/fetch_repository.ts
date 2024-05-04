import { UserAttendance, type IUserAttendance } from "../domain/model";
import type { IUserAttendanceRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchUserAttendanceRepository extends BaseFetchModelRepository<UserAttendance, IUserAttendance> implements IUserAttendanceRepository {
  public reference() { return 'http://127.0.0.1:8787/user_attendances' }

  public fromPayload(data: any): UserAttendance {
    const model = new UserAttendance(data)

    model.exists = true

    return model
  }
}
