export class Runner {
  public is_running: boolean = false
  
  public async execute(request: () => Promise<void>): Promise<void> {
    if (this.is_running) return

    this.is_running = true

    await request()

    this.is_running = false
  }
}
