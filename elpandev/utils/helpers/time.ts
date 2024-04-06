export type IHours   = 0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23
export type IMinutes = IHours|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59
export type ISeconds = IMinutes

export type ITime = {
  hours:   IHours
  minutes: IMinutes
  seconds: ISeconds
}

export class Time implements ITime {
  public hours:   IHours   = 0
  public minutes: IMinutes = 0
  public seconds: ISeconds = 0

  constructor(data?: Partial<ITime>) {
    if (data) {
      if (data.hours)   { this.hours   = data.hours }
      if (data.minutes) { this.minutes = data.minutes }
      if (data.seconds) { this.seconds = data.seconds }
    }
  }

  public toFormat(format: string = 'h:m:s') {
    return format
      .replace(/h/g, this.hours  .toString().padStart(2, '0'))
      .replace(/m/g, this.minutes.toString().padStart(2, '0'))
      .replace(/s/g, this.seconds.toString().padStart(2, '0'))
  }

  public fromSeconds(seconds: number): this {
    if (seconds > 0) {
      const minutes = Math.floor(seconds / 60)
  
      this.seconds = Math.floor(seconds % 60) as ISeconds

      return this.fromMinutes(minutes)
    }

    return this
  }

  public fromMinutes(minutes: number): this {
    if (minutes > 0) {
      const hours = Math.floor(minutes / 60)
  
      this.minutes = Math.floor(minutes % 60) as IMinutes
      this.hours   = Math.floor(hours   % 24) as IHours
    }

    return this
  }
}
