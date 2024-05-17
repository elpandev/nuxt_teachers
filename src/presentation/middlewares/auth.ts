import { auth_request } from "~/src/config/repositories"
import { auth } from "../states/auth"

export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    console.log('middleware => auth')
  
    auth.token = auth.get_token_from_local()
  
    if (auth.token.expired) {
      auth.token = await auth_request.refresh(auth.token)
  
      auth.store_token_to_local(auth.token)
    }
  }

  catch (error) { console.log(error) }

  if (!auth.token.exists) {
    return navigateTo('/auth/login')
  }
})
