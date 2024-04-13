import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { Event } from "../domain/model";
import type { IEventRepository } from "../domain/repository";

export class EventRequestRepository extends BaseModelRequestRepository<Event, IEventRepository> {

}
