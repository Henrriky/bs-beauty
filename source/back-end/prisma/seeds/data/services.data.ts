export interface ServiceSeedData {
  name: string
  description: string
  category: string
  status: 'APPROVED'
}

export function generateServicesData (): ServiceSeedData[] {
  return [
    {
      name: 'Corte Feminino',
      description: 'Corte de cabelo feminino com lavagem e finalização',
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
      name: 'Design de Sobrancelhas',
      description: 'Design e modelagem de sobrancelhas com pinça e cera',
      category: 'Sobrancelhas',
      status: 'APPROVED'
    }
  ]
}
