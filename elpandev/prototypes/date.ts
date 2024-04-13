interface Date {
  toInput(): string
  addMinutes(minutes: number): Date
  removeMinutes(minutes: number): Date
  format(format: string): string
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

Date.prototype.removeMinutes = function (this: Date, minutes: number): Date {
  const date = new Date(this)

  date.setMinutes(date.getMinutes() - minutes);

  return date
}

Date.prototype.format = function (this: Date, format: string): string {
  const year    = this.getFullYear().toString()
  const month   = (this.getMonth() + 1).toString().padStart(2, '0')
  const day     = this.getDate().toString().padStart(2, '0')
  const hours   = this.getHours().toString().padStart(2, '0')
  const minutes = this.getMinutes().toString().padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('hh', hours)
    .replace('mm', minutes)
}
