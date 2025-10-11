# 🤖 AGENTS.MD - Boas Práticas para Agentes IA

## 📋 Visão Geral

Este documento define as boas práticas e padrões arquiteturais para agentes IA trabalharem no projeto **BS-Beauty Backend**. Siga estas diretrizes para manter consistência, qualidade e aderência aos padrões estabelecidos.

---

## 🏗️ Arquitetura do Projeto

### Estrutura de Camadas
```
src/
├── controllers/        # Camada de apresentação (HTTP handlers)
├── services/          # Camada de negócio (Use Cases)
├── repository/        # Camada de dados (Repository Pattern)
├── factory/           # Injeção de dependências
├── router/            # Roteamento e middlewares
├── middlewares/       # Validações e autenticação
├── utils/             # Utilitários e helpers
├── types/             # Definições de tipos TypeScript
└── tests/             # Testes unitários e de integração
```

### Padrões Arquiteturais Utilizados
- **Repository Pattern** - Abstração da camada de dados
- **Use Case Pattern** - Encapsulamento de regras de negócio
- **Factory Pattern** - Criação e injeção de dependências
- **Controller Pattern** - Manipulação de requisições HTTP
- **Middleware Pattern** - Validações e autenticação

---

## 🛠️ Diretrizes para Implementação

### 1. **Criação de Nova Entidade**

#### Ordem de Implementação:
1. **Schema Prisma** (se necessário)
2. **Repository** (Interface + Implementação)
3. **Use Case** (Regras de negócio)
4. **Controller** (Endpoints HTTP)
5. **Factory** (Injeção de dependências)
6. **Routes** (Configuração de rotas)
7. **Middlewares** (Validações)
8. **Testes** (Unitários e de integração)

#### Template de Repository:
```typescript
// protocols/entity.repository.ts
interface EntityRepository {
  findAll: () => Promise<Entity[]>
  findById: (id: string) => Promise<Entity | null>
  create: (data: Prisma.EntityCreateInput) => Promise<Entity>
  update: (id: string, data: Prisma.EntityUpdateInput) => Promise<Entity>
  delete: (id: string) => Promise<Entity>
}

// prisma/prisma-entity.repository.ts
class PrismaEntityRepository implements EntityRepository {
  public async findAll() {
    return await prismaClient.entity.findMany()
  }
  // ... outras implementações
}
```

#### Template de Use Case:
```typescript
class EntityUseCase {
  private readonly entityName = 'Entity'

  constructor(private readonly entityRepository: EntityRepository) {}

  public async executeFindAll(): Promise<{ entities: Entity[] }> {
    const entities = await this.entityRepository.findAll()
    return { entities }
  }

  public async executeCreate(data: Prisma.EntityCreateInput): Promise<Entity> {
    // Validações de negócio aqui
    return await this.entityRepository.create(data)
  }
}
```

### 2. **Nomenclatura e Convenções**

#### Arquivos:
- **Controllers:** `entities.controller.ts`
- **Use Cases:** `entities.use-case.ts`
- **Repositories:** `entity.repository.ts` (protocol), `prisma-entity.repository.ts` (implementação)
- **Routes:** `entities.routes.ts`
- **Middlewares:** `action-entity.validation.middleware.ts`
- **Tests:** `entities.use-case.spec.ts`

#### Classes e Métodos:
- **Controllers:** `EntitiesController` com métodos estáticos `handleAction`
- **Use Cases:** `EntityUseCase` com métodos `executeAction`
- **Repositories:** `EntityRepository` (interface), `PrismaEntityRepository` (implementação)

#### Variáveis:
- Use `camelCase` para variáveis e métodos
- Use `PascalCase` para classes e interfaces
- Use nomes descritivos e específicos

### 3. **Comentários no Código**

#### ✅ **Comentários Úteis:**
```typescript
// Aplica desconto para compras acima de R$ 100
if (totalValue > 100) {
  totalValue *= 0.9
}

// TODO: Implementar cache para melhorar performance
const result = await this.repository.findAll()
```

#### ❌ **Comentários Desnecessários:**
```typescript
// ❌ MAU - Redundante com requisitos
it('should create role successfully (CA-1)', async () => {
  // ...
})

// ❌ MAU - Óbvio demais
const user = await this.userRepository.findById(id) // Busca usuário por ID

// ❌ MAU - Indicação de requisito funcional
public async executeCreate(data: CreateRoleInput): Promise<Role> { // RF-1
  // ...
}
```

