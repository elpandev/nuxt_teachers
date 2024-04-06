import { Time } from "./time";

export type ITimer = {
  time: Time
}

export class Timer implements ITimer {
  private interval: any = 0

  constructor(public seconds: number = 0) {
    this.time.fromSeconds(seconds)
  }

  public run(): void {
    if (this.seconds > 0) {
      this.interval = setInterval(() => {
        this.seconds -= 1
  
        if (this.seconds <= 0) { this.cancel() }
      }, 1000)
    }
  }

  public cancel(): void {
    clearInterval(this.interval)
  }

  public toFormat(format?: string): string {
    return this.time.toFormat(format)
  }

  public get time():    Time    { return new Time().fromSeconds(this.seconds) }
  public get enabled(): boolean { return this.seconds > 0 }
}
