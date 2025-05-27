# 📘 Padrão de Estrutura para Capítulos da Documentação (abnTeX2)

Este repositório utiliza **LaTeX** com o pacote **abnTeX2** para a elaboração da documentação do projeto. Para facilitar a colaboração entre os membros da equipe e manter a padronização, cada capítulo da documentação deve seguir uma estrutura específica.

## 📁 Estrutura de Diretórios e Arquivos

Cada capítulo da documentação terá:

- Um **diretório próprio**, nomeado com o número do capítulo e uma palavra-chave descritiva.
- Um **arquivo principal `.tex`**, com o conteúdo do capítulo.
- Arquivos `.tex` **auxiliares**, correspondentes às seções principais do capítulo.

### 📄 Exemplo para o Capítulo 3 – Gestão do Projeto

**Diretório:** `cap03-gestao/`

**Arquivos:**
- `03-00-gestao-projeto.tex` → Arquivo principal do capítulo.
- `03-01-organizacao-equipe.tex` → Seção 3.1.
- `03-02-metodologia-gestao.tex` → Seção 3.2.
- `03-03-repositorio-aplicacao.tex` → Seção 3.3.

As **subseções** (como 3.1.1, 3.2.1, 3.2.1.1 etc.) devem ser incluídas **dentro do arquivo da seção correspondente**.

### 📌 Como organizar o conteúdo

#### Estrutura esperada no `03-00-gestao-projeto.tex`:
```latex
\chapter{Gestão do Projeto}

\input{cap03-gestao/03-01-organizacao-equipe}
\input{cap03-gestao/03-02-metodologia-gestao}
\input{cap03-gestao/03-03-repositorio-aplicacao}
