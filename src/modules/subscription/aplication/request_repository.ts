import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { Subscription } from "../domain/model";
import type { ISubscriptionRepository } from "../domain/repository";

export class SubscriptionRequestRepository extends BaseModelRequestRepository<Subscription, ISubscriptionRepository> {

}
