import { AttendanceRequestRepository } from "../modules/attendance/aplication/request_repository";
import { TaskRequestRepository } from "../modules/task/aplication/request_repository";
import { UserRequestRepository } from "../modules/user/aplication/request_repository";
import { StudentRequestRepository } from "../modules/student/aplication/request_repository";
import { GradeRequestRepository } from "../modules/grade/aplication/request_repository";
import { QuestionRequestRepository } from "../modules/question/aplication/request_repository";
import { FirestoreScheduleRepository } from "../modules/schedule/infrastructure/firestore_repository";
import { ScheduleRequestRepository } from "../modules/schedule/aplication/request_repository";
import { FirestoreStudentRepository } from "../modules/student/infrastructure/firestore_repository";
import { CourseRequestRepository } from "../modules/course/aplication/request_repository";
import { FirestoreCourseRepository } from "../modules/course/infrastructure/firestore_repository";
import { FirestoreAttendanceRepository } from "../modules/attendance/infrastructure/firestore_repository";
import { FirestoreGradeRepository } from "../modules/grade/infrastructure/firestore_repository";
import { FirestoreTaskRepository } from "../modules/task/infrastructure/firestore_repository";
import { FirestoreQuestionRepository } from "../modules/question/infrastructure/firestore_repository";
import { AuthRequestRepository } from "../modules/auth/aplication/request_repository";
import { FirestoreAuthRepository } from "../modules/auth/infrastructure/firestore_repository";
import { FirestoreUserRepository } from "../modules/user/infrastructure/firestore_repository";
import { FirestoreSubscriptionRepository } from "../modules/subscription/infrastructure/firestore_repository";
import { SubscriptionRequestRepository } from "../modules/subscription/aplication/request_repository";
import { FirestoreCategoryRepository } from "../modules/category/infrastructure/firestore_repository";
import { CategoryRequestRepository } from "../modules/category/aplication/request_repository";
import { FirestoreGradeRegisterAggregateRepository } from "../modules/grade_register_aggregate/infrastructure/firestore_repository";
import { GradeRegisterAggregateRequestRepository } from "../modules/grade_register_aggregate/aplication/request_repository";
import { FirestoreStudentTaskRepository } from "../modules/student_task/infrastructure/firestore_repository";
import { StudentTaskRequestRepository } from "../modules/student_task/aplication/request_repository";
import { FirestoreStudentQuestionRepository } from "../modules/student_question/infrastructure/firestore_repository";
import { StudentQuestionRequestRepository } from "../modules/student_question/aplication/request_repository";
import { FirestoreEventRepository } from "../modules/event/infrastructure/firestore_repository";
import { EventRequestRepository } from "../modules/event/aplication/request_repository";
import { FirestoreCalendarByMonthRepository } from "../modules/calendar_by_month/infrastructure/firestore_repository";
import { CalendarByMonthRequestRepository } from "../modules/calendar_by_month/aplication/request_repository";
import { FirestoreTableRepository } from "../modules/table/infrastructure/firestore_repository";
import { TableRequestRepository } from "../modules/table/aplication/request_repository";
import { FirestoreColumnRepository } from "../modules/column/infrastructure/firestore_repository";
import { ColumnRequestRepository } from "../modules/column/aplication/request_repository";
import { FetchUserRepository } from "../modules/user/infrastructure/fetch_repository";

export const auth_repository              = new FirestoreAuthRepository()
export const user_repository              = new FetchUserRepository()
export const category_repository          = new FirestoreCategoryRepository()
export const subscription_repository      = new FirestoreSubscriptionRepository()
export const student_repository           = new FirestoreStudentRepository()
export const course_repository            = new FirestoreCourseRepository()
export const attendance_repository        = new FirestoreAttendanceRepository()
export const grade_repository             = new FirestoreGradeRepository()
export const task_repository              = new FirestoreTaskRepository()
export const question_repository          = new FirestoreQuestionRepository()
export const schedule_repository          = new FirestoreScheduleRepository()
export const table_repository             = new FirestoreTableRepository()
export const event_repository             = new FirestoreEventRepository()
export const calentar_by_month_repository = new FirestoreCalendarByMonthRepository()
export const column_repository            = new FirestoreColumnRepository()
export const student_task_repository      = new FirestoreStudentTaskRepository()
export const student_question_repository  = new FirestoreStudentQuestionRepository()

export const auth_request              = new AuthRequestRepository(auth_repository)
export const user_request              = new UserRequestRepository(user_repository)
export const category_request          = new CategoryRequestRepository(category_repository)
export const subscription_request      = new SubscriptionRequestRepository(subscription_repository)
export const course_request            = new CourseRequestRepository(course_repository)
export const student_request           = new StudentRequestRepository(student_repository)
export const attendance_request        = new AttendanceRequestRepository(attendance_repository)
export const grade_request             = new GradeRequestRepository(grade_repository)
export const task_request              = new TaskRequestRepository(task_repository)
export const question_request          = new QuestionRequestRepository(question_repository)
export const schedule_request          = new ScheduleRequestRepository(schedule_repository)
export const table_request             = new TableRequestRepository(table_repository)
export const event_request             = new EventRequestRepository(event_repository)
export const calentar_by_month_request = new CalendarByMonthRequestRepository(calentar_by_month_repository)
export const column_request            = new ColumnRequestRepository(column_repository)
export const student_task_request      = new StudentTaskRequestRepository(student_task_repository)
export const student_question_request  = new StudentQuestionRequestRepository(student_question_repository)


export const grade_register_aggregate_repository = new FirestoreGradeRegisterAggregateRepository()

export const grade_register_aggregate_request = new GradeRegisterAggregateRequestRepository(grade_register_aggregate_repository)
