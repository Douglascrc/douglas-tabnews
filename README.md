# douglas-tabnews

Implementação do projeto tabnews para o curso.dev

## Índice

- [Visão Geral](#visão-geral)
- [Instalação](#instalação)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Endpoints da API](#endpoints-da-api)
  - [Status](#status)
  - [Migrações](#migrações)
- [Infraestrutura](#infraestrutura)
- [Testes](#testes)
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

## Infraestrutura

- **Banco de Dados:** PostgreSQL (configurado via [docker compose](infra/compose.yaml)).
- **Migrações:** Gerenciadas com [node-pg-migrate](https://github.com/salsita/node-pg-migrate).
- **Scripts de Suporte:** Localizados na pasta `infra/scripts`.

## Testes

A suíte de testes utiliza Jest e testes integrados para verificar os endpoints e a integridade do sistema.

## Futuras Melhorias

- Implementar documentação interativa da API (por exemplo, utilizando Swagger).
- Melhorar logs e tratamento de erros.
- Adicionar mais testes unitários e de integração.
- Refinar a interface gráfica.
- Autenticação do usuário
- Integração com serviços de email

## Documentação Técnica

Para mais detalhes sobre a implementação dos endpoints, consulte os arquivos na pasta `pages/api/v1/` e a lógica dos testes na pasta `tests/integration/`.

---

Este documento será atualizado conforme o desenvolvimento do projeto evolua.
