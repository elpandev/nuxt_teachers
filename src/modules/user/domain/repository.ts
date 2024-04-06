import type { IBaseModelRepository } from "~/elpandev/hexagonal/base/domain/repository";
import { User } from "./model";

export interface IUserRepository extends IBaseModelRepository<User> {

}
