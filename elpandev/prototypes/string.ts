interface String {
  isEmpty(): boolean
  isNotEmpty(): boolean
  clean(): string
  removeAccents(): string
  alphaNumeric(): string
  url(): string
  trigram(_prefix?: string): { [key: string]: true }
  id(): string
}

String.prototype.isEmpty = function (this: string): boolean {
  return this.length <= 0
}

String.prototype.isNotEmpty = function (this: string): boolean {
  return !this.isEmpty()
}

String.prototype.clean = function (this: string): string {
  return this
    .removeAccents()
    .replace(/[^a-zA-Z0-9 \_\-]/g, '')
}

String.prototype.alphaNumeric = function (this: string): string {
  return this
    .removeAccents()
    .replace(/[^a-zA-Z0-9]/g, '')
}

String.prototype.removeAccents = function (this: string): string {
  return this
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

String.prototype.url = function (this: string): string {
  return this
    .clean()
    .replace(/[ \_\-]+/g, '-')
    .toLowerCase()
}

String.prototype.trigram = function (this: string, _prefix?: string): { [key: string]: true } {
  const map    = {}
  const text   = this.clean().removeAccents().replace(/[ -]+/g, '').toLowerCase()
  const length = 3;
  const prefix = _prefix ? `${_prefix}_` : ''

  for (let i = 0; i <= text.length - length; i++) {
    Object.assign(map, { [`${prefix}${text.substring(i, i + length)}`]: true })
  }

  return map;
}

String.prototype.id = function (this: string): string {
  const chars = this
    .clean()
    .replace(/[ \_\-]+/g, '')
    .split('')

  return chars.reduce((acc, value) => acc + (Math.random() > 0.6 ? value.toUpperCase() : value.toLowerCase()), '')
}