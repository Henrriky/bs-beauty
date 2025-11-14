# BS Beauty Frontend - Guia para Agentes de IA

## 📋 Visão Geral
Sistema de agendamento de beleza com React + TypeScript + Vite, usando Redux Toolkit Query, autenticação JWT e controle de permissões baseado em roles.

## 🏗️ Arquitetura Principal

### Sistema de Autenticação
- **SessionBootstrap**: Inicialização automática de sessão com refresh tokens
- **Tokens JWT**: Access token + refresh token com rotação automática
- **Mutex de Refresh**: Controle de concorrência em `src/store/fetch-base/custom-fetch-base.ts`
- **Persistência**: localStorage para tokens, cookies httpOnly para refresh

### Tipos de Usuário e Permissões
```typescript
enum UserType {
  MANAGER = "MANAGER",     // Acesso total
  PROFESSIONAL = "PROFESSIONAL", // Gerencia serviços/turnos
  CUSTOMER = "CUSTOMER"    // Agenda atendimentos
}
```

### Estrutura de Rotas com Proteção
- Rotas públicas: `/login`, `/register`, `/reset-password`
- Proteção por role usando `PrivateRoute` com `allowedUserTypes[]`
- Sidebar automática para usuários autenticados
- Redirecionamento específico por tipo de usuário

### Redux + RTK Query
- **Store centralizado**: `src/store/index.ts` com múltiplas APIs
- **Padrão de APIs**: Cada domínio tem sua própria API slice (auth-api, user-api, etc.)
- **Cache e Tags**: Invalidação automática com `providesTags`/`invalidatesTags`
- **Base Query Customizada**: Auto-refresh de tokens em `custom-fetch-base.ts`

## 📝 Convenções de Código

### Componentes
- **Diretório**: `src/components/[categoria]/ComponentName.tsx`
- **Props Interface**: Sempre exportar interface de props
- **Styling**: TailwindCSS com classes condicionais via `clsx`
- **Variantes**: Props para diferentes estilos (ex: `variant="outline"|"solid"`)

### Estado e APIs
```typescript
// Hook padrão para dispatch
import useAppDispatch from './hooks/use-app-dispatch'

// Hook padrão para seleção de estado
import useAppSelector from './hooks/use-app-selector'

// Padrão RTK Query
export const entityAPI = createApi({
  reducerPath: 'entity-api',
  baseQuery: baseQueryWithAuth, // SEMPRE usar esta base
  tagTypes: ['Entity'],
  endpoints: (builder) => ({...})
})
```

### Estilização
- **Tema**: Paleta de cores definida em `tailwind.config.js`
- **Cores primárias**: `primary-{0-900}` (cinzas)
- **Cores secundárias**: `secondary-{100-700}` (tons terrosos)
- **Background principal**: `bg-[#1E1E1E]` (escuro)

## 🎯 Padrões Específicos do Projeto

### Formulários
- **React Hook Form** + **Zod** para validação
- Componentes de input personalizados em `src/components/inputs/`
- Validação centralizada em `src/utils/validation/`

### Páginas
- **Estrutura**: `src/pages/[nome]/index.tsx`
- **Subcomponentes**: `src/pages/[nome]/components/`
- **Tipos**: `src/pages/[nome]/types/`

### Configuração de API
- **Base URL**: Dinâmica baseada em `ENV.ENVIRONMENT`
- **Endpoints**: Centralizados em `src/api/config.ts`
- **Credentials**: Sempre `include` para cookies

### Toast Notifications
- **React-Toastify** configurado globalmente no App.tsx
- Styling customizado para tema escuro
- Usar `toast.success()`, `toast.error()`, `toast.warn()`

## 🔗 Pontos de Integração

### Google OAuth
- Fluxo completo: redirect → callback → exchange code → token
- Persistência de `googleAccessToken` separada

### Refresh Token Flow
- Automático antes de cada requisição
- Retry em 401 com novo token
- Logout automático em falha de refresh

### Permissões Dinâmicas
- Verificação em componentes: `userHasPermission(allowedTypes, currentType)`
- Controle de renderização baseado em roles
- Rotas protegidas com validação server-side

### Estado de Loading/Erro
- Componentes `Loading` e `ErrorMessage` padronizados
- Estados RTK Query: `isLoading`, `isError`, `data`

## ⚡ Comandos Essenciais
```bash
npm run dev          # Desenvolvimento local
npm run build        # Build de produção
npm run lint         # ESLint
npm run lint:fix     # ESLint com correção automática
npm run preview      # Preview do build
```

## 🚫 O que NÃO fazer

