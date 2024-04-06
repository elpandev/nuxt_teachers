function random_seed(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'.split('')
  
  for (let i = 0; i < letters.length; i++) {
    const index = Math.floor(Math.random() * (i + 1));
    const temp  = letters[i]

    letters[i]     = letters[index]
    letters[index] = temp
  }

  return letters.join('')
}

export class CodeGenerator {
  public seed:        string
  public seed_length: number

  constructor(seed?: string) {
    this.seed = seed ?? random_seed()
    this.seed = Array.from(new Set(this.seed.split(''))).join('')

    this.seed_length = this.seed.length
  }

  /**
   * calculate the max number with which it can generate a unique alphanumeric code
   * @param length alphanumeric code length
   * @returns max number
   */
  public calculate_max_number(length: number): number {
    return Math.pow(this.seed_length, length)
  }

  /**
   * generate an alphanumeric code representation of a number validating the max number possible and not negative values
   * @param num number
   * @param length length
   * @returns alphanumeric code representation
   */
  public generate_with_validation(num: number, length: number = 7): string {
    const max_number = this.calculate_max_number(length)

    if (num <= 0) {
      throw new Error(`number must be greater than or equal to 1`)
    }

    if (num >= max_number) {
      throw new Error(`max number is: ${max_number}`)
    }

    return this.generate(num, length)
  }

  /**
   * generate an alphanumeric code representation of a number
   * @param num number
   * @param length length
   * @returns alphanumeric code representation
   */
  public generate(num: number, length: number = 7): string {
    let text = ''
    let curr = num - 1
    let a    = 0
  
    for (let i = 0; i < length; i++) {
      a    = curr % this.seed_length
      curr = Math.floor(curr / this.seed_length)
      text = `${this.seed.charAt(a)}${text}`
    }
  
    return text
  }
}
