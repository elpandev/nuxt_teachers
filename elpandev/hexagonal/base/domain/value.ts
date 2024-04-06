import { code_id } from "@/elpandev/utils/methods/code_id";
import type { Validator } from "@/elpandev/validator";

export interface IBaseValue {
  
}

export abstract class BaseValue<T extends IBaseValue = any> implements IBaseValue {
  public validate(): Validator {
    throw new Error("Method not implemented.");
  }
  
  public copyWith(data?: Partial<T>): typeof this {
    const model: typeof this = Object.create(
      Object.getPrototypeOf(this), 
      Object.getOwnPropertyDescriptors(this) 
    ) 

    return model.fromPayload(data) as any
  }

  abstract fromPayload(data?: Partial<T>): typeof this
  abstract toPayload(): Partial<T>
}
