# Future Board

Aplicação de **Product Roadmap** estilo kanban: issues organizadas por status, comentários, likes e autenticação via GitHub. Construída com **Next.js App Router**, API **Hono** e **PostgreSQL** via **Drizzle ORM**.

## Stack

| Camada    | Tecnologias                                      |
| --------- | ------------------------------------------------ |
| Frontend  | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| UI        | Radix UI, Lucide, React Query, nuqs              |
| API       | Hono, OpenAPI, Scalar                            |
| Auth      | Better Auth (GitHub OAuth)                       |
| Banco     | PostgreSQL, Drizzle ORM                          |
| Qualidade | Biome                                            |

## Pré-requisitos

- **Node.js** 20+
- **Yarn** 1.x
- **Docker** e **Docker Compose**

## Configuração

### 1. Instalar dependências

```bash
yarn install
```

### 2. Variáveis de ambiente

Copie o exemplo e preencha os valores:

```bash
cp .env.example .env
```

Conteúdo esperado:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/board"
NEXT_PUBLIC_API_URL="http://localhost:3000"
BETTER_AUTH_SECRET="sua-chave-secreta-com-pelo-menos-32-caracteres"
BETTER_AUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="seu-client-id"
GITHUB_CLIENT_SECRET="seu-client-secret"
```

| Variável               | Descrição                                              |
| ---------------------- | ------------------------------------------------------ |
| `DATABASE_URL`         | Conexão PostgreSQL (ver porta abaixo)                  |
| `NEXT_PUBLIC_API_URL`  | URL base da API (em dev: `http://localhost:3000`)      |
| `BETTER_AUTH_SECRET`   | Segredo do Better Auth (mínimo 32 caracteres)          |
| `BETTER_AUTH_URL`      | URL pública da app (em dev: `http://localhost:3000`)   |
| `GITHUB_CLIENT_ID`     | OAuth App do GitHub                                    |
| `GITHUB_CLIENT_SECRET` | OAuth App do GitHub                                    |

### 3. Subir o banco (Docker)

```bash
docker compose up -d
```

Credenciais padrão (ver `docker-compose.yml`):

| Campo    | Valor      |
| -------- | ---------- |
| Usuário  | `postgres` |
| Senha    | `postgres` |
| Banco    | `board`    |
| **Porta**| **`5433`** |

> **Importante — porta 5433, não 5432**
>
> O Postgres do projeto usa a porta **5433** no host para evitar conflito com outros containers PostgreSQL que costumam ocupar a `5432` (ex.: outros projetos locais). Se o `DATABASE_URL` apontar para `5432`, a API retorna **500 Internal Server Error** e a página quebra com erro de JSON no console.
>
> Sintomas quando a porta está errada:
> - `Unexpected token 'I', "Internal S"... is not valid JSON`
> - `password authentication failed for user "postgres"` ao rodar `yarn db:migrate`
>
> Para confirmar que o container está exposto corretamente:
>
> ```bash
> docker port board-postgres
> # deve mostrar: 5432/tcp -> 0.0.0.0:5433
> ```

### 4. Migrações e seed

```bash
yarn db:migrate
yarn db:seed
```

O seed popula o banco com issues e comentários fictícios para desenvolvimento.

### 5. Rodar a aplicação

```bash
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000).

> Após alterar o `.env` (especialmente `DATABASE_URL`), **reinicie o dev server** para as variáveis serem recarregadas.

Documentação da API: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Scripts disponíveis

| Script             | Descrição                        |
| ------------------ | -------------------------------- |
| `yarn dev`         | Servidor de desenvolvimento      |
| `yarn build`       | Build de produção                |
| `yarn start`       | Servidor após o build            |
| `yarn lint`        | Biome check                      |
| `yarn format`      | Biome format                     |
| `yarn db:generate` | Gera migrações Drizzle           |
| `yarn db:migrate`  | Aplica migrações                 |
| `yarn db:push`     | Push do schema direto no banco   |
| `yarn db:seed`     | Popula o banco com dados de teste|
| `yarn db:studio`   | Abre o Drizzle Studio            |

## Estrutura do projeto

```
src/
├── api/              # API Hono (rotas, auth, schema Drizzle)
├── app/
│   ├── (board)/      # Página principal do kanban
│   ├── issues/       # Detalhes da issue
│   └── api/          # Route handler Next.js → Hono
├── components/       # Componentes de UI
├── http/             # Clientes HTTP (fetch para a API)
└── env.ts            # Variáveis de ambiente do client
```

## Solução de problemas

| Problema | Causa provável | Solução |
| -------- | -------------- | ------- |
| `Unexpected token 'I', "Internal S"... is not valid JSON` | API retornou erro 500 em texto puro (banco inacessível) | Verificar Docker, porta **5433** no `.env` e reiniciar `yarn dev` |
| `password authentication failed for user "postgres"` | `DATABASE_URL` aponta para outro Postgres na 5432 | Usar porta **5433** e credenciais `postgres`/`postgres` |
| `board-postgres` sem porta no host | Porta 5432 já ocupada por outro container | Parar o outro Postgres ou manter a **5433** do `docker-compose.yml` |
| Página em branco / board vazio | Migrações ou seed não rodados | `yarn db:migrate && yarn db:seed` |
| Aviso de hydration mismatch no `<html>` | Extensão do navegador (ex.: LanguageTool) altera o DOM | Inofensivo em dev; ou testar em aba anônima |
| Variáveis de ambiente ignoradas | Dev server iniciado antes de criar/editar `.env` | Parar e rodar `yarn dev` novamente |

## Licença

Projeto privado (`"private": true` no `package.json`).
