import { BACKEND_URL, ENV } from "~/src/config/env";
import { Attendance, type IAttendance } from "../domain/model";
import type { IAttendanceRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

interface IAttendancePayload extends IAttendance {}

export class FetchAttendanceRepository extends BaseFetchModelRepository<Attendance, IAttendancePayload> implements IAttendanceRepository {
  public reference() { return `${BACKEND_URL[ENV]}/attendances` }

  public fromPayload(payload: IAttendancePayload): Attendance {
    const model = new Attendance(payload)

    model.exists = true

    return model
  }

  public toPayload(model: Attendance): Partial<IAttendancePayload> {
    return model.toPayload()
  }
}
