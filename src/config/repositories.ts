import { AttendanceRequestRepository } from "../modules/attendance/aplication/request_repository";
import { TaskRequestRepository } from "../modules/task/aplication/request_repository";
import { UserRequestRepository } from "../modules/user/aplication/request_repository";
import { GradeRequestRepository } from "../modules/grade/aplication/request_repository";
import { QuestionRequestRepository } from "../modules/question/aplication/request_repository";
import { FirestoreScheduleRepository } from "../modules/schedule/infrastructure/firestore_repository";
import { ScheduleRequestRepository } from "../modules/schedule/aplication/request_repository";
import { CourseRequestRepository } from "../modules/course/aplication/request_repository";
import { AuthRequestRepository } from "../modules/auth/aplication/request_repository";
import { FirestoreSubscriptionRepository } from "../modules/subscription/infrastructure/firestore_repository";
import { SubscriptionRequestRepository } from "../modules/subscription/aplication/request_repository";
import { CategoryRequestRepository } from "../modules/category/aplication/request_repository";
import { FirestoreGradeRegisterAggregateRepository } from "../modules/grade_register_aggregate/infrastructure/firestore_repository";
import { GradeRegisterAggregateRequestRepository } from "../modules/grade_register_aggregate/aplication/request_repository";
import { FirestoreEventRepository } from "../modules/event/infrastructure/firestore_repository";
import { EventRequestRepository } from "../modules/event/aplication/request_repository";
import { FirestoreCalendarByMonthRepository } from "../modules/calendar_by_month/infrastructure/firestore_repository";
import { CalendarByMonthRequestRepository } from "../modules/calendar_by_month/aplication/request_repository";
import { FirestoreTableRepository } from "../modules/table/infrastructure/firestore_repository";
import { TableRequestRepository } from "../modules/table/aplication/request_repository";
import { FirestoreColumnRepository } from "../modules/column/infrastructure/firestore_repository";
import { ColumnRequestRepository } from "../modules/column/aplication/request_repository";
import { FetchUserRepository } from "../modules/user/infrastructure/fetch_repository";
import { FetchCourseRepository } from "../modules/course/infrastructure/fetch_repository";
import { UserCourseRequestRepository } from "../modules/user_course/application/request_repository";
import { FetchUserCourseRepository } from "../modules/user_course/infrastructure/fetch_repository";
import { FetchAuthRepository } from "../modules/auth/infrastructure/fetch_repository";
import { FetchAttendanceRepository } from "../modules/attendance/infrastructure/fetch_repository";
import { FetchUserAttendanceRepository } from "../modules/user_attendance/infrastructure/fetch_repository";
import { UserAttendanceRequestRepository } from "../modules/user_attendance/application/request_repository";
import { FetchCategoryRepository } from "../modules/category/infrastructure/fetch_repository";
import { FetchGradeRepository } from "../modules/grade/infrastructure/fetch_repository";
import { FetchUserGradeRepository } from "../modules/user_grade/infrastructure/fetch_repository";
import { UserGradeRequestRepository } from "../modules/user_grade/application/request_repository";
import { FetchTaskRepository } from "../modules/task/infrastructure/fetch_repository";
import { FetchUserTaskRepository } from "../modules/user_task/infrastructure/fetch_repository";
import { UserTaskRequestRepository } from "../modules/user_task/aplication/request_repository";
import { FetchQuestionRepository } from "../modules/question/infrastructure/fetch_repository";

export const auth_repository              = new FetchAuthRepository()
export const user_repository              = new FetchUserRepository()
export const category_repository          = new FetchCategoryRepository()
export const subscription_repository      = new FirestoreSubscriptionRepository()
export const course_repository            = new FetchCourseRepository()
export const user_course_repository       = new FetchUserCourseRepository()
export const user_attendance_repository   = new FetchUserAttendanceRepository()
export const user_grade_repository        = new FetchUserGradeRepository()
export const attendance_repository        = new FetchAttendanceRepository()
export const grade_repository             = new FetchGradeRepository()
export const task_repository              = new FetchTaskRepository()
export const question_repository          = new FetchQuestionRepository()
export const schedule_repository          = new FirestoreScheduleRepository()
export const table_repository             = new FirestoreTableRepository()
export const event_repository             = new FirestoreEventRepository()
export const calentar_by_month_repository = new FirestoreCalendarByMonthRepository()
export const column_repository            = new FirestoreColumnRepository()
export const user_task_repository         = new FetchUserTaskRepository()

export const auth_request              = new AuthRequestRepository(auth_repository)
export const user_request              = new UserRequestRepository(user_repository)
export const category_request          = new CategoryRequestRepository(category_repository)
export const subscription_request      = new SubscriptionRequestRepository(subscription_repository)
export const course_request            = new CourseRequestRepository(course_repository)
export const user_course_request       = new UserCourseRequestRepository(user_course_repository)
export const user_attendance_request   = new UserAttendanceRequestRepository(user_attendance_repository)
export const user_grade_request        = new UserGradeRequestRepository(user_grade_repository)
export const attendance_request        = new AttendanceRequestRepository(attendance_repository)
export const grade_request             = new GradeRequestRepository(grade_repository)
export const task_request              = new TaskRequestRepository(task_repository)
export const question_request          = new QuestionRequestRepository(question_repository)
export const schedule_request          = new ScheduleRequestRepository(schedule_repository)
export const table_request             = new TableRequestRepository(table_repository)
export const event_request             = new EventRequestRepository(event_repository)
export const calentar_by_month_request = new CalendarByMonthRequestRepository(calentar_by_month_repository)
export const column_request            = new ColumnRequestRepository(column_repository)
export const user_task_request         = new UserTaskRequestRepository(user_task_repository)


export const grade_register_aggregate_repository = new FirestoreGradeRegisterAggregateRepository()

export const grade_register_aggregate_request = new GradeRegisterAggregateRequestRepository(grade_register_aggregate_repository)
