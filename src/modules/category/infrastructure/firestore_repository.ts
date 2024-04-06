import { Category, type ICategory } from "../domain/model";
import type { ICategoryRepository } from "../domain/repository";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";
import { DocumentSnapshot, type DocumentData } from "firebase/firestore";
import { TableEnum } from "~/src/presentation/enums/tables";
import { auth } from "~/src/presentation/states/auth";

export class FirestoreCategoryRepository extends BaseFirestoreModelRepository<Category, ICategory> implements ICategoryRepository {
  public db = firestore

  public reference() { return `/${TableEnum.USERS}/${auth.user.id}/${TableEnum.CATEGORIES}` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): Category {
    const model = new Category({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }

  public toFirestore(model: Category): Partial<ICategory> {
    const payload = super.toFirestore(model)

    Object.assign(payload, { search_name: payload.name!.trigram() })

    return payload
  }
}
