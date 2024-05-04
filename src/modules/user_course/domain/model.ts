import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";

export interface IUserCourse extends IBaseModel {
  user_id:   string
  course_id: string
}

export class UserCourse extends BaseModel<IUserCourse> {
  public get id() { return `${this.user_id}_${this.course_id}` }

  public user_id:   string = '';
  public course_id: string = '';

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
      if (data.user_id   !== undefined) this.user_id   = data.user_id
      if (data.course_id !== undefined) this.course_id = data.course_id
    }

    return this
  }

  public toPayload(): Partial<IUserCourse> {
    return {
      user_id:   this.user_id,
      course_id: this.course_id,
    }
  }
}
