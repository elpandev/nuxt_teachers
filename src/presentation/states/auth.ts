import { auth as fireauth } from "~/src/config/firebase"
import { Subscription } from "~/src/modules/subscription/domain/model"
import { User } from "~/src/modules/user/domain/model"

type IAuth = {
  user:         User
  subscription: Subscription
  loggedIn:     boolean
}

class LocalAuth implements IAuth {
  public user:         User         = new User()
  public subscription: Subscription = new Subscription()

  public get loggedIn(): boolean {
    return fireauth.currentUser != null
  }
}

export const auth = new LocalAuth()

export const useAuthState = () => useState('auth', () => auth)
