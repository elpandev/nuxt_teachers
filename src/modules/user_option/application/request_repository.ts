import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { UserOption } from "../domain/model";
import type { IUserOptionRepository } from "../domain/repository";

export class UserOptionRequestRepository extends BaseModelRequestRepository<UserOption, IUserOptionRepository> {

}
