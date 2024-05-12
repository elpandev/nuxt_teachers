import { Validator, required, string } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { User, type IUser } from "../../user/domain/model";
import { Task, type ITask } from "../../task/domain/model";
import type { ISelectOption } from "~/src/presentation/interfaces/select_option";

export enum UserTaskStatusEnum {
  STARTED   = 'STARTED',
  PENDING   = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface IUserTask extends IBaseModel {
  id:       string
  user:  Partial<IUser>
  task:     Partial<ITask>
  start_at: number|null
  end_at:   number|null
  password: string
  points:   number
  status:   UserTaskStatusEnum
}

export class UserTask extends BaseModel<IUserTask> implements IUserTask {
  public id:       string = ''
  public user:  User = new User()
  public task:     Task = new Task()
  public start_at: number|null = null
  public end_at:   number|null = null
  public password: string = ''
  public points:   number = 0
  public status:   UserTaskStatusEnum = UserTaskStatusEnum.PENDING

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
      if (data.id)       this.id       = data.id
      if (data.user)  this.user  = new User(data.user)
      if (data.task)     this.task     = new Task(data.task)
      if (data.start_at) this.start_at = data.start_at
      if (data.end_at)   this.end_at   = data.end_at
      if (data.password) this.password = data.password
      if (data.points)   this.points   = data.points
      if (data.status)   this.status   = data.status
    }

    return this
  }

  public toPayload(): Partial<IUserTask> {
    const payload: Partial<IUserTask> = {}

    payload.id       = this.id
    payload.user  = this.user.toTaskRelation()
    payload.task     = this.task.toUserRelation()
    payload.start_at = this.start_at
    payload.end_at   = this.end_at
    payload.password = this.password
    payload.points   = this.points
    payload.status   = this.status

    return payload
  }

  public get start_at_expired(): boolean {
    return this.start_at != null && Date.now() >= this.start_at
  }

  public get end_at_expired(): boolean {
    return this.end_at != null && Date.now() >= this.end_at
  }

  public toSelectOption(): ISelectOption {
    return {
      name:  this.user.name,
      value: this,
    }
  }

  public get is_pending():   boolean { return this.status == UserTaskStatusEnum.PENDING }
  public get is_started():   boolean { return this.status == UserTaskStatusEnum.STARTED }
  public get is_completed(): boolean { return this.status == UserTaskStatusEnum.COMPLETED }
}
