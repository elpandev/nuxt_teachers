import { BaseAuthRequestRepository as ExternalBaseAuthRequestRepository } from "@/elpandev/hexagonal/base/aplication/auth_request_repository";
import { EventAuthLogin, EventAuthLogout, EventAuthRegister, observer } from "~/src/shared/domain/observer";
import type { IAuthRepository } from "../domain/repository";
import type { IBaseAuthRepositoryLogin, IBaseAuthRepositoryRegister } from "~/elpandev/hexagonal/base/domain/auth_repository";
import type { User } from "../../user/domain/model";
import type { Token } from "~/src/presentation/models/token";

export class AuthRequestRepository {
  constructor(public repository: IAuthRepository) {}

  public async login(data: IBaseAuthRepositoryLogin): Promise<void> {
    const token = await this.repository.login(data)

    observer.notify(new EventAuthLogin(token))
  }

  public async register(data: IBaseAuthRepositoryRegister): Promise<void> {
    const token = await this.repository.register(data)

    observer.notify(new EventAuthRegister(token))
  }

  public async refresh(token: Token): Promise<Token> {
    return await this.repository.refresh(token)
  }

  public async user(token: Token): Promise<User> {
    return await this.repository.user(token)
  }

  public async logout(): Promise<void> {
    await this.repository.logout()

    observer.notify(new EventAuthLogout())
  }
}
