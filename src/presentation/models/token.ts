import { BaseModel } from "~/elpandev/hexagonal/base/domain/model"

export interface IToken {
  access_token:  string
  refresh_token: string
  token_type:    string
  expires_in:    number
  created_at:    number
}

export class Token extends BaseModel<IToken> {
  public access_token:  string = ''
  public refresh_token: string = ''
  public token_type:    string = ''
  public expires_in:    number = 0

  public created_at: number = Date.now()

  constructor(data?: Partial<IToken>) {
    super()

    this.fromPayload(data)
  }

  public fromPayload(data?: Partial<IToken>): this {
    if (data) {
      if (typeof data.access_token  == 'string')  this.access_token  = data.access_token
      if (typeof data.refresh_token == 'string')  this.refresh_token = data.refresh_token
      if (typeof data.token_type    == 'string')  this.token_type    = data.token_type
      if (typeof data.expires_in    == 'number')  this.expires_in    = data.expires_in
      if (typeof data.created_at    == 'number')  this.created_at    = data.created_at
    }

    return this
  }

  public toPayload(): Partial<IToken> {
    return {
      access_token:  this.access_token,
      refresh_token: this.refresh_token,
      token_type:    this.token_type,
      expires_in:    this.expires_in,
      created_at:    this.created_at,
    }
  }

  public get expired(): boolean {
    return Date.now() >= (this.created_at + (this.expires_in * 1000))
  }
}
