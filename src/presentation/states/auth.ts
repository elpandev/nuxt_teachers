import { Subscription } from "~/src/modules/subscription/domain/model"
import { User } from "~/src/modules/user/domain/model"
import { Token } from "../models/token"

class LocalAuth {
  public token:        Token        = new Token()
  public user:         User         = new User()
  public subscription: Subscription = new Subscription()

  public get_token_from_local(): Token {
    const token_payload = localStorage.getItem('token')

    if (token_payload) {
      const token = new Token(JSON.parse(token_payload))
  
      token.exists = true
  
      return token
    }
  
    return new Token()
  }

  public destroy_token_from_local() {
    localStorage.removeItem('token')
  }

  public store_token_to_local(token: Token) {
    localStorage.setItem('token', JSON.stringify(token.toPayload()))
  }
}

export const auth = new LocalAuth()

export const useAuthState = () => useState('auth', () => auth)
