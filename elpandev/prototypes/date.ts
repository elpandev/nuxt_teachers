interface IDateParams {
  year:   number
  month:  number
  day:    number
  hour:   number
  minute: number
  second: number
}

interface Date {
  replace(params: Partial<IDateParams>): Date
  add(params: Partial<IDateParams>): Date
  toInput(): string
  addDays(days: number): Date
  addMinutes(minutes: number): Date
  removeMinutes(minutes: number): Date
  format(format: string): string
  firstDateWeek(): Date
  firstDateMonth(): Date
  lastDateWeek(): Date
  lastDateMonth(): Date
  lastDateMonth(): Date
}

Date.prototype.replace = function (this: Date, params: Partial<IDateParams>): Date {
  const date = new Date(this)

  if (params.year   !== undefined) date.setFullYear(params.year);
  if (params.month  !== undefined) date.setMonth   (params.month - 1);
  if (params.day    !== undefined) date.setDate    (params.day);
  if (params.hour   !== undefined) date.setHours   (params.hour);
  if (params.minute !== undefined) date.setMinutes (params.minute);
  if (params.second !== undefined) date.setSeconds (params.second);

  return date
}

Date.prototype.add = function (this: Date, params: Partial<IDateParams>): Date {
  const date = new Date(this)

  if (params.year   !== undefined) date.setFullYear(date.getFullYear() + params.year);
  if (params.month  !== undefined) date.setMonth   (date.getMonth()    + params.month);
  if (params.day    !== undefined) date.setDate    (date.getDate()     + params.day);
  if (params.hour   !== undefined) date.setHours   (date.getHours()    + params.hour);
  if (params.minute !== undefined) date.setMinutes (date.getMinutes()  + params.minute);
  if (params.second !== undefined) date.setSeconds (date.getSeconds()  + params.second);

  return date
}

Date.prototype.toInput = function (this: Date): string {
  const year    = this.getFullYear()
  const month   = (this.getMonth() + 1).toString().padStart(2, '0')
  const day     = this.getDate().toString().padStart(2, '0')
  const hours   = this.getHours().toString().padStart(2, '0')
  const minutes = this.getMinutes().toString().padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

Date.prototype.addMinutes = function (this: Date, minutes: number): Date {
  const date = new Date(this)

  date.setMinutes(date.getMinutes() + minutes);

  return date
}

Date.prototype.addDays = function (this: Date, days: number): Date {
  const date = new Date(this)

  date.setDate(date.getDate() + days);

  return date
}

Date.prototype.removeMinutes = function (this: Date, minutes: number): Date {
  const date = new Date(this)

  date.setMinutes(date.getMinutes() - minutes);

  return date
}

Date.prototype.format = function (this: Date, format: string): string {
  const year    = this.getFullYear().toString()
  const month   = (this.getMonth() + 1).toString()
  const day     = this.getDate().toString()
  const hours   = this.getHours().toString()
  const minutes = this.getMinutes().toString()

  return format
    .replace('YYYY', year)
    .replace('MM', month.padStart(2, '0'))
    .replace('DD', day.padStart(2, '0'))
    .replace('hh', hours.padStart(2, '0'))
    .replace('mm', minutes.padStart(2, '0'))
}

Date.prototype.firstDateMonth = function (this: Date): Date {
  return new Date(this.getFullYear(), this.getMonth(), 1);
}

Date.prototype.lastDateMonth = function (this: Date): Date {
  return new Date(this.getFullYear(), this.getMonth() + 1, 0);
}

Date.prototype.firstDateWeek = function (this: Date): Date {
  const diff = this.getDate() - this.getDay() + (this.getDay() === 0 ? -6 : 1);

  return new Date(new Date(this).setDate(diff));
}

Date.prototype.lastDateWeek = function (this: Date): Date {
  const diff = this.getDate() - (this.getDay() - 1) + 6;

  return new Date(new Date(this).setDate(diff));
}
