import type { DocumentData, DocumentSnapshot, Firestore } from "firebase/firestore";
import { Subscription, type ISubscription } from "../domain/model";
import type { ISubscriptionRepository } from "../domain/repository";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";
import { auth } from "~/src/presentation/states/auth";

export class FirestoreSubscriptionRepository extends BaseFirestoreModelRepository<Subscription, ISubscription> implements ISubscriptionRepository {
  public db: Firestore = firestore

  public reference() { return `/users/${auth.user.id}/subscriptions` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): Subscription {
    const model = new Subscription({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }
}
