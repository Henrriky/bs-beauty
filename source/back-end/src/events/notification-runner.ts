/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
type Job = () => Promise<void>

const queue: Job[] = []
let running = 0

const CONCURRENCY = Number(process.env.NOTIFY_CONCURRENCY ?? 3)
const RETRY_DELAY_MS = Number(process.env.NOTIFY_RETRY_DELAY_MS ?? 2000)

export function enqueue (job: Job) {
  queue.push(job)
  tick()
}

async function tick () {
  while (running < CONCURRENCY && queue.length > 0) {
    const job = queue.shift()!
    running++
    job()
      .catch(err => {
        console.error('[notify] job failed:', err?.message || err)
        setTimeout(() => { enqueue(job) }, RETRY_DELAY_MS)
      })
      .finally(() => {
        running--
        setImmediate(tick)
      })
  }
}

export async function drainAndExit () {
  await new Promise<void>(resolve => {
    const iv = setInterval(() => {
      if (queue.length === 0 && running === 0) {
        clearInterval(iv); resolve()
      }
    }, 150)
  })
}
