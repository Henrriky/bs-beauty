// src/services/notifications-birthday.use-case.ts
import { notificationBus } from '@/events/notification-bus';
import type { CustomerRepository } from '@/repository/protocols/customer.repository';
import type { NotificationTemplateRepository } from '@/repository/protocols/notification-template.repository';
import { DateFormatter } from '@/utils/formatting/date.formatting.util';
import { renderTemplate } from '@/utils/formatting/placeholder.util';
import { NotificationChannel } from '@prisma/client';
import { DateTime } from 'luxon';

type RunParams = {
  runDate?: Date;
  timezone: string;
  dryRun?: boolean;
};

type JobResult = {
  runDate: string;
  tz: string;
  totalFound: number;
  enqueued: number;
  skippedPreferenceNone: number;
  errors: number;
};

const FALLBACK_TEMPLATE = {
  title: 'Feliz aniversário, {nome}! 🎉',
  body: 'Oi, {nome}! Hoje você completa {idade} anos. A {empresa} deseja um dia incrível!'
};

function ageOn(birthdate: Date, onDate: Date, tz: string): number {
  const b = DateTime.fromJSDate(birthdate).setZone(tz);
  let on = DateTime.fromJSDate(onDate).setZone(tz);

  if (b.month === 2 && b.day === 29 && !on.isInLeapYear && on.month === 2 && on.day === 28) {
    on = on.set({ day: 28 });
  }

  let age = on.year - b.year;
  const hasHadBirthdayThisYear =
    on.month > b.month || (on.month === b.month && on.day >= b.day);

  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

function sanitizeRendered(text: string): string {
  return text
    .split('\n')
    .map((l) => l.replace(/\s+$/g, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export class RunBirthdayJobUseCase {
  constructor(
    private readonly customerRepo: CustomerRepository,
    private readonly templateRepo: NotificationTemplateRepository
  ) { }

  public async execute(params: RunParams): Promise<JobResult> {
    const tz = params.timezone;
    const runDateLocal = (params.runDate
      ? DateTime.fromJSDate(params.runDate)
      : DateTime.now()
    ).setZone(tz);

    const companyName = process.env.COMPANY_NAME ?? 'BS BEAUTY';
    const year = runDateLocal.year;
    const runDateISO: string =
      runDateLocal.toISO() ?? runDateLocal.toFormat("yyyy-LL-dd'T'HH:mm:ssZZ");

    const customers = await this.customerRepo.findBirthdayCustomersOn(runDateLocal.toJSDate(), tz);

    const birthdayTemplate = (await this.templateRepo.findActiveByKey('BIRTHDAY')) ?? FALLBACK_TEMPLATE;

    let enqueued = 0;
    let skippedPreferenceNone = 0;
    let errors = 0;

    for (const customer of customers) {
      try {
        const preference = customer.notificationPreference ?? NotificationChannel.NONE;
        if (preference === NotificationChannel.NONE) {
          skippedPreferenceNone++;
          continue;
        }

        const values = {
          nome: customer.name!,
          idade: customer.birthdate ? ageOn(customer.birthdate, runDateLocal.toJSDate(), tz) : '',
          empresa: companyName,
          ano: String(year),
          data_aniversário: DateFormatter.formatBirthday(customer.birthdate)
        };

        const rendered = renderTemplate(birthdayTemplate.title, birthdayTemplate.body, values);
        const payload = {
          recipientId: customer.id,
          recipientType: 'CUSTOMER' as const,
          notificationPreference: preference,
          email: customer.email,
          marker: `birthday:${customer.id}:${year}`,
          title: rendered.title,
          message: sanitizeRendered(rendered.body),
          templateKey: 'BIRTHDAY' as const,
          year
        };

        if (params.dryRun) {
          continue;
        }

        notificationBus.emit('birthday.notify', { payload });
        enqueued++;
      } catch (e) {
        errors++;
      }
    }

    const result: JobResult = {
      runDate: runDateISO ?? runDateLocal.toISO(),
      tz,
      totalFound: customers.length,
      enqueued,
      skippedPreferenceNone,
      errors
    };

    return result;
  }
}

export default RunBirthdayJobUseCase;
