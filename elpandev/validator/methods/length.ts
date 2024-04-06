export function length(value: any): number {
  try {
    if (typeof value == 'string') return (value as string).length
    if (typeof value == 'number') return (value as number)
    if (typeof value == 'object') return Object.keys(value).length
    if (Array.isArray(value))     return (value as Array<any>).length
  }

  catch (error) {}

  return Number.NEGATIVE_INFINITY
}
