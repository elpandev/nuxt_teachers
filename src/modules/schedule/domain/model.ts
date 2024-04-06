import { Validator, required, string } from "@/elpandev/validator";
import { BaseModel, type IBaseModel } from "~/elpandev/hexagonal/base/domain/model";
import { ScheduleElement, type IScheduleElement, DayEnum } from "./values/element";

export interface ISchedule extends IBaseModel  {
  elements: Record<string, Partial<IScheduleElement>>
}

export class Schedule extends BaseModel<ISchedule> implements ISchedule {
  public elements: Record<string, ScheduleElement> = {};

  constructor(data?: Partial<ISchedule>) {
    super()

    this.fromPayload(data)
  }

  public validate(): Validator {
    return new Validator({
      bail: true,
      payload: {
        id: this.id,
      },
      rules: {
        id: [required(), string()],
      },
    })
  }

  public fromPayload(data?: Partial<ISchedule>): this {
    if (data) {
      if (data.id) this.id = data.id

      if (data.elements) {
        this.elements = Object.entries(data.elements)
          .reduce((data, [key, value]) => Object.assign(data, { [key]: new ScheduleElement({ id: key, ...value }) }), {})
      }
    }

    return this
  }

  public toPayload(): Partial<ISchedule> {
    const payload: Partial<ISchedule> = {}

    payload.id = this.id

    payload.elements = Object.entries(this.elements)
      .reduce((data, [key, value]) => Object.assign(data, { [key]: value.toPayload() }), {})

    return payload
  }

  public elementsByDay(day: DayEnum): ScheduleElement[] {
    return Object.values(this.elements)
      .filter(element => element.day == day)
  }
}
