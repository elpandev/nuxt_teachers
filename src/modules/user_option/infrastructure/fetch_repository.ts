import { BACKEND_URL, ENV } from "~/src/config/env";
import { UserOption, type IUserOption } from "../domain/model";
import type { IUserOptionRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

interface IUserOptionPayload extends IUserOption {}

export class FetchUserOptionRepository extends BaseFetchModelRepository<UserOption, IUserOptionPayload> implements IUserOptionRepository {
  public reference() { return `${BACKEND_URL[ENV]}/user_options` }

  public fromPayload(payload: IUserOptionPayload): UserOption {
    const model = new UserOption(payload)

    model.exists = true

    return model
  }

  public toPayload(model: UserOption): Partial<IUserOptionPayload> {
    return model.toPayload()
  }
}
