# Prompt Manager

Aplicação web para **criar, listar, buscar, editar e excluir prompts** de forma simples. O projeto segue uma arquitetura em camadas (domínio, aplicação, infraestrutura e interface) sobre **Next.js App Router**, com persistência em **PostgreSQL** via **Prisma 7**.

## Funcionalidades

- Listagem de prompts na sidebar, ordenada por data de criação
- Busca por título ou conteúdo (sincronizada com a URL via query `?q=`)
- Criação de novos prompts em `/new`
- Visualização e edição em `/[id]`
- Exclusão com confirmação (dialog)
- Cópia do conteúdo do prompt para a área de transferência
- Feedback visual com toasts (Sonner)
- Layout responsivo com sidebar colapsável e menu mobile

## Stack

| Camada          | Tecnologias                                                |
| --------------- | ---------------------------------------------------------- |
| Frontend        | Next.js 16, React 19, TypeScript, Tailwind CSS 4           |
| UI              | shadcn/ui, Radix UI, Lucide, Motion, Sonner                |
| Formulários     | React Hook Form, Zod, `@hookform/resolvers`                |
| Estado na URL   | nuqs                                                       |
| Backend / dados | Server Actions, Prisma 7, PostgreSQL, `@prisma/adapter-pg` |
| Testes          | Jest, Testing Library, Playwright                          |
| Qualidade       | ESLint, Prettier, Lefthook                                 |

## Arquitetura

O código em `src/` está organizado por responsabilidade:

```
src/
├── app/                    # Rotas, layout e Server Actions
├── components/             # Componentes de interface (UI, sidebar, prompts…)
├── core/
│   ├── domain/             # Entidades e contratos (ex.: PromptRepository)
│   └── application/        # Casos de uso e DTOs (Zod)
├── infra/
│   └── repository/         # Implementações concretas (Prisma)
├── lib/                    # Utilitários (Prisma client, test-utils)
├── generated/prisma/       # Cliente Prisma gerado (não editar)
└── tests/                  # Testes unitários e de integração (Jest)
```

### Fluxo de uma operação

```mermaid
flowchart LR
  UI[Componente / Formulário] --> Action[Server Action]
  Action --> UC[Caso de uso]
  UC --> Repo[PromptRepository]
  Repo --> Prisma[Prisma + PostgreSQL]
  Action --> Revalidate[revalidatePath]
```

**Exemplo (criar prompt):** `PromptForm` → `createPromptAction` → `CreatePromptUseCase` → `PrismaPromptRepository` → tabela `prompts`.

### Casos de uso

| Caso de uso | Arquivo                                               |
| ----------- | ----------------------------------------------------- |
| Criar       | `core/application/prompts/create-prompt.use-case.ts`  |
| Atualizar   | `core/application/prompts/update-prompt.use-case.ts`  |
| Excluir     | `core/application/prompts/delete-prompt.use-case.ts`  |
| Buscar      | `core/application/prompts/search-prompts.use-case.ts` |

### Rotas

| Rota    | Descrição                                       |
| ------- | ----------------------------------------------- |
| `/`     | Estado inicial — pede para selecionar um prompt |
| `/new`  | Formulário de criação                           |
| `/[id]` | Formulário de edição do prompt                  |

## Pré-requisitos

- **Node.js** 20+ (recomendado)
- **Yarn** 1.x (classic)
- **Docker** e **Docker Compose** (para o PostgreSQL local)

## Configuração

### 1. Clonar e instalar dependências

```bash
yarn install
```

O script `postinstall` roda `prisma generate` automaticamente.

### 2. Variáveis de ambiente

Copie o exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

Conteúdo esperado:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/rocketseat_prompt_manager"
```

> **Importante (Prisma 7):** use URL **`postgresql://`** direta. URLs no formato `prisma+postgres://` (Prisma Dev) **não** funcionam com `@prisma/adapter-pg`.

Variável opcional para o seed:

```env
E2E_SEED_COUNT=20
```

### 3. Subir o banco (Docker)

```bash
docker compose up -d
```

Credenciais padrão (ver `docker-compose.yml`):

- **Usuário:** `postgres`
- **Senha:** `password`
- **Banco:** `rocketseat_prompt_manager`
- **Porta:** `5432`

### 4. Migrações

```bash
yarn db:migrate
```

### 5. Seed (opcional)

Popula o banco com prompts fictícios (Faker):

```bash
yarn db:seed
```

## Executando a aplicação

```bash
# Desenvolvimento
yarn dev

# Build de produção
yarn build
yarn start
```

