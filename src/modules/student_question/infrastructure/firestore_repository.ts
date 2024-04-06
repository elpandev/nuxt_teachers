import { StudentQuestion, type IStudentQuestion } from "../domain/model";
import type { IStudentQuestionRepository } from "../domain/repository";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";
import { type DocumentData, DocumentSnapshot } from "firebase/firestore";
import { TableEnum } from "~/src/presentation/enums/tables";
import { auth } from "~/src/presentation/states/auth";
import { queue } from "~/src/config/queue";
import { QueueTask } from "~/elpandev/utils/helpers/queue";

export class FirestoreStudentQuestionRepository extends BaseFirestoreModelRepository<StudentQuestion, IStudentQuestion> implements IStudentQuestionRepository {
  public db = firestore

  public reference() { return `/${TableEnum.USERS}/${auth.user.id}/${TableEnum.STUDENT_QUESTION}` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): StudentQuestion {
    const model = new StudentQuestion({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }
}
