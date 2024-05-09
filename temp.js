const days = 365
const percent = 0.055/365

let initial = 10000

console.log(initial * percent)

for (let index = 0; index < days; index++) {
  initial += initial * percent
}

console.log(initial)