#### ✅ **Comentários Apropriados:**
```typescript
// ✅ BOM - Explica lógica de negócio complexa
// Aplica desconto progressivo baseado no volume de compras
if (quantity >= 10) {
  discount = 0.15
} else if (quantity >= 5) {
  discount = 0.1
}

// ✅ BOM - Documenta decisões técnicas importantes
// Usando transação para garantir consistência entre Role e RolePermission
await prismaClient.$transaction(async (tx) => {
  // ...
})
```

### 4. **Validação e Tratamento de Erros**

#### Schemas Zod:
```typescript
class EntitySchemas {
  public static createSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().max(500).optional(),
    isActive: z.boolean().optional().default(true)
  }).strict()

  public static updateSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    // ... campos opcionais para update
  }).strict()
}
```

#### Middlewares de Validação:
```typescript
const validateCreateEntity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    EntitySchemas.createSchema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      formatValidationErrors(error, res)
      return
    }
    next(error)
  }
}
```

#### Tratamento de Erros:
- Use `RecordExistence.validateRecordExistence()` para verificar existência
- Use `RecordExistence.validateRecordNonExistence()` para validar unicidade
- Use `CustomError` para erros personalizados
- Para `findAll()`, retorne arrays vazios em vez de erros
- **Sempre use mensagens de erro em inglês** para consistência internacional

### 5. **Testes**

#### Estrutura de Testes:
```typescript
describe('EntityUseCase (Unit Tests)', () => {
  let entityUseCase: EntityUseCase

  beforeEach(() => {
    entityUseCase = new EntityUseCase(MockEntityRepository)
    vi.clearAllMocks()
  })

  describe('executeCreate', () => {
    it('should create entity successfully', async () => {
      // Arrange
      const entityData = { /* dados válidos */ }
      MockEntityRepository.create.mockResolvedValue(expectedEntity)
      
      // Act
      const result = await entityUseCase.executeCreate(entityData)
      
      // Assert
      expect(result).toEqual(expectedEntity)
      expect(MockEntityRepository.create).toHaveBeenCalledWith(entityData)
    })
  })
})
```

#### Coverage de Testes:
- **Use Cases:** Teste todos os métodos e cenários de erro
- **Middlewares:** Teste validações válidas e inválidas
- **Repositories:** Teste principalmente via integration tests

### 6. **Validação de Qualidade de Código**

#### Comandos Obrigatórios antes de Finalizar:
```bash
# 1. Verificar todos os testes unitários
npm run test:unit

# 2. Verificar lint (padrões de código)
npm run lint

# 3. Corrigir problemas de lint automaticamente (se necessário)
npm run lint:fix

# 4. Validar TypeScript (verificar erros de tipos)
npx tsc --noEmit
```

#### ⚠️ **Regra Importante:**
- **NUNCA** finalize uma implementação sem que todos esses comandos passem sem erros
- Se houver erros de lint, corrija-os antes de continuar
- Se houver erros do TypeScript, resolva-os obrigatoriamente
- Todos os testes devem estar passando (100% success rate)

#### 🤖 **Auto-Validação para Agentes IA:**
Antes de finalizar qualquer implementação, execute este checklist:
```bash
# 1. Verificar comentários desnecessários
grep -r "(RF-\|CA-\|RN-)" src/ --include="*.ts" --exclude-dir=node_modules
# Se encontrar resultados, remova os comentários

# 2. Verificar mensagens em português
grep -r "não\|Não\|é\|ser\|para" src/ --include="*.ts" --exclude-dir=node_modules | grep -i error
# Se encontrar mensagens de erro em português, traduza para inglês

# 3. Executar validações obrigatórias
npm run test:unit
npm run lint
npx tsc --noEmit
```

---

## 📋 Checklist para Nova Feature

### ✅ **Antes de Começar:**
- [ ] Entenda os requisitos funcionais (RF) e regras de negócio (RN)
- [ ] Identifique critérios de aceitação (CA)
- [ ] Verifique se a entidade já existe no schema Prisma
- [ ] Analise dependências com outras entidades

