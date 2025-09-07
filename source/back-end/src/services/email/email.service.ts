import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

export async function sendVerificationCode(to: string, code: string) {
  const info = await transporter.sendMail({
    from: `"BS BEAUTY" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Código de Verificação',
    text: `Olá, Seu código é: ${code}. 
    Atente-se ao prazo de expiração: 10 minutos.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <p>Olá, seu código é: <b>${code}</b>. Atente-se ao prazo de expiração: 10 minutos.</p>
        <p style="margin:0;">&nbsp;</p> <!-- linha em branco “visível” -->
      </div>
    `,
  })

  return { messageId: info.messageId }
}

class EmailService {
  async sendVerificationCode({
    to,
    code,
    expirationCodeTime
  }: {
    to: string,
    code: string,
    expirationCodeTime: number
  }) {
    const expirationCodeTimeToMinutes = (expirationCodeTime / 60)
    const info = await transporter.sendMail({
      from: `"BS BEAUTY" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Código de Verificação',
      text: `Olá, Seu código é: ${code}. 
    Atente-se ao prazo de expiração: ${expirationCodeTimeToMinutes}.`,
      html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <p>Olá, seu código é: <b>${code}</b>. Atente-se ao prazo de expiração: ${expirationCodeTimeToMinutes} minutos.</p>
        <p style="margin:0;">&nbsp;</p>
      </div>
    `,
    })

    return { messageId: info.messageId }
  }
}

export { EmailService }