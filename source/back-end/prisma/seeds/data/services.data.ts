export interface ServiceSeedData {
  name: string
  description: string
  category: string
  status: 'APPROVED'
}

export function generateServicesData(): ServiceSeedData[] {
  return [
    {
      name: 'Corte Feminino',
      description: 'Corte de cabelo feminino com lavagem e finalização',
      category: 'Cabelo',
      status: 'APPROVED'
    },
    {
      name: 'Escova Progressiva',
      description: 'Escova progressiva para redução de volume e alinhamento dos fios',
      category: 'Cabelo',
      status: 'APPROVED'
    },
    {
      name: 'Hidratação Capilar',
      description: 'Hidratação profunda para recuperação dos fios',
      category: 'Cabelo',
      status: 'APPROVED'
    },
    {
      name: 'Manicure Completa',
      description: 'Manicure completa com esmaltação tradicional',
      category: 'Unhas',
      status: 'APPROVED'
    },
    {
      name: 'Manicure e Pedicure',
      description: 'Manicure e pedicure completas com esmaltação',
      category: 'Unhas',
      status: 'APPROVED'
    },
    {
      name: 'Design de Sobrancelhas',
      description: 'Design e modelagem de sobrancelhas com pinça e cera',
      category: 'Sobrancelhas',
      status: 'APPROVED'
    },
    {
      name: 'Maquiagem Profissional',
      description: 'Maquiagem profissional para eventos e ocasiões especiais',
      category: 'Maquiagem',
      status: 'APPROVED'
    },
    {
      name: 'Extensão de Cílios',
      description: 'Aplicação de extensão de cílios fio a fio',
      category: 'Cílios',
      status: 'APPROVED'
    },
    {
      name: 'Corte Masculino',
      description: 'Corte de cabelo masculino com finalização',
      category: 'Cabelo',
      status: 'APPROVED'
    },
    {
      name: 'Pedicure Completa',
      description: 'Pedicure com tratamento de cutículas e esmaltação',
      category: 'Unhas',
      status: 'APPROVED'
    },
    {
      name: 'Design de Sobrancelhas com Henna',
      description: 'Design com aplicação de henna para realçar o formato',
      category: 'Sobrancelhas',
      status: 'APPROVED'
    },
    {
      name: 'Maquiagem Social',
      description: 'Maquiagem leve a média para eventos diurnos ou noturnos',
      category: 'Maquiagem',
      status: 'APPROVED'
    }
  ]
}
