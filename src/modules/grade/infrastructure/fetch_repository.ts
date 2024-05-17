import { BACKEND_URL, ENV } from "~/src/config/env";
import { Grade, type IGrade } from "../domain/model";
import type { IGradeRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

interface IGradePayload extends Omit<IGrade, 'date_at'> {
  date_at: number
}

export class FetchGradeRepository extends BaseFetchModelRepository<Grade, IGradePayload> implements IGradeRepository {
  public reference() { return `${BACKEND_URL[ENV]}/grades` }

  public fromPayload(payload: IGradePayload): Grade {
    const model = new Grade({
      ...payload,
      date_at: new Date(payload.date_at)
    })

    model.exists = true

    return model
  }

  public toPayload(model: Grade): Partial<IGradePayload> {
    console.log({
      ...model.toPayload(),
      date_at: model.date_at.getTime()
    })
    return {
      ...model.toPayload(),
      date_at: model.date_at.getTime()
    }
  }
}
