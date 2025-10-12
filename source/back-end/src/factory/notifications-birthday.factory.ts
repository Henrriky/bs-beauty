import { PrismaCustomerRepository } from '@/repository/prisma/prisma-customer.repository';
import { PrismaNotificationTemplateRepository } from '@/repository/prisma/prisma-notification-template.repository';
import RunBirthdayJobUseCase from '@/jobs/run-birthday-job.use-case';

export function makeRunBirthdayJobUseCase() {
  const customerRepo = new PrismaCustomerRepository();
  const templateRepo = new PrismaNotificationTemplateRepository();
  const usecase = new RunBirthdayJobUseCase(customerRepo, templateRepo);

  return usecase
}
