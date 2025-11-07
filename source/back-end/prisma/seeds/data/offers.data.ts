export interface OfferSeedData {
  estimatedTime: number
  price: number
  isOffering: boolean
  serviceName: string
  professionalName: string
}

export function generateOffersData(): OfferSeedData[] {
  const offers: OfferSeedData[] = []

  offers.push({
    estimatedTime: 60,
    price: 80.0,
    isOffering: true,
    serviceName: 'Corte Feminino',
    professionalName: 'Henrique Santiago Pires'
  })

  offers.push({
    estimatedTime: 45,
    price: 75.0,
    isOffering: true,
    serviceName: 'Corte Feminino',
    professionalName: 'Henrriky Jhonny'
  })

  offers.push({
    estimatedTime: 45,
    price: 40.0,
    isOffering: true,
    serviceName: 'Manicure Completa',
    professionalName: 'Alyson Fumagalli'
  })

  offers.push({
    estimatedTime: 50,
    price: 45.0,
    isOffering: true,
    serviceName: 'Manicure Completa',
    professionalName: 'Eliel da Silva'
  })

  offers.push({
    estimatedTime: 30,
    price: 35.0,
    isOffering: true,
    serviceName: 'Design de Sobrancelhas',
    professionalName: 'Henrique Santiago Pires'
  })

  offers.push({
    estimatedTime: 25,
    price: 30.0,
    isOffering: true,
    serviceName: 'Design de Sobrancelhas',
    professionalName: 'Alyson Fumagalli'
  })

  return offers
}
