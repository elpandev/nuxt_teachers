interface Number {
  toFinancial(): string
  toBase(base: number, max: number): number
  toPercent(max: number): number
}

Number.prototype.toFinancial = function (this: number): string {
  return this.toFixed(2)
}

Number.prototype.toBase = function (this: number, base: number, max: number): number {
  if (!(max > 0)) { return 0 }

  return (this * base) / max
}

Number.prototype.toPercent = function (this: number, max: number): number {
  if (!(this > 0 && max > 0)) { return 0 }

  return (this / max) * 100 
}
