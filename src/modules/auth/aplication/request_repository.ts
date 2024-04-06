import { BaseAuthRequestRepository as ExternalBaseAuthRequestRepository } from "@/elpandev/hexagonal/base/aplication/auth_request_repository";
import { EventAuthLogin, EventAuthLogout, EventAuthRegister, observer } from "~/src/shared/domain/observer";
import type { IAuthRepository } from "../domain/repository";
import type { IBaseAuthRepositoryLogin, IBaseAuthRepositoryRegister } from "~/elpandev/hexagonal/base/domain/auth_repository";

export class AuthRequestRepository extends ExternalBaseAuthRequestRepository<IAuthRepository> {
  constructor(public repository: IAuthRepository) { super(repository) }

  public async login(data: IBaseAuthRepositoryLogin): Promise<void> {
    await super.login(data)

    observer.notify(new EventAuthLogin())
  }

  public async register(data: IBaseAuthRepositoryRegister): Promise<void> {
    await super.register(data)

    observer.notify(new EventAuthRegister())
  }

  public async logout(): Promise<void> {
    await super.logout()

    observer.notify(new EventAuthLogout())
  }
}
