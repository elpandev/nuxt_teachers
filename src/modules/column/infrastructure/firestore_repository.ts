import { column_repository, column_request, student_request, student_repository } from "~/src/config/repositories";
import { Column, type IColumn } from "../domain/model";
import type { IColumnRepository } from "../domain/repository";
import { StudentFilter } from "../../student/domain/filter";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";
import { DocumentSnapshot, collection, deleteField, doc, increment, writeBatch, type DocumentData } from "firebase/firestore";
import { TableEnum } from "~/src/presentation/enums/tables";
import { auth } from "~/src/presentation/states/auth";
import type { Student } from "../../student/domain/model";

export class FirestoreColumnRepository extends BaseFirestoreModelRepository<Column, IColumn> implements IColumnRepository {
  public db = firestore

  public reference() { return `/${TableEnum.USERS}/${auth.user.id}/${TableEnum.COLUMNS}` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): Column {
    const model = new Column({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }
}
