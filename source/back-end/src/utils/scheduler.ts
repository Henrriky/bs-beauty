/* eslint-disable @typescript-eslint/no-floating-promises */
import cron from 'node-cron'
import type { ScheduledTask } from 'node-cron'

type JobHandler = () => Promise<void> | void

export class Scheduler {
  private static readonly tasks = new Map<string, ScheduledTask>()

  static register (name: string, spec: string, timezone: string, handler: JobHandler) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (this.tasks.has(name)) return this.tasks.get(name)!

    const task = cron.schedule(
      spec,
      async () => {
        try {
          await handler()
        } catch (err) {
          console.error(`[cron:${name}] error`, err)
        }
      },
      { timezone }
    )

    this.tasks.set(name, task)

    return task
  }

  static stopAll () {
    for (const [name, task] of this.tasks) {
      try {
        task.stop()
        console.log(`[cron:${name}] stopped`)
      } catch (e) {
        console.error(`[cron:${name}] stop error`, e)
      }
    }
  }
}
