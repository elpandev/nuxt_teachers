import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { User, UserRoleEnum } from "../../user/domain/model";
import type { IAttendanceCount } from "../../attendance/domain/model";
import type { Course } from "../../course/domain/model";


export interface IUserCourseUser {
  user_id:     string
  user_name:   string
  user_role:   UserRoleEnum
  user_email:  string|null
}

export interface IUserCourseCourse {
  course_id:           string
  course_name:         string
  course_teacher_id:   string|null
  course_teacher_name: string|null
}

export interface IUserCourse extends IBaseModel, IUserCourseUser, IUserCourseCourse, IAttendanceCount {
  id: string
}

export class UserCourse extends BaseModel<IUserCourse> {
  public get id() { return `${this.user_id}_${this.course_id}` }

  public user_id:             string       = ''
  public user_name:           string       = ''
  public user_role:           UserRoleEnum = UserRoleEnum.STUDENT
  public user_email:          string|null  = ''
  public course_id:           string       = ''
  public course_name:         string       = ''
  public course_teacher_id:   string|null  = null
  public course_teacher_name: string|null  = null

  constructor(data?: Partial<IUserCourse>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      payload: {
        user_id:   this.user_id,
        course_id: this.course_id,
      },
      rules: {
        user_id:   [required(), string()],
        course_id: [required(), string(), min(6)],
      },
    })
  }

  public fromPayload(data?: Partial<IUserCourse>): this {
    if (data) {
      if (data.user_id             !== undefined) this.user_id             = data.user_id
      if (data.user_name           !== undefined) this.user_name           = data.user_name
      if (data.user_role           !== undefined) this.user_role           = data.user_role
      if (data.user_email          !== undefined) this.user_email          = data.user_email
      if (data.course_id           !== undefined) this.course_id           = data.course_id
      if (data.course_name         !== undefined) this.course_name         = data.course_name
      if (data.course_teacher_id   !== undefined) this.course_teacher_id   = data.course_teacher_id
      if (data.course_teacher_name !== undefined) this.course_teacher_name = data.course_teacher_name
    }

    return this
  }

  public toPayload(): Partial<IUserCourse> {
    return {
      user_id:             this.user_id,
      user_name:           this.user_name,
      user_role:           this.user_role,
      user_email:          this.user_email,
      course_id:           this.course_id,
      course_name:         this.course_name,
      course_teacher_id:   this.course_teacher_id,
      course_teacher_name: this.course_teacher_name,
    }
  }

  public fromUser(user: User): this {
    this.user_id    = user.id
    this.user_name  = user.name
    this.user_role  = user.role
    this.user_email = user.email

    return this
  }

  public fromCourse(course: Course): this {
    this.course_id           = course.id
    this.course_name         = course.name
    this.course_teacher_id   = course.teacher_id
    this.course_teacher_name = course.teacher_name

    return this
  }
}
