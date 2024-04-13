import { Validator, required, string, min } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import type { ISelectOption } from "~/src/presentation/interfaces/select_option";

export enum EventTypeEnum {
  ATTENDANCE = 'ATTENDANCE',
  GRADE      = 'GRADE',
}

export interface IEvent extends IBaseModel  {
  type:        EventTypeEnum
  name:        string
  description: string
  date_at:     number
}

export function event_type_locale(type: EventTypeEnum): string {
  switch (type) {
    case EventTypeEnum.ATTENDANCE: return 'Asistencia';
    case EventTypeEnum.GRADE:      return 'Calificación';
  
    default: return 'Desconocido';
  }
}

export const event_type_options: ISelectOption[] = Object.values(EventTypeEnum)
  .map(value => ({ key: value, name: event_type_locale(value), value }))

export class Event extends BaseModel<IEvent> {
  public type: EventTypeEnum = EventTypeEnum.ATTENDANCE;
  public name:        string = '';
  public description: string = '';
  public date_at:     Date   = new Date;

  constructor(data?: Partial<IEvent>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      bail: true,
      payload: {
        id:   this.id,
        name: this.name,
      },
      rules: {
        id:   [required(), string()],
        name: [required(), string(), min(4)],
      },
    })
  }

  public fromPayload(data?: Partial<IEvent>): this {
    if (data) {
      if (data.id)          this.id          = data.id
      if (data.type)        this.type        = data.type
      if (data.name)        this.name        = data.name
      if (data.description) this.description = data.description
      if (data.date_at)     this.date_at     = new Date(data.date_at)
    }

    return this
  }

  public toPayload(): Partial<IEvent> {
    const payload: Partial<IEvent> = {}

    payload.id          = this.id
    payload.type        = this.type
    payload.name        = this.name
    payload.description = this.description
    payload.date_at     = this.date_at.getTime()

    return payload
  }

  public toAttendanceRelation(): Partial<IEvent> {
    return {
      id:   this.id,
      name: this.name,
    }
  }

  public toGradeRelation(): Partial<IEvent> {
    return {
      id:   this.id,
      name: this.name,
    }
  }

  public toSelectOption(): ISelectOption<Event> {
    return {
      name:  this.name,
      value: this,
    }
  }
}
