import { makeRunBirthdayJobUseCase } from "@/factory/notifications-birthday.factory"
import { Scheduler } from "@/utils/scheduler"

export const registerCronJobs = async () => {
  Scheduler.register('birthday-job', process.env.BIRTHDAY_CRON_SCHEDULE || '*/30 * * * * *', 'America/Sao_Paulo', async () => {
    const usecase = makeRunBirthdayJobUseCase()
    await usecase.execute({
      timezone: 'America/Sao_Paulo',
      dryRun: false,
    })
  })
}