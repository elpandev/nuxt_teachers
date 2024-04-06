import { code_id } from "~/elpandev/utils";
import { BaseValue, type IBaseValue } from "./value";

export interface IBaseModel extends IBaseValue {
  id: string
}

export abstract class BaseModel<T extends IBaseModel = any> extends BaseValue<T> implements IBaseModel {
  public id: string = code_id('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890')

  public exists: boolean = false
}
