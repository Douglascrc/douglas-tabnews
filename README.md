# douglas-tabnews

Implementação do projeto tabnews para o tabdouglas.com.br

## Índice

- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Endpoints da API](#endpoints-da-api)
  - [Status](#status)
  - [Migrações](#migrações)
- [Infraestrutura](#infraestrutura)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Futuras Melhorias](#futuras-melhorias)
- [Documentação Técnica](#documentação-técnica)

## Visão Geral

Esta aplicação foi desenvolvida utilizando Next.js, PostgreSQL e node-pg-migrate para gerenciar as migrações do banco de dados. Atualmente, a API possui endpoints para consultar o status dos serviços e gerenciar migrações.

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/Douglascrc/douglas-tabnews.git
   ```
2. Instale as dependências:
   ```bash
   npm i
   ```
3. Configure as variáveis de ambiente conforme o arquivo [`.env.development`](.env.development).

## Scripts Disponíveis

- **Desenvolvimento:**
  - `npm run prepar-env`: Levanta os serviços (Postgres, etc.) e executa as migrações.
  - `npm run dev`: Inicia o servidor de desenvolvimento do Next.js.
- **Testes:**
  - `npm test`: Executa a suíte de testes.
- **Migrações:**
  - `npm run migrations:up`: Executa migrações pendentes.
  - `npm run migrations:create`: Cria uma nova migração.

Veja o [package.json](package.json) para mais detalhes.

## Endpoints da API

### Status

- **GET /api/v1/status**  
  Retorna informações sobre o status atual da aplicação e detalhes do banco de dados.

### Migrações

- **GET /api/v1/migrations**  
  Lista as migrações pendentes (dry-run).

- **POST /api/v1/migrations**  
  Executa as migrações pendentes.
  - **Status 201:** Caso migrações tenham sido aplicadas.
  - **Status 200:** Caso não haja migrações pendentes.

### Autenticação

- **POST /api/v1/users**
  Cria um usuário no banco.
- **GET /api/v1/users/[username]**
  Recupera informações do usuário.
- **POST /api/v1/sessions**
  Permite que o usuario seja autenticado com um `session_id`.
- **GET /api/v1/user**
  Recupera os dados do usuario logado e renova o tempo de expiração da sessão.

## Infraestrutura

- **Banco de Dados:** PostgreSQL (configurado via [docker compose](infra/compose.yaml)).
- **Migrações:** Gerenciadas com [node-pg-migrate](https://github.com/salsita/node-pg-migrate).
- **Scripts de Suporte:** Localizados na pasta `infra/scripts`.

## Testes

A suíte de testes utiliza Jest e testes integrados para verificar os endpoints e a integridade do sistema.

## CI/CD

Este projeto utiliza o GitHub Actions para implementar práticas de Continuous Integration e Continuous Deployment, garantindo a qualidade e a consistência do código. As principais tarefas automatizadas são:

- **Testes Automatizados:**  
  O fluxo de trabalho em [`.github/workflows/tests.yaml`](.github/workflows/tests.yaml) executa a suíte de testes (Jest) sempre que há um pull request, garantindo que todas as funcionalidades funcionem conforme o esperado.

- **Análise de Código:**  
  Os workflows em [`.github/workflows/linting.yaml`](.github/workflows/linting.yaml) realizam verificações de formatação com Prettier, linting com ESLint e validação de commits usando Commitlint. Essas verificações auxiliam na manutenção de um padrão consistente de código.

Essas integrações ajudam a detectar automaticamente erros e problemas de formatação antes da integração de novas alterações na base de código. Assim, a equipe ganha agilidade e segurança durante o desenvolvimento.

## Futuras Melhorias

- Implementar documentação interativa da API (por exemplo, utilizando Swagger).
- Melhorar logs e tratamento de erros.
- Adicionar mais testes unitários e de integração.
- Refinar a interface gráfica.
- Integração com serviços de email

## Documentação Técnica

Para mais detalhes sobre a implementação dos endpoints, consulte os arquivos na pasta `pages/api/v1/` e a lógica dos testes na pasta `tests/integration/`.

---

Este documento será atualizado conforme o desenvolvimento do projeto evolua.
