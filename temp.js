function generateCombinations(strings) {
  const combinations = [];
  const generate = (prefix, array) => {
      for (let i = 0; i < array.length; i++) {
          combinations.push(prefix.concat(array[i]));
          generate(prefix.concat(array[i]), array.slice(i + 1));
      }
  }
  generate([], strings);
  return combinations;
}

// Example usage:
const strings = ["apple", "banana", "orange", "coconut"];
const combinations = generateCombinations(strings);
console.log(combinations);
