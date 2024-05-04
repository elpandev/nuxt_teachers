import { BaseValue, type IBaseValue } from "./value";

export interface IBaseModel extends IBaseValue {

}

export abstract class BaseModel<T extends IBaseModel = any> extends BaseValue<T> {
  public exists: boolean = false
}
