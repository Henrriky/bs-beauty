# BS Beauty - BACKEND

## Instalação do projeto

- Instalar o NodeJS na versão 20 ou superior;
- Clonar o repositório na sua máquina;
- Após clonar, rodar o comando `npm install` na raiz do projeto.
- Definir a variável de ambiente:
  - `DATABASE_URL`: URL do banco de dados a ser utilizado, colocar o valor da senha definido no `docker-compose.yaml`

## Execução do projeto

- Iniciar o banco de dados do docker compose através do comando `docker compose up -d`
- Com o banco de dados executando, aplicar as migrations do prisma com o comando: `npx prisma migrate dev`

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