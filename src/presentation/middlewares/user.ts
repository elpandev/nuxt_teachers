import { auth as fireauth } from "~/src/config/firebase"
import { auth } from "../states/auth"
import { user_request } from "~/src/config/repositories"
import { User } from "~/src/modules/user/domain/model"

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('middleware => user')

  const current = fireauth.currentUser

  if (current && !auth.user.exists) {
    const user = await user_request.get(current.uid)

    auth.user = user ?? new User({
      id:    current.uid,
      name:  current.displayName ?? undefined,
      email: current.email ?? undefined
    })

    auth.user.exists = true
  }
})
