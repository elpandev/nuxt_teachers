import type { DocumentData, DocumentSnapshot, Firestore } from "firebase/firestore";
import { Student, type IStudent } from "../domain/model";
import type { IStudentRepository } from "../domain/repository";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";
import { auth } from "~/src/presentation/states/auth";

export class FirestoreStudentRepository extends BaseFirestoreModelRepository<Student, IStudent> implements IStudentRepository {
  public db: Firestore = firestore

  public reference() { return `/users/${auth.user.id}/students` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): Student {
    const model = new Student({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }

  public toPayload(model: Student): Record<string, any> {
    return model.toPayload()
  }
}
