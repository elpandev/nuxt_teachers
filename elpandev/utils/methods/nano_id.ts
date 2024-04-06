import { customAlphabet } from 'nanoid'

export const nano_id = (length: number = 24, prefix: string = '') => {
  const id = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789')(length);

  return prefix.isNotEmpty()
    ? `${prefix}-${id.substring(0, length - prefix.length)}`
    : id
}

export const nano_time_id = (date: Date = new Date(), length: number = 18) => {
  const time = (10000000000 - date.getTime()/1000).toFixed()

  return nano_id(length, time)
}