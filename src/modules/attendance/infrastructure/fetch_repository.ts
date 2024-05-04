import { Attendance, type IAttendance } from "../domain/model";
import type { IAttendanceRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchAttendanceRepository extends BaseFetchModelRepository<Attendance, IAttendance> implements IAttendanceRepository {
  public reference() { return 'http://127.0.0.1:8787/attendances' }

  public fromPayload(data: any): Attendance {
    const model = new Attendance(data)

    model.exists = true

    return model
  }
}
