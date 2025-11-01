# Tutorial de Instalação do Sistema

## 1. Pré-requisitos
Antes de instalar e executar o sistema, certifique-se de que os seguintes softwares estejam instalados:

- **Node.js** (versão 18 ou superior)

- **npm** (geralmente instalado junto com Node.js) ou **yarn**

- **Docker** e **Docker Compose** (para execução de containers)

- **Git** (para clonar o repositório)

- **Banco de dados:** PostgreSQL ou MySQL (conforme especificado)

- **Editor de código:** VS Code ou outro de sua preferência

## 2. Clonando o repositório

Clone o repositório do sistema:

```
git clone https://github.com/Henrriky/bs-beauty.git
cd bs-beauty
```

## 3. Configuração do ambiente back-end

1 - A partir do diretório ```source```, acesse o diretório ```back-end``` e crie o arquivo de variáveis de ambiente a partir do modelo fornecido:

```
cp .env.example .env
```

2 - Edite o arquivo ```.env``` para incluir as credenciais do banco de dados e outras configurações necessárias

```
PORT="..."

DATABASE_URL="..."          # use a senha definida no docker-compose.yaml
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GOOGLE_REDIRECT_URI="..."
GOOGLE_SCOPES="..."

JWT_SECRET="..."
JWT_EXPIRES_IN="..."
JWT_REFRESH_EXPIRES_IN="..."

EMAIL_USER="..."
EMAIL_PASSWORD="..."
EMAIL_PROVIDER="..."
```

## 4. Instalação das dependências

Nos diretórios ```back-end``` e ```front-end``` do projeto, execute:

```
npm install
# ou
yarn install
```

## 5. Inicializando o banco de dados

1 - Inicie o banco de dados através do comando:

```
docker compose -f docker-compose.dev.yaml up -d
```

2 - Com o banco de dados sendo executado, aplique as *migrations* do Prisma com o seguinte comando:

```
npx prisma migrate dev
```

## 6. Executando o sistema (em modo desenvolvimento)

Para executar o sistema, utilize os seguintes comandos:

1 - No diretório ```back-end```:

```
npm run start:dev
# ou
yarn start:dev
```

2 - No diretório ```front-end```:

```
npm run dev
# ou
yarn dev
```

## 7. Testes do sistema

### Testes Unitários

Para executar os arquivos de testes unitários do projeto, use o comando:

```
npm run test:unit
```

### Testes de Integração

Para executar os arquivos de testes de integração do projeto, siga o passo-a-passo abaixo:

1 - Suba o container do banco de dados de teste.
```
npm run db:test:up
```

2 - Execute as migrations do prisma no banco de dados de teste.
```
npm run prisma:test:push
```

3 - Execute os arquivos de testes de integração no projeto.
```
npm run test:int
```
