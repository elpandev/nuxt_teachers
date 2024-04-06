import { Identifier, IdentifierTypeEnum } from "../modules/identifier/domain/model";

export const identifier_student_name  = new Identifier({ id: 'student_name',  type: IdentifierTypeEnum.STUDENT, name: 'Nombre del Estudiante' })
export const identifier_student_email = new Identifier({ id: 'student_email', type: IdentifierTypeEnum.STUDENT, name: 'Email del Estudiante' })

export const identifier_students: Identifier[] = [
  identifier_student_name,
  identifier_student_email,
]
