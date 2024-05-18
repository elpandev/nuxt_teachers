import { BACKEND_URL, ENV } from "~/src/config/env";
import { Option, type IOption } from "../domain/model";
import type { IOptionRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

interface IOptionPayload extends IOption {}

export class FetchOptionRepository extends BaseFetchModelRepository<Option, IOptionPayload> implements IOptionRepository {
  public reference() { return `${BACKEND_URL[ENV]}/options` }

  public fromPayload(payload: IOptionPayload): Option {
    const model = new Option(payload)

    model.exists = true

    return model
  }

  public toPayload(model: Option): Partial<IOptionPayload> {
    return model.toPayload()
  }
}
