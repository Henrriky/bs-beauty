export const translateProfessionalAPIError = (details: string): string => {
  switch (details) {
    case 'Professional already exists.':
      return 'Funcionário já existe.'
    case 'Invalid email format.':
      return 'Formato de e-mail inválido.'
    default:
      return 'Ocorreu um erro. Por favor, verifique o campo de e-mail e tente novamente.'
  }
}
