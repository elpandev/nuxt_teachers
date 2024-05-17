import { BACKEND_URL, ENV } from "~/src/config/env";
import { User, type IUser } from "../domain/model";
import type { IUserRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

interface IUserPayload extends IUser {}

export class FetchUserRepository extends BaseFetchModelRepository<User, IUserPayload> implements IUserRepository {
  public reference() { return `${BACKEND_URL[ENV]}/users` }

  public fromPayload(payload: IUserPayload): User {
    const model = new User(payload)

    model.exists = true

    return model
  }

  public toPayload(model: User): Partial<IUserPayload> {
    return model.toPayload()
  }
}
