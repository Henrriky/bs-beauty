import nodemailer from 'nodemailer'
import { VerificationPurpose } from '../use-cases/auth/code-validation.service'

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

class EmailService {
  async sendVerificationCode({
    to,
    code,
    expirationCodeTime,
    purpose
  }: {
    to: string,
    code: string,
    expirationCodeTime: number,
    purpose: VerificationPurpose
  }) {
    const subject = SUBJECTS[purpose]
    const expirationCodeTimeToMinutes = (expirationCodeTime / 60)
    const text = renderText(purpose, code, expirationCodeTimeToMinutes)
    const html = renderHtml(purpose, code, expirationCodeTimeToMinutes)

    const info = await transporter.sendMail({
      from: `"BS BEAUTY" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    })

    return { messageId: info.messageId }
  }

  async sendAppointmentConfirmed(params: {
    to: string
    customerName: string
    professionalName: string
    serviceName: string
    appointmentDateISO: string
  }) {
    const { to, customerName, professionalName, serviceName, appointmentDateISO } = params

    const dt = new Date(appointmentDateISO)
    const date = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const time = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })

    const subject = `Agendamento confirmado para o dia ${date} às ${time}`
    const text =
      `Olá, ${customerName || 'cliente'}! Seu agendamento de ${serviceName} com ` +
      `${professionalName || 'o profissional'} foi confirmado para ${date} às ${time}.`

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;max-width:520px;color:#111">
        <h2 style="margin:0 0 8px">Agendamento confirmado</h2>
        <p style="margin:0 0 12px">Olá, <b>${customerName || 'cliente'}</b>!</p>
        <p style="margin:0 0 12px">
          Seu agendamento de <b>${serviceName}</b> com <b>${professionalName || 'o profissional'}</b>
          foi confirmado para <b>${date}</b> às <b>${time}</b>.
        </p>
        <hr style="border:none;height:1px;background:#eee;margin:16px 0"/>
        <p style="color:#999;font-size:12px;margin:0">BS BEAUTY • Não responda a este e-mail.</p>
      </div>
    `

    const info = await transporter.sendMail({
      from: `"BS BEAUTY" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    })

    return { messageId: info.messageId }
  }
}

export { EmailService }


const SUBJECTS: Record<VerificationPurpose, string> = {
  register: 'Confirme seu cadastro',
  passwordReset: 'Redefinição de senha — seu código',
}

function renderText(purpose: VerificationPurpose, code: string, expMin: number) {
  switch (purpose) {
    case 'register':
      return `Olá! Seu código para concluir o cadastro é: ${code}. Ele expira em ${expMin} minutos.`
    case 'passwordReset':
      return `Olá! Você solicitou redefinição de senha. Seu código é: ${code}. Ele expira em ${expMin} minutos.`
  }
}

function renderHtml(purpose: VerificationPurpose, code: string, expMin: number) {
  const titleMap = {
    register: 'Confirme seu cadastro',
    passwordReset: 'Redefinição de senha',
    emailChange: 'Confirmar alteração de e-mail',
  } as const

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;max-width:480px">
    <h2 style="margin:0 0 8px">${titleMap[purpose]}</h2>
    <p style="margin:0 0 12px">
      ${purpose === 'register'
      ? 'Use o código abaixo para concluir seu cadastro.'
      : purpose === 'passwordReset'
        ? 'Use o código abaixo para redefinir sua senha.'
        : 'Use o código abaixo para confirmar a alteração de e-mail.'}
    </p>
    <div style="font-size:22px;font-weight:700;letter-spacing:2px;margin:12px 0">${code}</div>
    <p style="margin:0 0 12px">Este código expira em <b>${expMin} minuto${expMin > 1 ? 's' : ''}</b>.</p>
    <hr style="border:none;height:1px;background:#eee;margin:16px 0"/>
    <p style="color:#999;font-size:12px;margin:0">BS BEAUTY • Não responda a este e-mail.</p>
  </div>
  `
}