export class TextCalculator {
  public result: number = 0

  constructor(text: string, values?: Record<string, number>) {
    this.result = this.calculate(this.replace(text, values))
  }

  private replace(text: string, values?: Record<string, number>): string {
    if (values == undefined) { return text }
    
    const keys = Object.keys(values)

    for (let i = 0; i < 10; i++) {
      for (const [key, value] of Object.entries(values)) {
        text = text.replaceAll(key, value.toString())
      }

      if (!keys.some(key => text.includes(key))) break
    }

    return text
  }

  private calculate(text: string): number {
    try {
      text = this.calculate_group(text);
      text = this.calculate_replace_division(text);
      text = this.calculate_replace_multiplication(text);

      return this.calculate_sum(text);
    }

    catch (error) {}

    return parseFloat(text);
  }

  private calculate_group(text: string): string {
    const regex = new RegExp(/\([^\(\)]+\)/)

    while (regex.test(text)) {
      try {
        const match = regex.exec(text)![0]

        text = text.replaceAll(match, this.calculate(match.substring(1, match.length - 1)).toString());
      }
      catch (error) {}
    }

    return text;
  }

  //#region sum

  private calculate_sum(text: string): number {
    const regex = new RegExp(/^[\+-\d\.]+$/)

    if (!regex.test(text)) { return 0 }

    text = text
      .replaceAll('+', ',+')
      .replaceAll('-', ',-');

    return text
      .split(',')
      .reduce((total, value) => total + parseFloat(value), 0)
  }

  //#endregion
  //#region multiplication

  private calculate_replace_multiplication(text: string) {
    const elements        = text.split(new RegExp(/[-+/]/));
    const multiplications = elements.filter((element) => element.includes('*'));

    for (var element of multiplications) {
      text = text.replaceAll(element, this.calculate_text_multiplication(element).toFixed(2));
    }

    return text;
  }

  private calculate_text_multiplication(text: string): number {
    try {
      const elements = text.split('*')
  
      return elements.reduce((total, value) => parseFloat(value) * total, 1)
    }
  
    catch (error) {}

    return 0
  }

  //#endregion
  //#region division

  private calculate_replace_division(text: string) {
    const elements  = text.split(new RegExp(/[-+*]/));
    const divisions = elements.filter((element) => element.includes('/'));

    for (var element of divisions) {
      text = text.replaceAll(element, this.calculate_text_division(element).toFixed(2));
    }

    return text;
  }

  private calculate_text_division(text: string): number {
    try {
      const elements = text.split('/')

      let result = parseFloat(elements.shift() ?? '0')

      for (const element of elements) {
        result /= parseFloat(element)
      }
  
      return result
    }

    catch (error) {}

    return 0
  }

  //#endregion
}
