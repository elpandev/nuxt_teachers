import { BaseValue, type IBaseValue } from "./value";

export interface IBaseModel extends IBaseValue {

}

export abstract class BaseModel<T extends IBaseModel = any> extends BaseValue<T> {
  public exists: boolean = false

  public initial?: T

  public cursor(order_by?: string): string | undefined {
    throw new Error("Method not implemented.")
  }

  public has_changed(): boolean {
    throw new Error("Method not implemented.")
  }
}
