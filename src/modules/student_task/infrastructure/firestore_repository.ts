import { StudentTask, type IStudentTask } from "../domain/model";
import type { IStudentTaskRepository } from "../domain/repository";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";
import { type DocumentData, DocumentSnapshot } from "firebase/firestore";
import { TableEnum } from "~/src/presentation/enums/tables";
import { auth } from "~/src/presentation/states/auth";

export class FirestoreStudentTaskRepository extends BaseFirestoreModelRepository<StudentTask, IStudentTask> implements IStudentTaskRepository {
  public db = firestore

  public reference() { return `/${TableEnum.USERS}/${auth.user.id}/${TableEnum.STUDENT_TASK}` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): StudentTask {
    const model = new StudentTask({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }
}
