import { BACKEND_URL, ENV } from "~/src/config/env";
import { UserAttendance, type IUserAttendance } from "../domain/model";
import type { IUserAttendanceRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

interface IUserAttendancePayload extends IUserAttendance {}

export class FetchUserAttendanceRepository extends BaseFetchModelRepository<UserAttendance, IUserAttendancePayload> implements IUserAttendanceRepository {
  public reference() { return `${BACKEND_URL[ENV]}/user_attendances` }

  public fromPayload(payload: IUserAttendancePayload): UserAttendance {
    const model = new UserAttendance(payload)

    model.exists = true

    return model
  }

  public toPayload(model: UserAttendance): Partial<IUserAttendancePayload> {
    return model.toPayload()
  }
}
