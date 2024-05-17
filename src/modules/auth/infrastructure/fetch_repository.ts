import type { IBaseAuthRepositoryLogin, IBaseAuthRepositoryRegister } from "~/elpandev/hexagonal/base/domain/auth_repository";
import { Validator, min, required, string } from "~/elpandev/validator";
import { Token } from "~/src/presentation/models/token";
import type { IAuthRepository } from "../domain/repository";
import { User } from "../../user/domain/model";

export class FetchAuthRepository implements IAuthRepository {
  public reference() { return 'http://127.0.0.1:8787' }

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
        id:                    [required(), string(), min(4)],
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

  public async login(payload: IBaseAuthRepositoryLogin): Promise<Token> {
    this.login_validate(payload)

    const response = await fetch(`${this.reference()}/login`, { method: 'POST', body: JSON.stringify(payload) })
    const data     = await response.json()
    const token    = new Token(data)

    token.exists = true

    return token
  }

  public async register(payload: IBaseAuthRepositoryRegister): Promise<Token> {
    this.register_validate(payload)

    const response = await fetch(`${this.reference()}/register`, { method: 'POST', body: JSON.stringify(payload) })
    const data     = await response.json()
    const token    = new Token(data)

    token.exists = true

    return token
  }

  public async refresh(_token: Token): Promise<Token> {
    const response = await fetch(`${this.reference()}/refresh`, { method: 'POST', headers: { 'Authorization': _token.refresh_token } })
    const data     = await response.json()
    const token    = new Token(data)

    token.exists = true

    return token
  }

  public async logout(): Promise<void> {
    await fetch(`${this.reference()}/logout`, { method: 'POST' })
  }

  public async user(token: Token): Promise<User> {
    const response = await fetch(`${this.reference()}/user`, { method: 'POST', headers: { 'Authorization': token.access_token } })
    const data     = await response.json()
    const user     = new User(data.results[0])

    user.exists = true

    return user
  }
}
