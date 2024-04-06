import { Validator, required, string } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { Student, type IStudent } from "../../student/domain/model";
import { Task, type ITask } from "../../task/domain/model";
import type { ISelectOption } from "~/src/presentation/interfaces/select_option";

export enum StudentTaskStatusEnum {
  STARTED   = 'STARTED',
  PENDING   = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface IStudentTask extends IBaseModel {
  id:       string
  student:  Partial<IStudent>
  task:     Partial<ITask>
  start_at: number|null
  end_at:   number|null
  password: string
  points:   number
  status:   StudentTaskStatusEnum
}

export class StudentTask extends BaseModel<IStudentTask> implements IStudentTask {
  public id:       string = ''
  public student:  Student = new Student()
  public task:     Task = new Task()
  public start_at: number|null = null
  public end_at:   number|null = null
  public password: string = ''
  public points:   number = 0
  public status:   StudentTaskStatusEnum = StudentTaskStatusEnum.PENDING

  constructor(data?: Partial<IStudentTask>) {
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

  public fromPayload(data?: Partial<IStudentTask> | undefined): this {
    if (data) {
      if (data.id)       this.id       = data.id
      if (data.student)  this.student  = new Student(data.student)
      if (data.task)     this.task     = new Task(data.task)
      if (data.start_at) this.start_at = data.start_at
      if (data.end_at)   this.end_at   = data.end_at
      if (data.password) this.password = data.password
      if (data.points)   this.points   = data.points
      if (data.status)   this.status   = data.status
    }

    return this
  }

  public toPayload(): Partial<IStudentTask> {
    const payload: Partial<IStudentTask> = {}

    payload.id       = this.id
    payload.student  = this.student.toTaskRelation()
    payload.task     = this.task.toStudentRelation()
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
      name:  this.student.name,
      value: this,
    }
  }

  public get is_pending():   boolean { return this.status == StudentTaskStatusEnum.PENDING }
  public get is_started():   boolean { return this.status == StudentTaskStatusEnum.STARTED }
  public get is_completed(): boolean { return this.status == StudentTaskStatusEnum.COMPLETED }
}
