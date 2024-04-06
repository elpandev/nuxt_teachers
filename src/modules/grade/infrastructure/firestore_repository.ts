import { Grade, type IGrade } from "../domain/model";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { GradeRegister } from "../domain/values/register";
import { firestore } from "~/src/config/firebase";
import { writeBatch, type DocumentData, type DocumentSnapshot, collection, doc } from "firebase/firestore";
import { TableEnum } from "~/src/presentation/enums/tables";
import { auth } from "~/src/presentation/states/auth";
import { grade_register_aggregate_repository } from "~/src/config/repositories";
import { GradeRegisterAggregate } from "../../grade_register_aggregate/domain/model";

export class FirestoreGradeRepository extends BaseFirestoreModelRepository<Grade, IGrade> {
  public db = firestore

  public reference() { return `/${TableEnum.USERS}/${auth.user.id}/${TableEnum.GRADES}` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): Grade {
    const model = new Grade({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }

  public toFirestore(model: Grade): Partial<IGrade> {
    const payload  = super.toFirestore(model)
    const contains = [] as string[]

    if (payload.registers) {
      for (const key of Object.keys(payload.registers)) {
        delete payload.registers[key].id
      }
    }

    for (const key of Object.keys(model.registers)) {
      contains.push(`student_${key}`)
    }

    Object.assign(payload, {
      search_name: model.name.trigram(),
      contains,
      resume: {
        average: model.registers_average
      }
    })

    return payload
  }

  public async store(model: Grade): Promise<void> {
    if (!model.exists && model.course != null) {
      for (const [id, student] of Object.entries(model.course.students)) {
        student.id = id

        model.store_register(new GradeRegister().fromStudent(student))
      }
    }

    const batch = writeBatch(this.db)

    batch.set(
      doc(collection(this.db, this.reference()), model.id),
      this.toFirestore(model)
    )

    for (const [key, register] of Object.entries(model.registers)) {
      const value = new GradeRegisterAggregate({
        course_id: model.course === null ? null : model.course?.id,
        grade_id: model.id,
        category_id: model.category === null ? null : model.category?.id,
        student_id: key,
        score: register.score,
      })

      value.id = `${value.grade_id}_${value.student_id}`

      batch.set(
        doc(collection(this.db, grade_register_aggregate_repository.reference()), value.id),
        grade_register_aggregate_repository.toFirestore(value)
      )
    }

    await batch.commit()
  }
}
