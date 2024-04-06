import { GradeRegisterAggregate, type IGradeRegisterAggregate } from "../domain/model";
import type { IGradeRegisterAggregateRepository } from "../domain/repository";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";
import { DocumentSnapshot, type DocumentData } from "firebase/firestore";
import { TableEnum } from "~/src/presentation/enums/tables";
import { auth } from "~/src/presentation/states/auth";

export class FirestoreGradeRegisterAggregateRepository extends BaseFirestoreModelRepository<GradeRegisterAggregate, IGradeRegisterAggregate> implements IGradeRegisterAggregateRepository {
  public db = firestore

  public reference() { return `/${TableEnum.USERS}/${auth.user.id}/${TableEnum.GRADE_REGISTER_AGGREGATES}` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): GradeRegisterAggregate {
    const model = new GradeRegisterAggregate({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }
}
