import { Task, type ITask } from "../domain/model";
import type { ITaskRepository } from "../domain/repository";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";
import { type DocumentData, DocumentSnapshot } from "firebase/firestore";
import { TableEnum } from "~/src/presentation/enums/tables";
import { auth } from "~/src/presentation/states/auth";

export class FirestoreTaskRepository extends BaseFirestoreModelRepository<Task, ITask> implements ITaskRepository {
  public db = firestore

  public reference() { return `/${TableEnum.USERS}/${auth.user.id}/${TableEnum.TASKS}` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): Task {
    const model = new Task({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }
}
