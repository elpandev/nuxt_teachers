import { BACKEND_URL, ENV } from "~/src/config/env";
import { User, type IUser } from "../domain/model";
import type { IUserRepository } from "../domain/repository";
import { BaseFetchModelRepository } from "~/elpandev/hexagonal/base/infrastructure/fetch_repository";

export class FetchUserRepository extends BaseFetchModelRepository<User, IUser> implements IUserRepository {
  public reference() { return `${BACKEND_URL[ENV]}/users` }

  public fromPayload(data: any): User {
    const model = new User(data)

    model.exists = true

    return model
  }
}
