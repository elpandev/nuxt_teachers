import type { IBaseModelRepository } from "~/elpandev/hexagonal/base/domain/repository";
import { Event } from "./model";

export interface IEventRepository extends IBaseModelRepository<Event> {

}
