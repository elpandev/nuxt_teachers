import { auth } from "../states/auth"
import { subscription_request } from "~/src/config/repositories"
import { SubscriptionFilter } from "~/src/modules/subscription/domain/filter"

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('middleware => subscription')

  // if (!auth.subscription.exists) {
  //   const subscriptions = await subscription_request.paginate(new SubscriptionFilter({ limit: 1 }))
  
  //   if (subscriptions.isNotEmpty()) {
  //     auth.subscription = subscriptions[0]
  //   }

  //   auth.subscription.exists = true
  // }
})
