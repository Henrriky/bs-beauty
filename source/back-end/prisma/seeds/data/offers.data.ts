export interface OfferSeedData {
  estimatedTime: number
  price: number
  isOffering: boolean
  serviceName: string
  professionalName: string
}

interface OfferConfig {
  professionalName: string
  serviceName: string
  estimatedTime: number
  price: number
}

const OFFERS_CONFIG: OfferConfig[] = [
  // Bruna Silva - Privileged Professional
  { professionalName: 'Bruna Silva', serviceName: 'Corte Feminino', estimatedTime: 60, price: 90.0 },
  { professionalName: 'Bruna Silva', serviceName: 'Manicure Completa', estimatedTime: 45, price: 45.0 },
  { professionalName: 'Bruna Silva', serviceName: 'Design de Sobrancelhas', estimatedTime: 30, price: 40.0 },

  { professionalName: 'Ana Carolina Santos', serviceName: 'Corte Feminino', estimatedTime: 60, price: 80.0 },
  { professionalName: 'Ana Carolina Santos', serviceName: 'Escova Progressiva', estimatedTime: 90, price: 120.0 },

  { professionalName: 'Camila Rodrigues Lima', serviceName: 'Manicure Completa', estimatedTime: 45, price: 40.0 },
  { professionalName: 'Camila Rodrigues Lima', serviceName: 'Manicure e Pedicure', estimatedTime: 60, price: 55.0 },

  { professionalName: 'Fernanda Almeida Souza', serviceName: 'Design de Sobrancelhas', estimatedTime: 30, price: 35.0 },
  { professionalName: 'Fernanda Almeida Souza', serviceName: 'Maquiagem Profissional', estimatedTime: 90, price: 150.0 },

  { professionalName: 'Henrique Santiago Pires', serviceName: 'Corte Feminino', estimatedTime: 60, price: 75.0 },
  { professionalName: 'Henrique Santiago Pires', serviceName: 'Design de Sobrancelhas', estimatedTime: 30, price: 30.0 },

  { professionalName: 'Henrriky Jhonny', serviceName: 'Corte Feminino', estimatedTime: 45, price: 70.0 },

  { professionalName: 'Alyson Fumagalli', serviceName: 'Manicure Completa', estimatedTime: 45, price: 38.0 },
  { professionalName: 'Alyson Fumagalli', serviceName: 'Design de Sobrancelhas', estimatedTime: 25, price: 28.0 },

  { professionalName: 'Eliel da Silva', serviceName: 'Manicure Completa', estimatedTime: 50, price: 42.0 },

  { professionalName: 'Isabella Ferreira Santos', serviceName: 'Extensão de Cílios', estimatedTime: 120, price: 200.0 },

  { professionalName: 'Larissa Mendes Costa', serviceName: 'Hidratação Capilar', estimatedTime: 90, price: 100.0 },

  { professionalName: 'Giovanna Camille', serviceName: 'Corte Feminino', estimatedTime: 60, price: 85.0 },
  { professionalName: 'Giovanna Camille', serviceName: 'Manicure Completa', estimatedTime: 45, price: 43.0 },

  { professionalName: 'Bruno Fischer', serviceName: 'Corte Feminino', estimatedTime: 55, price: 78.0 },
  { professionalName: 'Bruno Fischer', serviceName: 'Escova Progressiva', estimatedTime: 90, price: 115.0 }
]

export function generateOffersData(): OfferSeedData[] {
  return OFFERS_CONFIG.map(config => ({
    ...config,
    isOffering: true
  }))
}
