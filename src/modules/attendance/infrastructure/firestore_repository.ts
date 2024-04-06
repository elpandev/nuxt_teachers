import { TableEnum } from "~/src/presentation/enums/tables";
import { Student } from "../../student/domain/model";
import { Attendance, type IAttendance } from "../domain/model";
import type { IAttendanceRepository } from "../domain/repository";
import { AttendanceRegister, AttendanceRegisterStatusEnum } from "../domain/values/register";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";
import { auth } from "~/src/presentation/states/auth";
import type { DocumentSnapshot, DocumentData } from "firebase/firestore";

export class FirestoreAttendanceRepository extends BaseFirestoreModelRepository<Attendance, IAttendance> implements IAttendanceRepository {
  public db = firestore

  public reference() { return `/${TableEnum.USERS}/${auth.user.id}/${TableEnum.ATTENDANCES}` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): Attendance {
    const model = new Attendance({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }

  public toFirestore(model: Attendance): Partial<IAttendance> {
    const payload = model.toPayload()

    if (payload.registers) {
      for (const key of Object.keys(payload.registers)) {
        delete payload.registers[key].id
      }
    }

    Object.assign(payload, {
      search_name: model.name.trigram(),
      contains: ((): string[] => {
        const contains: string[] = []

        for (const [key, register] of Object.entries(model.registers)) {
          contains.push(`student_${key}`)
          contains.push(`student_${key}_${register.status}`)
        }

        if (model.present_names .isNotEmpty()) contains.push(AttendanceRegisterStatusEnum.PRESENT)
        if (model.late_names    .isNotEmpty()) contains.push(AttendanceRegisterStatusEnum.LATE)
        if (model.absent_names  .isNotEmpty()) contains.push(AttendanceRegisterStatusEnum.ABSENT)
        if (model.expelled_names.isNotEmpty()) contains.push(AttendanceRegisterStatusEnum.EXPELLED)

        return contains
      })(),
      resume: {
        status: {
          [AttendanceRegisterStatusEnum.PRESENT]:  { count: model.present_names.length },
          [AttendanceRegisterStatusEnum.LATE]:     { count: model.late_names.length },
          [AttendanceRegisterStatusEnum.ABSENT]:   { count: model.absent_names.length },
          [AttendanceRegisterStatusEnum.EXPELLED]: { count: model.expelled_names.length },
        }
      }
    })

    return payload
  }

  public async store(model: Attendance): Promise<void> {
    if (!model.exists && model.course != null) {
      for (const [id, student] of Object.entries(model.course.students)) {
        student.id = id

        model.store_register(new AttendanceRegister().fromStudent(student))
      }
    }

    await super.store(model)
  }
}