Acesse [http://localhost:3000](http://localhost:3000).

## Scripts disponíveis

| Script               | Descrição                               |
| -------------------- | --------------------------------------- |
| `yarn dev`           | Servidor de desenvolvimento (Turbopack) |
| `yarn build`         | Build de produção                       |
| `yarn start`         | Servidor após o build                   |
| `yarn typecheck`     | Checagem TypeScript                     |
| `yarn lint`          | ESLint                                  |
| `yarn format`        | Prettier em todo o projeto              |
| `yarn test`          | Testes Jest                             |
| `yarn test:watch`    | Jest em modo watch                      |
| `yarn test:coverage` | Jest com cobertura                      |
| `yarn test:e2e`      | Testes Playwright                       |
| `yarn test:e2e:ui`   | Playwright com UI                       |
| `yarn db:generate`   | Gera o cliente Prisma                   |
| `yarn db:migrate`    | Cria/aplica migrações (`migrate dev`)   |
| `yarn db:seed`       | Executa `prisma/seed.ts`                |
| `yarn db:studio`     | Abre o Prisma Studio                    |

## Banco de dados e Prisma

- **Schema:** `prisma/schema.prisma`
- **Configuração (Prisma 7):** `prisma.config.ts` — URL de conexão e comando de seed
- **Migrações:** `prisma/migrations/`
- **Seed:** `prisma/seed.ts` (comando configurado em `migrations.seed`)

O cliente é gerado em `src/generated/prisma` e instanciado em `src/lib/prisma.ts` com o adapter PostgreSQL:

```ts
new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL) });
```

### Modelo `Prompt`

| Campo (Prisma) | Coluna (DB)  | Observação  |
| -------------- | ------------ | ----------- |
| `id`           | `id`         | CUID        |
| `title`        | `title`      | Único       |
| `content`      | `content`    | Texto longo |
| `createdAt`    | `created_at` |             |
| `updatedAt`    | `updated_at` |             |

Tabela mapeada: `prompts`.

## Testes

### Testes unitários e de componente (Jest)

```bash
yarn test
yarn test:coverage
```

Os testes ficam em `src/tests/`, espelhando a estrutura de `src/` (actions, componentes, casos de uso, repositório).

Utilitário de render: `src/lib/test-utils.tsx` (reexporta Testing Library com `render` customizado).

### Testes end-to-end (Playwright)

```bash
# Instalar browsers (primeira vez)
npx playwright install

yarn test:e2e
```

- Specs em `e2e/`
- `playwright.config.ts` sobe `yarn dev` automaticamente
- `e2e/global-setup.ts` tenta rodar o seed antes dos testes (se `DATABASE_URL` estiver definida)

## Git hooks (Lefthook)

| Hook           | Ação                                   |
| -------------- | -------------------------------------- |
| **pre-commit** | `prettier --write` nos arquivos staged |
| **pre-push**   | `typecheck`, `lint` e `test:coverage`  |

Instalar hooks (se ainda não estiver ativo):

```bash
npx lefthook install
```

## Convenções do projeto

- **Server Actions** em `src/app/actions/` — ponto de entrada HTTP/RSC para mutações e buscas
- **Validação** com Zod nos DTOs (`create-prompt.dto.ts`, `update-prompt.dto.ts`)
- **Revalidação** de cache com `revalidatePath('/', 'layout')` após criar/atualizar/excluir
- **Alias de import:** `@/*` → `src/*` (ver `tsconfig.json`)
- **Componentes UI base:** `src/components/ui/` (gerados/adaptados do shadcn)

## Solução de problemas

| Problema                                  | Causa provável                      | Solução                                                     |
| ----------------------------------------- | ----------------------------------- | ----------------------------------------------------------- |
| `DATABASE_URL is not set`                 | `.env` ausente ou vazio             | Criar `.env` a partir de `.env.example`                     |
| `Can't reach database server`             | Postgres parado ou URL errada       | `docker compose up -d` e conferir porta `5432`              |
| `The table public.prompts does not exist` | Migrações não aplicadas             | `yarn db:migrate`                                           |
| `@prisma/client did not initialize`       | Cliente não gerado ou import errado | `yarn db:generate`; importar de `@/generated/prisma/client` |
| Erro com `prisma+postgres://`             | URL do Prisma Dev                   | Trocar por `postgresql://...` no `.env`                     |
| `No seed command configured`              | Seed não declarado                  | Já configurado em `prisma.config.ts` → `tsx prisma/seed.ts` |
| Playwright sem dados                      | Seed falhou no setup                | Verificar Docker + `DATABASE_URL` antes de `yarn test:e2e`  |

## Licença

Projeto privado (`"private": true` no `package.json`).
