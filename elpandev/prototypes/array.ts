interface Array<T> {
  isEmpty(): boolean
  isNotEmpty(): boolean
  union(value: T): void
  remove(value: T): void
  removeWhere(predicate: (value: T) => boolean): void;
  replaceFirst(predicate: (value: T) => boolean, value: T): void
  replaceWhere(predicate: (value: T) => boolean, generate: () => T): void;
  chunks(limit: number): T[][]
  random(): T
  combinations(): string[][]
  first(): T|undefined
  last(): T|undefined
}

Array.prototype.isEmpty = function (this: Array<any>) {
  return this.length <= 0
};

Array.prototype.isNotEmpty = function (this: Array<any>) {
  return !this.isEmpty()
};

Array.prototype.remove = function (this: Array<any>, value: any) {
  let index: number = this.indexOf(value);

  while (index >= 0) {
    this.splice(index, 1);

    index = this.indexOf(value);
  }
};

Array.prototype.union = function (this: Array<any>, value: any) {
  const index = this.indexOf(value)

  if (index < 0) { this.push(value) }
};

Array.prototype.removeWhere = function<T>(this: Array<T>, predicate: (value: T) => boolean) {
  const elements = this.filter((e) => !predicate(e))

  this.splice(0)
  this.push(...elements)
};

Array.prototype.replaceFirst = function<T>(this: Array<any>, predicate: (value: T) => boolean, value: any) {
  const index: number = this.findIndex(predicate)

  if (index >= 0) this.splice(index, 1, value)
};

Array.prototype.replaceWhere = function<T>(this: Array<T>, predicate: (value: T) => boolean, generate: () => T) {
  for (let index = 0; index < this.length; index++) {
    const element = this[index];
    
    if (predicate(element)) {
      this[index] = generate()
    }
  }
};

Array.prototype.chunks = function<T>(this: Array<T>, limit: number) {
  const chunks: T[][] = [];
  
  for (let i = 0; i < this.length; i += limit) {
    chunks.push(this.slice(i, i + limit));
  }

  return chunks
};

Array.prototype.random = function (this: Array<any>) {
  return this[Math.floor(Math.random() * this.length)]
};

Array.prototype.combinations = function<T extends string>(this: Array<T>) {
  const elements:     string[]   = JSON.parse(JSON.stringify(this))
  const combinations: string[][] = [];

  elements.sort((a, b) => a.localeCompare(b))

  const generate = (prefix: string[], array: string[]) => {
    for (let i = 0; i < array.length; i++) {
      combinations.push(prefix.concat(array[i]));

      generate(prefix.concat(array[i]), array.slice(i + 1));
    }
  }

  generate([], elements);

  return combinations;
}

Array.prototype.first = function (this: Array<any>) {
  return this[0]
};

Array.prototype.last = function (this: Array<any>) {
  return this[this.length - 1]
};
