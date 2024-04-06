import { CodeGenerator } from "@/elpandev/alphanumeric_code_generator"
import { nano_id } from "./nano_id"

export function code_id(seed: string): string {
  const generator = new CodeGenerator(seed)
  const code      = generator.generate(Date.now())
  const nanos     = nano_id(3).split('')
  const chars     = code.split('')

  for (let i = 0; i < nanos.length; i++) {
    chars.splice(i * 2, 0, nanos[i])
  }

  return chars.join('')
}
