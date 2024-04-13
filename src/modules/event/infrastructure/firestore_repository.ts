import { Event, type IEvent } from "../domain/model";
import type { IEventRepository } from "../domain/repository";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";
import { DocumentSnapshot, type DocumentData } from "firebase/firestore";
import { TableEnum } from "~/src/presentation/enums/tables";
import { auth } from "~/src/presentation/states/auth";

export class FirestoreEventRepository extends BaseFirestoreModelRepository<Event, IEvent> implements IEventRepository {
  public db = firestore

  public reference() { return `/${TableEnum.USERS}/${auth.user.id}/${TableEnum.EVENTS}` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): Event {
    const model = new Event({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }

  public toFirestore(model: Event): Partial<IEvent> {
    const payload = super.toFirestore(model)

    Object.assign(payload, { search_name: payload.name!.trigram() })

    return payload
  }
}
