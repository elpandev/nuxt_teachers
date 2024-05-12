import { Validator, required, string } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import type { ISelectOption } from "~/src/presentation/interfaces/select_option";
import { UserRoleEnum } from "../../user/domain/model";

export enum UserTaskStatusEnum {
  STARTED   = 'STARTED',
  PENDING   = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface IUserTask extends IBaseModel {
  id:            string
  enabled:       boolean
  password:      string
  points:        number
  status:        UserTaskStatusEnum
  start_at:      number|null
  end_at:        number|null
  user_id:       string
  user_name:     string
  user_role:     UserRoleEnum
  task_id:       string
  task_name:     string
  teacher_id:    string|null
  teacher_name:  string|null
  category_id:   string|null
  category_name: string|null
  course_id:     string|null
  course_name:   string|null
}

export class UserTask extends BaseModel<IUserTask> implements IUserTask {
  public get id(): string { return `${this.user_id}_${this.task_id}` }

  public enabled:       boolean            = false
  public password:      string             = ''
  public points:        number             = 0
  public status:        UserTaskStatusEnum = UserTaskStatusEnum.PENDING
  public start_at:      number|null        = null
  public end_at:        number|null        = null
  public user_id:       string             = ''
  public user_name:     string             = ''
  public user_role:     UserRoleEnum       = UserRoleEnum.TEACHER
  public task_id:       string             = ''
  public task_name:     string             = ''
  public teacher_id:    string|null        = null
  public teacher_name:  string|null        = null
  public category_id:   string|null        = null
  public category_name: string|null        = null
  public course_id:     string|null        = null
  public course_name:   string|null        = null

  constructor(data?: Partial<IUserTask>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      payload: {
        id: this.id,
      },
      rules: {
        id: [required(), string()],
      },
    })
  }

  public fromPayload(data?: Partial<IUserTask> | undefined): this {
    if (data) {
      if (data.enabled       !== undefined) this.enabled       = data.enabled
      if (data.password      !== undefined) this.password      = data.password
      if (data.points        !== undefined) this.points        = data.points
      if (data.status        !== undefined) this.status        = data.status
      if (data.start_at      !== undefined) this.start_at      = data.start_at
      if (data.end_at        !== undefined) this.end_at        = data.end_at
      if (data.user_id       !== undefined) this.user_id       = data.user_id
      if (data.user_name     !== undefined) this.user_name     = data.user_name
      if (data.user_role     !== undefined) this.user_role     = data.user_role
      if (data.task_id       !== undefined) this.task_id       = data.task_id
      if (data.task_name     !== undefined) this.task_name     = data.task_name
      if (data.teacher_id    !== undefined) this.teacher_id    = data.teacher_id
      if (data.teacher_name  !== undefined) this.teacher_name  = data.teacher_name
      if (data.category_id   !== undefined) this.category_id   = data.category_id
      if (data.category_name !== undefined) this.category_name = data.category_name
      if (data.course_id     !== undefined) this.course_id     = data.course_id
      if (data.course_name   !== undefined) this.course_name   = data.course_name
    }

    return this
  }

  public toPayload(): Partial<IUserTask> {
    return {
      enabled:       this.enabled,
      password:      this.password,
      points:        this.points,
      status:        this.status,
      start_at:      this.start_at,
      end_at:        this.end_at,
      user_id:       this.user_id,
      user_name:     this.user_name,
      user_role:     this.user_role,
      task_id:       this.task_id,
      task_name:     this.task_name,
      teacher_id:    this.teacher_id,
      teacher_name:  this.teacher_name,
      category_id:   this.category_id,
      category_name: this.category_name,
      course_id:     this.course_id,
      course_name:   this.course_name,
    }
  }

  public get start_at_expired(): boolean {
    return this.start_at != null && Date.now() >= this.start_at
  }

  public get end_at_expired(): boolean {
    return this.end_at != null && Date.now() >= this.end_at
  }

  public toSelectOption(): ISelectOption {
    return {
      name:  this.user_name,
      value: this,
    }
  }

  public get is_pending():   boolean { return this.status == UserTaskStatusEnum.PENDING }
  public get is_started():   boolean { return this.status == UserTaskStatusEnum.STARTED }
  public get is_completed(): boolean { return this.status == UserTaskStatusEnum.COMPLETED }
}
