import { BaseRule, type RuleName } from "./rule"
import { Validate } from "./validate"

export type IErrors<T = any, U extends boolean = any> = Partial<{ [key in keyof T]: U extends true ? string : string[] }>
type IArrayRule<T, U> = { rules: U, data: T }

type IData<T = any, U = any> = {
  [key in keyof T]: T[key] extends Array<any>
    ? T[key][0] extends object
      ? IArrayRule<Partial<IData<T[key][0], U>>, U>
      : IArrayRule<U, U>
    : T[key] extends object
      ? IData<T[key], U>
      : U
}

type IRules<T = any>    = IData<T, BaseRule[]>
type IMessages<T = any> = Partial<IData<T, Partial<{ [key in RuleName]: string }>>>

interface IValidator<T = any, U extends boolean = any> {
  errors: IErrors<T, U>,
  validated: boolean
}

interface IValidatorConstructor<T = any, U extends boolean = any> {
  bail?:     U,
  payload:   T,
  rules:     IRules<T>,
  messages?: IMessages<T>,
}

function is_array(value: any) {
  return value.rules != undefined && value.data != undefined
}

export class Validator<T = any, U extends boolean = any> implements IValidator<T, U> {
  public errors: IErrors<T, U> = {}
  public validated: boolean = false

  constructor(private readonly data: IValidatorConstructor<T, U>) {
    for (const [key, value] of Object.entries<any>(this.data.rules as any)) {
      if (is_array(value)) {
        this.validate_array(key, 'rules')

        Array.isArray(value.data)
          ? this.validate_array_data_variable(key)
          : this.validate_array_data_payload(key)
      }

      else if (Array.isArray(value)) {
        this.validate_variable(key)
      }

      else if (typeof value == 'object') {
        this.validate_payload(key)
      }
    }
    
    this.validated = Object.keys(this.errors).length == 0
  }

  public toPayload() {
    return {
      validated: this.validated,
      errors:    this.errors,
      payload:   this.data.payload,
    }
  }

  private validate_variable(key: string) {
    const { validated, errors } = new Validate({
      bail:     this.data.bail,
      value:    (this.data.payload as any)[key],
      rules:    (this.data.rules as any)[key],
      messages: (this.data.messages as any)?.[key],
    })
    
    if (!validated) (this.errors as any)[key] = errors
  }

  private validate_payload(key: string) {
    const { validated, errors } = new Validator({
      bail:     this.data.bail,
      payload:  (this.data.payload as any)[key],
      rules:    (this.data.rules as any)[key],
      messages: (this.data.messages as any)?.[key],
    })

    if (!validated) {
      if ((this.errors as any)[key] == undefined) (this.errors as any)[key] = {}
      
      Object.assign((this.errors as any)[key], errors)
    }
  }

  private validate_array(key: string, value = 'rules' as 'rules'|'data') {
    const { validated, errors } = new Validate({
      bail:     this.data.bail,
      value:    (this.data.payload as any)[key],
      rules:    (this.data.rules as any)[key][value],
      messages: (this.data.messages as any)?.[key]?.[value],
    })
    
    if (!validated) {
      value == 'rules'
        ? (this.errors as any)[`_${key}`] = errors
        : (this.errors as any)[key] = errors
    }
  }

  private validate_array_data_variable(key: string) {
    const array = (this.data.payload as any)[key] as Array<any>

    for (let i = 0; i < array.length; i++) {
      const { validated, errors } = new Validate({
        bail:     this.data.bail,
        value:    array[i],
        rules:    (this.data.rules as any)[key].data,
        messages: (this.data.messages as any)?.[key]?.data,
      })
      
      if (!validated) {
        if ((this.errors as any)[key] == undefined) { (this.errors as any)[key] = {} }

        (this.errors as any)[key][i] = errors
      }
    }
  }

  private validate_array_data_payload(key: string) {
    const array = (this.data.payload as any)[key] as Array<any>

    for (let i = 0; i < array.length; i++) {
      const { validated, errors } = new Validator({
        bail:     this.data.bail,
        payload:  array[i],
        rules:    (this.data.rules as any)[key].data,
        messages: (this.data.messages as any)?.[key]?.data,
      })
  
      if (!validated) {
        if ((this.errors as any)[key] == undefined) { Object.assign(this.errors, { [key]: [] }) }

        ((this.errors as any)[key] as Array<any>).push(errors)
      }
    }
  }
}

export default Validator