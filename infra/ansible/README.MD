Perfeito! Aqui está o manual atualizado com suas alterações:

---

# BS-Beauty Deployment com Ansible

## 1. **Objetivo**

Este repositório contém **playbooks Ansible** para configurar servidores públicos e privados, subir Nginx com SSL, e rodar o aplicativo `bs-beauty` via Docker.

* **Servidor público**: Nginx + SSL + proxy para back-end.
* **Servidor privado**: Docker + back-end e banco de dados.

O deploy pode ser feito **localmente** ou via **GitHub Actions**, usando secrets para variáveis sensíveis.

---

## 2. **Estrutura de diretórios**

```
ansible/
├─ inventories/
│  ├─ dynamic.yaml          # Inventory dinâmico, usa env vars
├─ group_vars/
│  ├─ public.yml            # Variáveis do host público (Nginx, SSL)
│  ├─ private.yml           # Variáveis do host privado (app, .env)
├─ templates/
│  ├─ nginx.conf.j2         # Template do Nginx
├─ public.yaml              # Playbook para Nginx
├─ private.yaml             # Playbook para app e Docker
```

---

## 3. **Pré-requisitos**

* Servidores Ubuntu/Debian com acesso SSH
* Python 3.8+ e Ansible 2.14+ instalado na máquina de controle

---

## 4. **Variáveis e Secrets**

O inventory usa **environment variables** para evitar expor dados sensíveis:

| Variável           | Descrição                                             |
| ------------------ | ----------------------------------------------------- |
| `SSH_USER`         | Usuário SSH do host                                   |
| `SSH_KEY_PATH`     | Caminho para a chave privada SSH                      |
| `PUBLIC_HOST`      | IP ou hostname do servidor público                    |
| `PRIVATE_HOST`     | IP ou hostname do servidor privado                    |
| `SSL_CERT_PATH`    | Caminho para o arquivo do certificado SSL (fullchain) |
| `SSL_KEY_PATH`     | Caminho para o arquivo da chave privada SSL           |
| `REPO_BRANCH`      | Branch do Git a ser deployado (default: `main`)       |
| `BACKEND_ENV_PATH` | Caminho local do `.env` do back-end                   |

> **Observação**: agora não usamos mais `SSL_CERT` e `SSL_KEY` com conteúdo direto, mas sim o caminho para os arquivos (`SSL_CERT_PATH` e `SSL_KEY_PATH`).

---

## 5. **Uso local**

1. Clone o repositório:

```bash
git clone https://github.com/Henrriky/bs-beauty.git
cd bs-beauty/ansible
```

2. Exporte as variáveis de ambiente **necessárias**:

```bash
export SSH_USER=ubuntu
export SSH_KEY_PATH=~/.ssh/id_rsa
export PUBLIC_HOST=192.168.0.2
export PRIVATE_HOST=192.168.0.1
export SSL_CERT_PATH=/home/ubuntu/certs/fullchain.pem
export SSL_KEY_PATH=/home/ubuntu/certs/privkey.pem
export REPO_BRANCH=main
export BACKEND_ENV_PATH=/home/ubuntu/bs-beauty/backend/.env
```

> **Observação**: Você também pode utilizar o comando para automatizar o export das variáveis de ambiente: `export $(grep -v '^#' .env | sed -E 's/\s*#.*//' | sed -E 's/ *= */=/g' | xargs)`

3. Rodar playbook do servidor público (Nginx):

```bash
ansible-playbook -i inventories/dynamic.yaml public.yaml
```

4. Rodar playbook do servidor privado (Docker + app):

```bash
ansible-playbook -i inventories/dynamic.yaml private.yaml
```

> O playbook privado vai:
>
> * Instalar Docker e Git
> * Clonar o repositório
> * Copiar o `.env` do back-end
> * Puxar a imagem Docker mais recente
> * Subir os containers via `docker-compose.prod.yaml`

---

## 6. **Uso no GitHub Actions (CI/CD)**

No pipeline, defina os **secrets**:

* `SSH_USER`, `SSH_KEY_PATH`, `PUBLIC_HOST`, `PRIVATE_HOST`
* `SSL_CERT_PATH`, `SSL_KEY_PATH`
* `REPO_BRANCH`, `BACKEND_ENV_PATH`

No workflow do GitHub Actions, **exporte as variáveis de ambiente** a partir dos secrets:

```bash
export SSH_USER=${{ secrets.SSH_USER }}
export SSH_KEY_PATH=${{ secrets.SSH_KEY_PATH }}
export PUBLIC_HOST=${{ secrets.PUBLIC_HOST }}
export PRIVATE_HOST=${{ secrets.PRIVATE_HOST }}
export SSL_CERT_PATH=${{ secrets.SSL_CERT_PATH }}
export SSL_KEY_PATH=${{ secrets.SSL_KEY_PATH }}
export REPO_BRANCH=${{ secrets.REPO_BRANCH }}
export BACKEND_ENV_PATH=${{ secrets.BACKEND_ENV_PATH }}
```

O workflow irá:

1. Setar as env vars a partir dos secrets
2. Rodar `ansible-playbook` para atualizar servidores
3. Garantir que Nginx e app estão rodando com a última versão da imagem

---

## 7. **Considerações**

* Nginx testa a configuração antes de recarregar; se falhar, não reinicia o serviço.
* Certificados SSL devem ser mantidos **fora do repositório**, preferencialmente no **GitHub Secret**.
* Para qualquer mudança em paths de certificados ou variáveis sensíveis, atualize as env vars antes de rodar os playbooks.