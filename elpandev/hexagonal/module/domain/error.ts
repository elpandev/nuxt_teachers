import { BaseError } from "../../base/domain/error";

export class ErrorMessage extends BaseError {
  constructor(public message: string) { super() }
}
