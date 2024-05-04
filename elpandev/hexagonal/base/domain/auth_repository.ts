import type { Token } from "~/src/presentation/models/token"

export interface IBaseAuthRepositoryLogin {
  email: string
  password: string
}

export interface IBaseAuthRepositoryRegister extends IBaseAuthRepositoryLogin {
  id: string
  name: string
  password_confirmation: string
}

export interface IBaseAuthRepository<T, U> {
  login   (data: IBaseAuthRepositoryLogin): Promise<T>
  register(data: IBaseAuthRepositoryRegister): Promise<T>
  refresh (token: Token): Promise<T>
  logout  (): Promise<void>
  user    (token: Token): Promise<U>
}
