import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";

export enum UserQuestionStatusEnum {
  PRESENT  = 'PRESENT',
  LATE     = 'LATE',
  ABSENT   = 'ABSENT',
  EXPELLED = 'EXPELLED',
}

export const user_attendace_status_locale: Record<UserQuestionStatusEnum, string> = {
  [UserQuestionStatusEnum.PRESENT]:  'Presente',
  [UserQuestionStatusEnum.LATE]:     'Tarde',
  [UserQuestionStatusEnum.ABSENT]:   'Ausente',
  [UserQuestionStatusEnum.EXPELLED]: 'Explusado',
}

export interface IUserQuestion extends IBaseModel {
  id:            string
  user_id:       string
  user_name:     string
  question_id: string
  course_id:     string|null
  course_name:   string|null
  category_id:   string|null
  category_name: string|null
  comment:       string
  status:        UserQuestionStatusEnum
}

export class UserQuestion extends BaseModel<IUserQuestion> {
  public get id() { return `${this.user_id}_${this.question_id}` }

  public user_id:       string      = '';
  public user_name:     string      = '';
  public question_id: string      = '';
  public course_id:     string|null = '';
  public course_name:   string|null = '';
  public category_id:   string|null = '';
  public category_name: string|null = '';
  public comment:       string      = '';
  public status:        UserQuestionStatusEnum = UserQuestionStatusEnum.PRESENT;

  constructor(data?: Partial<IUserQuestion>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      payload: {
        user_id:   this.user_id,
        question_id: this.question_id,
      },
      rules: {
        user_id:       [required(), string()],
        question_id: [required(), string(), min(6)],
      },
    })
  }

  public fromPayload(data?: Partial<IUserQuestion>): this {
    if (data) {
      if (data.user_id       !== undefined) this.user_id       = data.user_id
      if (data.user_name     !== undefined) this.user_name     = data.user_name
      if (data.question_id !== undefined) this.question_id = data.question_id
      if (data.course_id     !== undefined) this.course_id     = data.course_id
      if (data.course_name   !== undefined) this.course_name   = data.course_name
      if (data.category_id   !== undefined) this.category_id   = data.category_id
      if (data.category_name !== undefined) this.category_name = data.category_name
      if (data.comment       !== undefined) this.comment       = data.comment
      if (data.status        !== undefined) this.status        = data.status
    }

    return this
  }

  public toPayload(): Partial<IUserQuestion> {
    return {
      id:            this.id,
      user_id:       this.user_id,
      user_name:     this.user_name,
      question_id: this.question_id,
      course_id:     this.course_id,
      course_name:   this.course_name,
      category_id:   this.category_id,
      category_name: this.category_name,
      comment:       this.comment,
      status:        this.status,
    }
  }

  public get is_present():  boolean { return this.status == UserQuestionStatusEnum.PRESENT }
  public get is_late():     boolean { return this.status == UserQuestionStatusEnum.LATE }
  public get is_expelled(): boolean { return this.status == UserQuestionStatusEnum.EXPELLED }
  public get is_absent():   boolean { return this.status == UserQuestionStatusEnum.ABSENT }
}