### ✅ **Durante a Implementação:**
- [ ] Siga a ordem: Repository → Use Case → Controller → Factory → Routes → Middlewares → Tests
- [ ] Use os padrões de nomenclatura estabelecidos
- [ ] Implemente validações de negócio nos Use Cases
- [ ] Adicione middlewares de validação Zod
- [ ] Configure autenticação apropriada nas rotas
- [ ] Escreva testes para cada componente

### ✅ **Antes de Finalizar:**
- [ ] Execute todos os testes: `npm run test:unit`
- [ ] Verifique lint: `npm run lint` (corrija com `npm run lint:fix` se necessário)
- [ ] Valide TypeScript: `npx tsc --noEmit` (garante que não há erros de tipos)
- [ ] Teste endpoints manualmente (se possível)
- [ ] Documente mudanças significativas
- [ ] Valide que todos os CAs foram atendidos

---

## 🔧 Comandos Úteis

### Desenvolvimento:
```bash
npm run start:dev          # Servidor de desenvolvimento
npm run build             # Build para produção
npm run lint              # Verificar código
npm run lint:fix          # Corrigir problemas de lint
```

### Testes:
```bash
npm run test:unit          # Testes unitários
npm run test:unit:watch    # Testes em modo watch
npm run test:int           # Testes de integração
npm run coverage:unit      # Coverage dos testes unitários
```

### Validação de Código:
```bash
npx tsc --noEmit          # Verificar erros de TypeScript
npm run lint              # Verificar padrões ESLint
npm run lint:fix          # Corrigir automaticamente problemas de ESLint
```

---

## 🚫 **O que NÃO fazer**

### ❌ **Más Práticas:**
- **NÃO** coloque lógica de negócio nos Controllers
- **NÃO** acesse o banco diretamente nos Controllers
- **NÃO** misture responsabilidades entre camadas
- **NÃO** esqueça de adicionar validações de entrada
- **NÃO** implemente sem testes
- **NÃO** quebre convenções de nomenclatura
- **NÃO** ignore tratamento de erros
- **NÃO** faça commits sem executar testes
- **NÃO** duplique código - sempre aplique o princípio DRY (Don't Repeat Yourself)

### ❌ **Erros Comuns:**
- Não adicionar newline no final dos arquivos
- Usar imports relativos em vez do path mapping (`@/`)
- Esquecer de exportar classes/interfaces
- Não mockar dependências nos testes
- Não seguir o padrão strict do Zod (`.strict()`)
- **Duplicar lógica entre métodos** - sempre extrair código comum
- Criar métodos redundantes quando um pode servir ambos os propósitos
- **Adicionar comentários desnecessários** - evite comentários indicando RF, CA, RN no código
- **Usar mensagens de erro em português** - sempre use inglês para mensagens de erro

### 🔄 **Princípio DRY:**
```typescript
// ❌ MAU - Código duplicado
public async executeFindAll(): Promise<RolesOutput> {
  const roles = await this.roleRepository.findAll()
  return { roles }
}

public async executeFindAllPaginated(params: PaginatedRequest<RoleFilters>): Promise<PaginatedResult<Role>> {
  const result = await this.roleRepository.findAllPaginated(params)
  return result
}

// ✅ BOM - Reutilizar código
public async executeFindAll(): Promise<RolesOutput> {
  const result = await this.executeFindAllPaginated({
    page: 1,
    limit: 1000, // ou Number.MAX_SAFE_INTEGER para todos
    filters: {}
  })
  return { roles: result.data }
}
```

---

## 📚 **Recursos Adicionais**

### Tecnologias Principais:
- **Node.js + TypeScript** - Runtime e linguagem
- **Express.js** - Framework web
- **Prisma** - ORM e gerenciamento de banco
- **Zod** - Validação de esquemas
- **Vitest** - Framework de testes
- **JWT** - Autenticação

### Documentação de Referência:
- [Prisma Docs](https://www.prisma.io/docs)
- [Zod Documentation](https://zod.dev)
- [Vitest Guide](https://vitest.dev/guide/)
- [Express.js Guide](https://expressjs.com/en/guide/)

---

## 🎯 **Objetivo Final**

Manter um codebase **consistente**, **testável**, **escalável** e **manutenível**, seguindo princípios SOLID e padrões arquiteturais bem estabelecidos. Cada nova feature deve integrar-se harmoniosamente com o ecossistema existente.

---

**Última atualização:** Setembro 2025  
**Versão:** 1.0  
**Projeto:** BS-Beauty Backend