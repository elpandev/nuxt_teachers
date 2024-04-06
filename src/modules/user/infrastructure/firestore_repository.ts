import { firestore } from "~/src/config/firebase";
import { User, type IUser } from "../domain/model";
import type { IUserRepository } from "../domain/repository";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import type { DocumentData, DocumentSnapshot } from "firebase/firestore";

export class FirestoreUserRepository extends BaseFirestoreModelRepository<User, IUser> implements IUserRepository {
  public db = firestore

  public reference() { return 'users' }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): User {
    const model = new User({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }
}
