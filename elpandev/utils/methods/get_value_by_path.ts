export function get_value_by_path(element: Record<string, any>|undefined, path: string): any {
  try {
    const items = path.split('.')
  
    let value = element
  
    for (const item of items) {
      value = value?.[item]
    }
  
    return value
  }

  catch (error) {}

  return undefined
}