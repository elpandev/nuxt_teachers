interface IGenerateMultipleConstructor {
  length: number
}

export abstract class BaseFactory<T> {
  abstract generate(): T;

  public generate_multiple({ length }: IGenerateMultipleConstructor): T[] {
    const elements: T[] = []
    
    for (let index = 0; index < length; index++) {
      elements.push(this.generate())
    }

    return elements
  }
}
