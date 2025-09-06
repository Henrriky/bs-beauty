# BS Beauty - BACKEND

## Instalação do projeto

- Instalar o NodeJS na versão 20 ou superior;
- Clonar o repositório na sua máquina;
- Após clonar, rodar o comando `npm install` na raiz do projeto.
- Definir a variável de ambiente:
  - `DATABASE_URL`: URL do banco de dados a ser utilizado, colocar o valor da senha definido no `docker-compose.yaml`

## Execução do projeto

- Iniciar o banco de dados do docker compose através do comando `docker compose up -d`
- Com o banco de dados executando, aplicar as migrations do prisma com o seguinte comando: `npx prisma migrate dev`
- Para iniciar o projeto em modo desenvolvimento: `npm run start:dev`

## Testes

### Unitários

- Os testes unitários verificam o comportamento isolado de funções, classes e módulos
- Comando para a execução:
  - `npm run test:unit`: Executa todos os arquivos dos testes unitários no projeto, que seguem nomenclatura `*.spec.ts`
  - `npm run test:unit:watch`: Executa todos os arquivos de testes unitários do projeto, que seguem a nomenclatura `*.spec.ts`´, executando novamente toda vez que identificar mudanças nos arquivos dos testes.

### Integração

- Os testes de integração validam a interação entre múltiplos módulos e dependências (ex: banco de dados, APIs).
- Comandos para executar os testes de integração:
  - `npm run db:test:up`: Subir container do banco de dados de teste.
  - `npm run prisma:test:push`: Executar as migrations do prisma no banco de dados de teste.
  - `npm run test:int"`: Executa todos os arquivos dos testes de integração no projeto, que seguem a nomenclatura `*.integration.spec.ts`
  - `npm run test:int:watch"`: Executa todos os arquivos dos testes de integração no projeto, que seguem a nomenclatura `*.integration.spec.ts`, executando novamente toda vez que identificar mudanças nos arquivos dos testes.

## Recomendações para VSCODE

### Extensões

- Instalar a extensão "Prisma" 

### Configurações do usuário (opcional)

- CTRL + SHIFT + P para abrir o dropdown de configurações;
- Clicar na opção "Preferences: Oper User Settings (JSON)"
- Inserir as seguintes linhas de código: <br />
`"editor.formatOnSave": true` <br />
`"[prisma]": {
"editor.formatOnSaveMode": "file"
}`