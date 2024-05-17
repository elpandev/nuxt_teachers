import { BaseEvent } from "~/elpandev/hexagonal/base/domain/event";
import { Observer } from "~/elpandev/hexagonal/module/domain/observer";
import type { Token } from "~/src/presentation/models/token";

export const observer = new Observer()

export class EventAuthRegister extends BaseEvent {
  constructor(public token: Token) {
    super()
  }
}

export class EventAuthLogin extends BaseEvent {
  constructor(public token: Token) {
    super()
  }
}

export class EventAuthLogout extends BaseEvent {}
