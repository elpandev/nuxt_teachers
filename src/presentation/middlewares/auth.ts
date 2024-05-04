import { auth } from "../states/auth"

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('middleware => auth')

  auth.token = auth.get_token_from_local()

  if (!auth.token.exists || auth.token.expired) {
    return navigateTo('/auth/login')
  }
})
