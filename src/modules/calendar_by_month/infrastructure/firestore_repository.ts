import { CalendarByMonth, type ICalendarByMonth } from "../domain/model";
import type { ICalendarByMonthRepository } from "../domain/repository";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";
import { DocumentSnapshot, type DocumentData } from "firebase/firestore";
import { TableEnum } from "~/src/presentation/enums/tables";
import { auth } from "~/src/presentation/states/auth";

export class FirestoreCalendarByMonthRepository extends BaseFirestoreModelRepository<CalendarByMonth, ICalendarByMonth> implements ICalendarByMonthRepository {
  public db = firestore

  public reference() { return `/${TableEnum.USERS}/${auth.user.id}/${TableEnum.CALENDAR_BY_MONTH}` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): CalendarByMonth {
    const model = new CalendarByMonth({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }
}
