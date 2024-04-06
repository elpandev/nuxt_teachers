export interface IBaseAuthRepositoryLogin {
  email: string
  password: string
}

export interface IBaseAuthRepositoryRegister extends IBaseAuthRepositoryLogin {
  name: string
  password_confirmation: string
}

export interface IBaseAuthRepository {
  login   (data: IBaseAuthRepositoryLogin): Promise<void>
  register(data: IBaseAuthRepositoryRegister): Promise<void>
  logout  (): Promise<void>
}
