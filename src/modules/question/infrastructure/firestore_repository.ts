import { Question, type IQuestion } from "../domain/model";
import type { IQuestionRepository } from "../domain/repository";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";
import { type DocumentData, DocumentSnapshot } from "firebase/firestore";
import { TableEnum } from "~/src/presentation/enums/tables";
import { auth } from "~/src/presentation/states/auth";

export class FirestoreQuestionRepository extends BaseFirestoreModelRepository<Question, IQuestion> implements IQuestionRepository {
  public db = firestore

  public reference() { return `/${TableEnum.USERS}/${auth.user.id}/${TableEnum.QUESTIONS}` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): Question {
    const model = new Question({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }
}