### Más Práticas
- **NÃO** coloque lógica de negócio nos componentes - use hooks personalizados
- **NÃO** acesse APIs diretamente nos componentes - use RTK Query hooks
- **NÃO** misture responsabilidades entre componentes de apresentação e lógica
- **NÃO** esqueça de adicionar validações de entrada com Zod
- **NÃO** implemente sem considerar estados de loading/error
- **NÃO** quebre convenções de nomenclatura (PascalCase para componentes)
- **NÃO** ignore tratamento de erros - sempre use try/catch ou error boundaries
- **NÃO** faça commits sem executar lint
- **NÃO** duplique código - sempre aplique o princípio DRY (Don't Repeat Yourself)

### Erros Comuns
- Não adicionar newline no final dos arquivos
- Usar imports relativos em vez de absolutos quando possível
- Esquecer de exportar componentes/interfaces
- Não mockar dependências nos testes
- Não seguir o padrão strict do Zod (`.strict()`)
- **Duplicar lógica entre componentes** - sempre extrair para hooks personalizados
- Criar componentes redundantes quando um pode servir ambos os propósitos
- **Adicionar comentários desnecessários** - evite comentários óbvios no código
- **Usar mensagens de erro em português no console** - sempre use inglês

### Princípio DRY - Hooks Personalizados
```typescript
// ❌ MAU - Lógica duplicada em componentes
function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  // ... lógica de fetch, paginação, filtros
}

function ProfessionalList() {
  const [professionals, setProfessionals] = useState([])
  const [loading, setLoading] = useState(false)
  // ... mesma lógica duplicada
}

// ✅ BOM - Hook reutilizável
function useEntityList<T>(apiHook: any, initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters)
  const { data, isLoading, error } = apiHook(filters)
  
  return {
    data: data?.data || [],
    loading: isLoading,
    error,
    filters,
    setFilters,
  }
}
```

### Baixo Acoplamento, Alta Coesão
- **Componentes**: Apenas apresentação e interação do usuário
- **Hooks personalizados**: Lógica de negócio e gerenciamento de estado
- **RTK Query**: Comunicação com APIs
- **Utils**: Funções puras reutilizáveis

## 📋 Como Implementar Nova Funcionalidade

### 1. Estrutura de Arquivos
```
src/pages/nova-feature/
├── index.tsx              # Página principal
├── components/            # Componentes específicos
│   ├── FeatureForm.tsx
│   └── FeatureList.tsx
└── types/                 # Tipos específicos
    └── index.ts
```

### 2. Fluxo de Implementação

#### Passo 1: Definir Types e API
```typescript
// src/pages/nova-feature/types/index.ts
export interface Feature {
  id: string
  name: string
  // ... outros campos
}

// src/api/config.ts - Adicionar endpoints
FEATURE_ENDPOINTS: {
  ENDPOINT: '/features',
  FIND_BY_ID: (id: string) => `/features/${id}`,
}
```

#### Passo 2: Criar RTK Query Slice
```typescript
// src/store/feature/feature-api.ts
export const featureAPI = createApi({
  reducerPath: 'feature-api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Feature'],
  endpoints: (builder) => ({
    // ... endpoints
  })
})
```

#### Passo 3: Hook Personalizado (Abstrair Lógica)
```typescript
// src/pages/nova-feature/hooks/useFeatureLogic.ts
export function useFeatureLogic() {
  const { data: features, isLoading } = useGetFeaturesQuery()
  const [createFeature] = useCreateFeatureMutation()
  
  const handleCreate = useCallback(async (data: CreateFeatureRequest) => {
    try {
      await createFeature(data).unwrap()
      toast.success('Feature criada com sucesso!')
    } catch (error) {
      toast.error('Erro ao criar feature')
    }
  }, [createFeature])

  return {
    features,
    isLoading,
    handleCreate,
    // ... outras funcionalidades
  }
}
```

#### Passo 4: Componente de Apresentação Limpo
```typescript
// src/pages/nova-feature/index.tsx
export default function NovaFeature() {
  const { features, isLoading, handleCreate } = useFeatureLogic()
  
  if (isLoading) return <Loading />
  
  return (
    <div className="p-6">
      <Title label="Nova Feature" />
      <FeatureForm onSubmit={handleCreate} />
      <FeatureList features={features} />
    </div>
  )
}
```

### 3. Integração com Sistema de Permissões
```typescript
// Proteger rota se necessário
<Route
  element={<PrivateRoute allowedUserTypes={[UserType.MANAGER]} />}
>
  <Route path="/features" element={<NovaFeature />} />
</Route>

// Ou condicional no componente
const { user } = useAppSelector(state => state.auth)
const canCreate = userHasPermission([UserType.MANAGER], user.userType)
```

### 4. Adicionar Item na Sidebar (Para Resources Isolados)
```typescript
// src/components/sidebar/consts/index.tsx - Adicionar no userType apropriado
[UserType.MANAGER]: [
  // ... outros itens existentes
  {
    name: 'Nome do Resource',
    icon: <IconeDoHeroicons className="size-6" />,
    navigateTo: '/caminho/para/resource',
  },
]
```

**⚠️ IMPORTANTE:** Apenas adicione itens na sidebar para resources **isolados e independentes** (ex: Roles, Permissions, Analytics). Não adicione para subpáginas ou funcionalidades que fazem parte de outro contexto.

## 📋 Checklist para Nova Feature

### Antes de Começar
- [ ] Definir tipos TypeScript necessários
- [ ] Criar interfaces de API no arquivo de config
- [ ] Verificar permissões necessárias por role

### Implementação
- [ ] Criar RTK Query API slice com tags apropriadas
- [ ] Implementar hook personalizado para lógica de negócio
- [ ] Criar componentes de apresentação com props tipadas
- [ ] Adicionar validação Zod nos formulários
- [ ] Implementar estados de loading/error/success
- [ ] Adicionar toast notifications apropriadas
- [ ] Configurar rotas protegidas se necessário
- [ ] Adicionar item na sidebar (apenas para resources isolados)

### Finalização
- [ ] Executar `npm run lint:fix`
- [ ] Testar diferentes roles de usuário
- [ ] Verificar responsividade
- [ ] Testar fluxos de erro (network, validação, etc.)

## 🐛 Debugging
- Redux DevTools habilitado
- Console logs detalhados no fluxo de auth
- Network tab para monitorar refresh tokens
- LocalStorage para verificar tokens persistidos