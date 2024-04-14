import { Table, type ITable } from "../domain/model";
import type { ITableRepository } from "../domain/repository";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";
import { DocumentSnapshot, type DocumentData } from "firebase/firestore";
import { TableEnum } from "~/src/presentation/enums/tables";
import { auth } from "~/src/presentation/states/auth";

export class FirestoreTableRepository extends BaseFirestoreModelRepository<Table, ITable> implements ITableRepository {
  public db = firestore

  public reference() { return `/${TableEnum.USERS}/${auth.user.id}/${TableEnum.TABLES}` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): Table {
    const model = new Table({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }

  public toFirestore(model: Table): Partial<ITable> {
    const payload = super.toFirestore(model)

    Object.assign(payload, { search_name: payload.name!.trigram() })

    return payload
  }
}
