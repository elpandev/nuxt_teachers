import type { IBaseAuthRepository } from "~/elpandev/hexagonal/base/domain/auth_repository";
import type { Token } from "~/src/presentation/models/token";
import type { User } from "../../user/domain/model";

export interface IAuthRepository extends IBaseAuthRepository<Token, User> {

}
