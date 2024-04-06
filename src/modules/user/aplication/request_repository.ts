import { BaseModelRequestRepository } from "~/elpandev/hexagonal/base/aplication/model_request_repository";
import { User } from "../domain/model";
import type { IUserRepository } from "../domain/repository";

export class UserRequestRepository extends BaseModelRequestRepository<User, IUserRepository> {

}
