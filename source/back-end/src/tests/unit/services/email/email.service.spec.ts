import { beforeEach, describe, expect, it, vi } from 'vitest'

const sendMailMock = vi.fn()

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: sendMailMock
    }))
  }
}))

async function getEmailService () {
  const { EmailService } = await import('@/services/email/email.service')
  return new EmailService()
}

describe('EmailService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sendMailMock.mockResolvedValue({ messageId: 'test-message-id' })
  })

  describe('sendVerificationCode', () => {
    it('should send registration verification code', async () => {
      const emailService = await getEmailService()
      const params = {
        to: 'user@example.com',
        code: '123456',
        expirationCodeTime: 600,
        purpose: 'register' as const
      }

      const result = await emailService.sendVerificationCode(params)

      expect(result).toEqual({ messageId: 'test-message-id' })
      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expect.stringContaining('BS BEAUTY'),
          to: 'user@example.com',
          subject: 'Confirme seu cadastro'
        })
      )
    })
  })

  describe('sendAppointmentConfirmed', () => {
    it('should send appointment confirmation email', async () => {
      const emailService = await getEmailService()
      const params = {
        to: 'customer@example.com',
        customerName: 'João Silva',
        professionalName: 'Maria Santos',
        serviceName: 'Corte de Cabelo',
        appointmentDateISO: '2024-03-15T14:30:00.000Z'
      }

      const result = await emailService.sendAppointmentConfirmed(params)

      expect(result).toEqual({ messageId: 'test-message-id' })
    })
  })

  describe('sendAppointmentCreated', () => {
    it('should send appointment created notification', async () => {
      const emailService = await getEmailService()
      const params = {
        to: 'professional@example.com',
        professionalName: 'Dr. Carlos',
        customerName: 'Ana Lima',
        serviceName: 'Consulta',
        appointmentDateISO: '2024-04-20T10:00:00.000Z'
      }

      const result = await emailService.sendAppointmentCreated(params)

      expect(result).toEqual({ messageId: 'test-message-id' })
    })
  })

  describe('sendAppointmentCancelled', () => {
    it('should send cancellation email', async () => {
      const emailService = await getEmailService()
      const params = {
        to: 'professional@example.com',
        customerName: 'Pedro Costa',
        professionalName: 'Julia Ribeiro',
        serviceName: 'Massagem',
        appointmentDateISO: '2024-05-10T15:45:00.000Z',
        cancelledBy: 'customer' as const
      }

      const result = await emailService.sendAppointmentCancelled(params)

      expect(result).toEqual({ messageId: 'test-message-id' })
    })
  })

  describe('sendBirthday', () => {
    it('should send birthday email', async () => {
      const emailService = await getEmailService()
      const params = {
        to: 'customer@example.com',
        title: 'Feliz Aniversário!',
        message: 'Parabéns pelo seu dia especial!',
        customerName: 'Roberto Martins'
      }

      const result = await emailService.sendBirthday(params)

      expect(result).toEqual({ messageId: 'test-message-id' })
    })
  })
})
