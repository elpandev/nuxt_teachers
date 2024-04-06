import type { IBaseAuthRepositoryLogin, IBaseAuthRepositoryRegister } from "~/elpandev/hexagonal/base/domain/auth_repository";
import type { IAuthRepository } from "../domain/repository";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "~/src/config/firebase";
import { user_request } from "~/src/config/repositories";
import { User } from "../../user/domain/model";

export class FirestoreAuthRepository implements IAuthRepository {
  public async login(data: IBaseAuthRepositoryLogin): Promise<void> {
    await signInWithEmailAndPassword(auth, data.email, data.password)
  }

  public async register(data: IBaseAuthRepositoryRegister): Promise<void> {
    const credential = await createUserWithEmailAndPassword(auth, data.email, data.password)

    await user_request.store(new User({
      id:    credential.user.uid,
      name:  credential.user.displayName ?? undefined,
      email: credential.user.email ?? undefined
    }))
  }

  public async logout(): Promise<void> {
    await signOut(auth)
  }
}
