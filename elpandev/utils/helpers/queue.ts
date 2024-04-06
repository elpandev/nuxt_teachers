import { Runner } from "./runner"

export class Queue {
  public runner: Runner = new Runner()
  public tasks: Record<string, QueueTask> = {}

  public async execute() {
    await this.runner.execute(async () => {
      const task = Object.values(this.tasks)[0]
    
      if (task) {
        await task.execute()
    
        delete this.tasks[task.id]

        setTimeout(() => this.execute(), 1000);
      }
    })
  }

  public push(task: QueueTask) {
    this.tasks[task.id] = task

    this.execute()
  }
}

export class QueueTask {
  public id: string = Date.now().toString(32)
  public limit: number = 3

  constructor(public request: () => Promise<void>) {}

  public async execute(): Promise<void> {
    for (let index = 0; index < this.limit; index++) {
      try { await this.request() }
      
      catch (error) { continue }

      return
    }
  }
}
