import { auth } from "../states/auth"
import { auth_repository } from "~/src/config/repositories"

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('middleware => user')

  if (!auth.user.exists) {
    auth.user = await auth_repository.user(auth.token)
  }
})
