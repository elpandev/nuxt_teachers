import type { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { Schedule, type ISchedule } from "../domain/model";
import type { IScheduleRepository } from "../domain/repository";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";

export class FirestoreScheduleRepository extends BaseFirestoreModelRepository<Schedule, ISchedule> implements IScheduleRepository {
  public db = firestore

  public reference() { return 'schedules' }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): Schedule {
    const model = new Schedule({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }

  public toPayload(model: Schedule): Record<string, any> {
    return model.toPayload();
  }
}
