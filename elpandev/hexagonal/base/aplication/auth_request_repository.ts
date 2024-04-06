import { Validator, required, string, min } from "@/elpandev/validator";
import type { IBaseAuthRepository, IBaseAuthRepositoryLogin, IBaseAuthRepositoryRegister } from "../domain/auth_repository";

export abstract class BaseAuthRequestRepository<T extends IBaseAuthRepository> {
  constructor(public repository: T) {}

  public login_validate(data: IBaseAuthRepositoryLogin) {
    const validator =  new Validator({
      payload: data,
      rules: {
        email:    [required(), string(), min(4)],
        password: [required(), string(), min(6)],
      },
      messages: {
        email: {
          required: 'El email es requerido',
          string:   'El email debe ser un texto',
          min:      'El email debe tener al menos 4 carácteres'
        },
        password: {
          required: 'El password es requerido',
          string:   'El password debe ser un texto',
          min:      'El password debe tener al menos 6 carácteres'
        },
      }
    })
  
    if (!validator.validated) { throw validator }
  }

  public register_validate(data: IBaseAuthRepositoryRegister) {
    const validator =  new Validator({
      payload: data,
      rules: {
        name:                  [required(), string(), min(4)],
        email:                 [required(), string(), min(4)],
        password:              [required(), string(), min(6)],
        password_confirmation: [required(), string(), min(6)],
      },
      messages: {
        name: {
          required: 'El nombre es requerido',
          string:   'El nombre debe ser un texto',
          min:      'El nombre debe tener al menos 4 carácteres'
        },
        email: {
          required: 'El email es requerido',
          string:   'El email debe ser un texto',
          min:      'El email debe tener al menos 4 carácteres'
        },
        password: {
          required: 'La constraseña es requerida',
          string:   'La constraseña debe ser un texto',
          min:      'La constraseña debe tener al menos 6 carácteres'
        },
        password_confirmation: {
          required: 'La constraseña es requerida',
          string:   'La constraseña debe ser un texto',
          min:      'La constraseña debe tener al menos 6 carácteres'
        },
      }
    })
  
    if (!validator.validated) { throw validator }
  }

  public login(data: IBaseAuthRepositoryLogin): Promise<void> {
    this.login_validate(data)

    return this.repository.login(data)
  }

  public register(data: IBaseAuthRepositoryRegister): Promise<void> {
    this.register_validate(data)

    return this.repository.register(data)
  }

  public logout(): Promise<void> {
    return this.repository.logout()
  }

  public store_response(): Promise<void> {
    return this.repository.logout()
  }
}
