import { onAuthStateChanged } from "firebase/auth";
import { auth } from "~/src/config/firebase";

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('middleware => auth')

  await new Promise((resolve) => onAuthStateChanged(auth, resolve))

  if (auth.currentUser == null) {
    return navigateTo('/auth/login')
  }
})
