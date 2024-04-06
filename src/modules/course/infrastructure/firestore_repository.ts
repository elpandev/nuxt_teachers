import { course_repository, course_request, student_request, student_repository } from "~/src/config/repositories";
import { Course, type ICourse } from "../domain/model";
import type { ICourseRepository } from "../domain/repository";
import { StudentFilter } from "../../student/domain/filter";
import { BaseFirestoreModelRepository } from "~/elpandev/hexagonal/base/infrastructure/firestore_repository";
import { firestore } from "~/src/config/firebase";
import { DocumentSnapshot, collection, deleteField, doc, increment, writeBatch, type DocumentData } from "firebase/firestore";
import { TableEnum } from "~/src/presentation/enums/tables";
import { auth } from "~/src/presentation/states/auth";
import type { Student } from "../../student/domain/model";

export class FirestoreCourseRepository extends BaseFirestoreModelRepository<Course, ICourse> implements ICourseRepository {
  public db = firestore

  public reference() { return `/${TableEnum.USERS}/${auth.user.id}/${TableEnum.COURSES}` }

  public fromFirestore(doc: DocumentSnapshot<DocumentData, DocumentData>): Course {
    const model = new Course({ id: doc.id, ...doc.data() })

    model.exists = true

    return model
  }

  public async attach_student(course: Course, student: Student): Promise<void> {
    const batch = writeBatch(firestore)

    const course_ref  = doc(collection(firestore, course_repository .reference()), course.id)
    const student_ref = doc(collection(firestore, student_repository.reference()), student.id)

    batch.update(course_ref,  {
      [`students.${student.id}`]: student.toCourseRelation(),
      'students_count': increment(1),
    })

    batch.update(student_ref, {
      [`courses.${course.id}`]: course.toStudentRelation(),
      'courses_count': increment(1),
    })

    await batch.commit()
  }

  public async detach_student(course: Course, student: Student): Promise<void> {
    const batch = writeBatch(firestore)

    const course_ref  = doc(collection(firestore, course_repository .reference()), course.id)
    const student_ref = doc(collection(firestore, student_repository.reference()), student.id)

    batch.update(course_ref,  { [`students.${student.id}`]: deleteField(), 'students_count': increment(-1) })
    batch.update(student_ref, { [`courses.${course.id}`]:   deleteField(), 'courses_count':  increment(-1) })

    await batch.commit()
  }

  public async destroy(id: string): Promise<void> {
    const batch = writeBatch(firestore)

    //#region students

    const students = await student_request.paginate(new StudentFilter({ course_id: id }))

    for (const student of students) {
      const student_ref = doc(collection(firestore, student_repository.reference()), student.id)

      batch.update(student_ref, { [`courses.${id}`]: deleteField() })
    }

    //#endregion

    batch.delete(doc(collection(firestore, TableEnum.COURSES), id))

    await batch.commit()
  }
}
