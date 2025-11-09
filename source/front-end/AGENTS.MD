# BS Beauty Frontend - Guia para Agentes de IA

## 📋 Visão Geral
Sistema de agendamento de beleza com React + TypeScript + Vite, usando Redux Toolkit Query, autenticação JWT e controle de permissões baseado em roles.

### Propósito do Sistema
- Gerenciar agendamentos de serviços de beleza
- Controlar profissionais, clientes e serviços oferecidos
- Administrar horários de trabalho, bloqueios e turnos
- Sistema de notificações e comunicação
- Analytics e relatórios gerenciais
- Sistema de avaliações de serviços
- Gestão de pagamentos e registros financeiros

## 🏗️ Arquitetura Principal

### Stack Tecnológica Completa

#### Core Technologies
- **React 18.3.1** - Library principal para UI
- **TypeScript 5.5.3** - Tipagem estática
- **Vite 5.4.8** - Build tool e dev server (mais rápido que Webpack)
- **React Router DOM 6.28** - Roteamento SPA

#### Estado e Dados
- **Redux Toolkit 2.3.0** - Gerenciamento de estado global
- **RTK Query** - Cache e sincronização de dados com API
- **React Hook Form 7.53** - Gerenciamento de formulários performático
- **Zod 3.23.8** - Validação de schemas runtime

#### UI e Estilização
- **Tailwind CSS 3.4.15** - Utility-first CSS framework
- **Headless UI 2.2.9** - Componentes acessíveis sem estilização
- **Hero Icons 2.2.0** - Biblioteca de ícones SVG
- **Material UI (MUI) 7.3.4** - Componentes complexos (charts, date pickers)

#### Utilities
- **Luxon 3.5.0** - Manipulação de datas e timezones (melhor que Moment.js)
- **Axios 1.7.7** - Cliente HTTP para requests
- **JWT Decode 4.0.0** - Decodificação de tokens JWT
- **React Toastify 10.0.6** - Sistema de notificações toast
- **React Calendar 5.1.0** - Componente de calendário

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

### Estrutura de Pastas Detalhada

```
src/
├── api/                      # Configurações de API
│   └── config.ts            # URLs, endpoints e variáveis de ambiente
│
├── assets/                   # Recursos estáticos (imagens, SVGs, ícones)
│
├── components/               # Componentes reutilizáveis
│   ├── authorization/       # UserCanAccessContainer (controle de acesso)
│   ├── button/              # Button component com variantes
│   ├── combobox/            # Combobox/Select components
│   ├── feedback/            # Loading, ErrorMessage
│   ├── inputs/              # Input components especializados
│   │   ├── text/           # TextInput
│   │   ├── payment-methods/ # PaymentMethodsInput
│   │   └── ...             # Outros inputs personalizados
│   ├── layouts/             # Layout wrappers
│   ├── logo/                # Logo component
│   ├── modal/               # Modal component
│   ├── password/            # PasswordInput com toggle de visibilidade
│   ├── select/              # Pagination, Select components
│   ├── sidebar/             # Sidebar navigation (adaptável por userType)
│   ├── status/              # StatusBadge component
│   ├── texts/               # Typography (Title, Subtitle, etc)
│   └── tooltip/             # Tooltip component
│
├── config/                   # Configurações gerais da aplicação
│
├── constants/                # Constantes da aplicação
│
├── enums/                    # Enumerações (WeekDays, Status, etc)
│
├── hooks/                    # Custom React Hooks
│   ├── use-app-selector.ts  # Typed Redux useSelector
│   └── use-app-dispatch.ts  # Typed Redux useDispatch
│
├── layouts/                  # Layouts de página
│   └── PageHeader.tsx       # Header padrão usado em todas as páginas
│
├── lib/                      # Bibliotecas e utilitários de terceiros
│
├── pages/                    # Páginas da aplicação
│   ├── analytics/           # Dashboard de analytics gerencial
│   ├── appointments/        # Gerenciamento de agendamentos
│   │   ├── index.tsx       # Lista paginada de agendamentos
│   │   ├── components/     # CustomerAppointmentCard, etc
│   │   └── types/          # Types específicos de appointments
│   ├── blocked-times/       # Gerenciamento de horários bloqueados
│   ├── callback/            # OAuth callback (Google)
│   ├── complete-register/   # Completar registro pós-OAuth
│   ├── customers/           # Listagem e gestão de clientes (MANAGER)
│   ├── home/                # Páginas home por tipo de usuário
│   │   ├── customer-home/  # Wizard de agendamento (cliente)
│   │   ├── landing-page/   # Landing page pública
│   │   └── manager-professional-home/ # Dashboard gerencial
│   ├── login/               # Página de login (email/senha + OAuth)
│   ├── not-found/           # 404 page
│   ├── notification-templates/ # Templates de notificação
│   ├── notifications/       # Central de notificações
│   ├── password-reset/      # Reset de senha
│   ├── payments/            # Gerenciamento de pagamentos
│   ├── private-route/       # Route guard component
│   ├── professionals/       # Listagem e gestão de profissionais
│   ├── profile/             # Perfil do usuário logado
│   ├── roles/               # Gestão de papéis e permissões (RBAC)
│   ├── services/            # Gerenciamento de serviços oferecidos
│   ├── shifts/              # Gerenciamento de turnos de trabalho
│   └── user-registration/   # Registro de novos usuários
│
├── providers/                # Context Providers
│
├── routes/                   # Configuração de rotas
│   └── index.tsx            # Definição de todas as rotas com proteção
│
├── store/                    # Redux Store com RTK Query
│   ├── analytics/           # Analytics API slice
│   ├── appointment/         # Appointments API slice
│   ├── auth/                # Auth slice (state) e API
│   │   ├── auth-slice.ts   # Estado local de autenticação
│   │   ├── auth-api.ts     # Endpoints de auth (login, logout, etc)
│   │   ├── server-logout.ts # Thunk de logout com limpeza de cache
│   │   └── types.ts        # Types de auth e user
│   ├── blocked-times/       # Blocked times API slice
│   ├── customer/            # Customer API slice
│   ├── fetch-base/          # Base query customizada com auth
│   │   └── custom-fetch-base.ts # Refresh token automático
│   ├── notification/        # Notifications API slice
│   ├── notification-template/ # Notification templates API slice
│   ├── offer/               # Service offers API slice
│   ├── payment-record/      # Payments API slice
│   ├── permission/          # Permissions API slice
│   ├── professional/        # Professional API slice
│   ├── rating/              # Ratings API slice
│   ├── role/                # Roles API slice
│   ├── service/             # Services API slice
│   ├── shift/               # Shifts API slice
│   ├── themes/              # Theme slice (dark/light mode)
│   ├── user/                # User API slice
│   ├── index.ts             # Store configuration (combine reducers)
│   └── types.ts             # Shared types entre slices
│
├── types/                    # TypeScript types e interfaces globais
│   └── authorization.ts     # Types de autorização (Permissions, etc)
│
├── utils/                    # Funções utilitárias
│   ├── formatter/           # Formatters (dates, currency, status, etc)
│   │   ├── formatter.util.ts
│   │   └── first-letter-of-word-to-upper-case.util.ts
│   └── validation/          # Zod schemas de validação
│       └── zod-schemas/     # Schemas organizados por domínio
│
├── App.tsx                   # Componente principal da aplicação
├── SessionBootstrap.tsx      # Inicialização automática de sessão
├── main.tsx                  # Entry point (ReactDOM.render)
└── index.css                 # Estilos globais e classes customizadas
```

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

---

## 📦 Páginas e Funcionalidades Detalhadas

### Landing Page
- Página inicial pública com apresentação do salão
- Carrossel de serviços com auto-scroll (4s)
- Informações institucionais
- Call-to-action para login/registro

### Login
- Login com email/senha (validação com Zod)
- Login com Google OAuth (fluxo completo)
- Link para registro de novos usuários
- Link para reset de senha
- Otimizado para mobile portrait e landscape
- Backgrounds com opacidade reduzida em landscape

### Home (Customer)
**Wizard de agendamento em múltiplos passos:**

1. **Seleção de Fluxo**: Escolhe entre agendar por serviço ou por profissional
2. **Seleção de Serviço/Profissional**: 
   - Cards com informações detalhadas
   - Preços e tempo estimado
   - Foto de perfil do profissional
3. **Seleção de Horário**: 
   - Calendário interativo com React Calendar
   - Slots de horário disponíveis
   - Validação de disponibilidade em tempo real
4. **Revisão**: 
   - Confirmação de todos os dados
   - Modal de permissão de uso de imagem
   - Finalização do agendamento

**Importante:** O wizard usa React Hook Form com context para compartilhar estado entre os steps.

### Home (Professional/Manager)
- Dashboard com métricas do dia/semana/mês
- Carrossel de agendamentos do dia com auto-scroll
- Ações rápidas (novo agendamento, bloquear horário)
- Analytics resumido

### Appointments
**Lista paginada de agendamentos** (10 por página):

- **Toggle entre estados**: "Agendados" vs "Finalizados"
- **Cards adaptados ao tipo de usuário**:
  - **Cliente**: vê foto e nome do **profissional**
  - **Profissional/Manager**: vê foto e nome do **cliente** que agendou
- **Badges de status**: Confirmado, Pendente, Cancelado, Reagendado, Finalizado, No-Show
- **Badges de avaliação**: 
  - "Avaliação Pendente" (amber) quando `rating !== null && score === null`
  - "Avaliado" (green) quando `rating !== null && score !== null`
- **Ações**: Editar (agendados) ou Visualizar (finalizados)
- **Paginação**: Componente reutilizável com numbered buttons e navigation arrows

**Padrão de prop drilling:** `index.tsx` → `CustomerAppointments` → `CustomerAppointmentCard`
- `userType` é passado como prop para evitar múltiplas chamadas ao Redux

### Customers
**Lista paginada de clientes** (acesso apenas MANAGER):

- Cards com foto de perfil e informações básicas
- Busca por nome e email (futura implementação)
- Filtros diversos
- Paginação (10 itens por página)
- Skeleton loading durante carregamento

### Professionals
**Gerenciamento completo de profissionais:**

- Lista de profissionais ativos
- Cadastro e edição de dados
- **Vinculação de serviços** (offers):
  - Cada profissional pode oferecer múltiplos serviços
  - Preço e tempo estimado personalizáveis por oferta
- **Métodos de pagamento aceitos**: Cartão, PIX, Dinheiro, Transferência, etc
- **Horários de trabalho** (shifts)
- Redes sociais e informações de contato

### Services
**CRUD completo de serviços:**

- Nome, descrição e categoria
- Tempo estimado padrão
- Preço base sugerido
- Associação com profissionais (através de offers)
- Status ativo/inativo

### Shifts
**Gerenciamento de turnos de trabalho:**

- Configuração por dia da semana
- Horário de início e fim
- Intervalo para almoço/descanso
- Associação com profissionais específicos
- Validações de conflito de horários

### Blocked Times
**Bloqueio de horários específicos:**

- Seleção de data e horário
- Motivo do bloqueio (feriado, manutenção, evento, etc)
- Associação com profissional específico ou todos
- Visualização em formato de calendário
- Deleção de bloqueios passados

### Profile
**Perfil do usuário logado** (adaptado por userType):

- **Todos**: Foto de perfil, nome, email, telefone
- **Customer**: 
  - Data de nascimento
  - Preferências de notificação
  - Opção "Sempre permitir uso de imagem"
  - Código de referência
- **Professional**: 
  - Especialização
  - Redes sociais (Instagram, Facebook, etc)
  - Métodos de pagamento aceitos
  - Biografia/descrição
- **Manager**: Informações administrativas

### Notifications
**Central de notificações:**

- Lista de notificações recentes
- Marcação de leitura individual ou em massa
- Filtros por tipo (agendamento, pagamento, sistema)
- Badge de contador não lido na sidebar
- Preferências de notificação (in-app, email, push)

### Analytics
**Dashboard gerencial** (acesso MANAGER):

- Gráficos de agendamentos (por período)
- Receitas e faturamento
- Serviços mais populares
- Performance de profissionais
- Taxa de no-show
- Média de avaliações
- Uso de MUI Charts (LineChart, BarChart, PieChart)

### Roles e Permissions
**Sistema RBAC completo:**

- Criação de roles customizadas
- Atribuição de permissões granulares
- Visualização de permissões por módulo
- Vinculação de roles a usuários

---

## 🎨 Componentes Reutilizáveis Importantes

### Pagination
**Componente de paginação usado em várias listas:**

```tsx
<Pagination
  totalItems={100}
  totalPages={10}
  currentPage={1}
  onPageChange={(page) => setCurrentPage(page)}
/>
```

**Features:**
- Botões de primeira/última página (ChevronDoubleLeft/Right)
- Botões de anterior/próximo (ChevronLeft/Right)
- Números de página dinâmicos com ellipsis (1, 2, 3, ..., 10)
- Design bronze (`#A4978A`) consistente com o tema
- Responsive (botões menores em mobile)
- Icons do Hero Icons

### StatusBadge
**Badge para exibir status com cores semânticas:**

```tsx
<StatusBadge text="Confirmado" color="green" />
```

Cores disponíveis:
- `green`: Sucesso, confirmado, avaliado
- `amber`: Pendente, avaliação pendente
- `red`: Erro, cancelado
- `blue`: Informação
- `gray`: Inativo

### Button
**Botão com múltiplas variantes:**

```tsx
<Button 
  label="Agendar"
  variant="primary"
  onClick={handleClick}
  disabled={isLoading}
/>
```

Variantes:
- `primary`: Botão principal bronze
- `outline`: Apenas borda
- `text-only`: Sem background
- `disabled`: Estado desabilitado

### UserCanAccessContainer
**Controle de acesso baseado em permissões:**

```tsx
<UserCanAccessContainer
  allowedPermissions={['customer.read', 'customer.write']}
  allowedUserTypes={[UserType.MANAGER]}
>
  <ConteudoProtegido />
</UserCanAccessContainer>
```

Se o usuário não tiver permissão, o conteúdo não é renderizado.

### ProfilePicture
**Foto de perfil com fallback:**

```tsx
<ProfilePicture
  size="md"
  profilePhotoUrl={user.profilePhotoUrl}
  displayName={user.name}
  variation="square-with-bg"
  filter="none" // ou "black-white" para agendamentos finalizados
/>
```

Se não houver foto, exibe iniciais do nome.

---

## 🎯 Padrões Avançados e Boas Práticas

### Separação de Responsabilidades

#### ❌ Anti-pattern: Lógica no Componente
```tsx
function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  
  useEffect(() => {
    setLoading(true)
    fetch(`/api/customers?page=${page}`)
      .then(res => res.json())
      .then(data => setCustomers(data))
      .finally(() => setLoading(false))
  }, [page])
  
  return (/* JSX */)
}
```

#### ✅ Boa Prática: Hook + RTK Query
```tsx
// Hook personalizado
function useCustomerList(initialPage = 1) {
  const [page, setPage] = useState(initialPage)
  const { data, isLoading, isError } = customerAPI.useFetchCustomersQuery({
    page,
    limit: 10
  })
  
  return {
    customers: data?.data || [],
    isLoading,
    isError,
    pagination: {
      currentPage: data?.page || 1,
      totalPages: data?.totalPages || 1,
      total: data?.total || 0,
      onPageChange: setPage
    }
  }
}

// Componente limpo
function CustomerList() {
  const { customers, isLoading, pagination } = useCustomerList()
  
  if (isLoading) return <Loading />
  
  return (
    <div>
      {customers.map(customer => <CustomerCard key={customer.id} customer={customer} />)}
      <Pagination {...pagination} />
    </div>
  )
}
```

### Performance com Prop Drilling Inteligente

**Problema:** Passar `userType` via prop é melhor que chamar `useAppSelector` em cada card quando há 10+ cards.

```tsx
// ✅ BOM: Busca userType uma vez na página
function AppointmentsPage() {
  const user = useAppSelector(state => state.auth.user!)
  
  return (
    <CustomerAppointments
      appointments={appointments}
      userType={user.userType} // Passa como prop
    />
  )
}

// Evita 10 chamadas ao Redux (uma por card)
function CustomerAppointmentCard({ userType, appointment }) {
  const displayName = userType === UserType.CUSTOMER
    ? appointment.professional.name
    : appointment.customer.name
}
```

### Validação com Zod - Patterns

#### Validação de Formulário
```typescript
import { z } from 'zod'

export const appointmentSchema = z.object({
  serviceId: z.string().uuid('ID de serviço inválido'),
  professionalId: z.string().uuid(),
  appointmentDate: z.string().datetime(),
  observation: z.string().max(500).optional(),
  allowImageUse: z.boolean()
}).strict() // Rejeita campos extras
```

#### Merge de Schemas
```typescript
// Reutilização de schemas
const professionalAttributes = z.object({
  professionalId: z.string(),
  name: z.string(),
  professionalPhotoUrl: z.string()
})

const appointmentFormData = AppointmentSchemas.createSchemaForm
  .merge(professionalAttributes)
  .extend({
    estimatedTime: z.number(),
    price: z.number()
  })
```

### Datas e Timezones com Luxon

**SEMPRE use timezone América/São Paulo para agendamentos:**

```typescript
import { DateTime } from 'luxon'

// Parse ISO com timezone
const appointmentDate = DateTime.fromISO(isoString, { zone: 'America/Sao_Paulo' })

// Ou setZone após parse
const date = DateTime.fromISO(isoString).setZone('America/Sao_Paulo')

// Formatação localizada
date.setLocale('pt-BR').toLocaleString(DateTime.DATE_FULL)
// "28 de novembro de 2025"

date.toFormat('dd/MM/yyyy HH:mm')
// "28/11/2025 14:30"

// Para exibir apenas horário
date.toFormat('HH:mm')
// "14:30"

// Dia da semana abreviado
date.setLocale('pt-BR').weekdayShort?.toUpperCase()
// "DOM"
```

### RTK Query - Cache e Invalidação

#### Padrão de Tags
```typescript
export const appointmentAPI = createApi({
  tagTypes: ['Appointments'],
  endpoints: (builder) => ({
    fetchAppointments: builder.query({
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Appointments' as const, id })),
              { type: 'Appointments', id: 'LIST' }
            ]
          : [{ type: 'Appointments', id: 'LIST' }]
    }),
    createAppointment: builder.mutation({
      invalidatesTags: [{ type: 'Appointments', id: 'LIST' }]
    }),
    updateAppointment: builder.mutation({
      invalidatesTags: (result, error, { id }) => [
        { type: 'Appointments', id },
        { type: 'Appointments', id: 'LIST' }
      ]
    })
  })
})
```

Isso garante que:
- Criar/deletar: recarrega a lista
- Atualizar: recarrega item específico + lista

#### Limpeza de Cache no Logout
```typescript
// src/store/auth/server-logout.ts
export const serverLogout = createAsyncThunk('auth/serverLogout', async (_, { dispatch }) => {
  await api.post('/auth/logout')
  
  // Limpa cache de TODAS as APIs
  dispatch(authAPI.util.resetApiState())
  dispatch(appointmentAPI.util.resetApiState())
  dispatch(customerAPI.util.resetApiState())
  // ... todas as outras APIs
  
  dispatch(logout())
})
```

---

## 🔒 Segurança e Autenticação Avançada

### Refresh Token com Mutex

O sistema usa **async-mutex** para evitar múltiplos refreshs simultâneos:

```typescript
// src/store/fetch-base/custom-fetch-base.ts
const mutex = new Mutex()

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  // Espera se outro refresh estiver em andamento
  await mutex.waitForUnlock()
  
  let result = await baseQuery(args, api, extraOptions)
  
  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      
      try {
        // Tenta refresh
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
        
        if (refreshResult.data) {
          // Sucesso: retry request original
          result = await baseQuery(args, api, extraOptions)
        } else {
          // Falhou: desloga
          api.dispatch(logout())
        }
      } finally {
        release()
      }
    }
  }
  
  return result
}
```

### Proteção de Rotas Granular

```tsx
<Route
  element={
    <PrivateRoute
      allowedUserTypes={[UserType.MANAGER, UserType.PROFESSIONAL]}
    />
  }
>
  <Route path="/shifts" element={<Shifts />} />
</Route>
```

Dentro do componente, controle mais fino:

```tsx
const { user } = useAppSelector(state => state.auth)
const canEdit = user.permissions.includes('shift.write')

return (
  <div>
    {canEdit ? <EditButton /> : <ViewOnlyMode />}
  </div>
)
```

---

## 🎨 Design System e Estilização

### Paleta de Cores

**Backgrounds:**
- `#1E1E1E` - Background principal (escuro)
- `#262626` - Cards e containers
- `#3A3027` - Hover states, active buttons

**Text:**
- `#D9D9D9` - Texto primário (alta legibilidade)
- `#C0C0C0` - Texto secundário
- `#A4978A` - Accent bronze (botões, links, ícones)

**Borders:**
- `#595149` - Borders sutis
- `#A4978A` - Borders em destaque (selected states)

**Status:**
- Green: `#10B981` - Sucesso
- Amber: `#F59E0B` - Aviso
- Red: `#EF4444` - Erro

### Classes Customizadas

```css
/* index.css */
.carousel-scrollbar::-webkit-scrollbar {
  height: 12px;
}

.carousel-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.carousel-scrollbar::-webkit-scrollbar-thumb {
  background-color: #8b7a6a;
  border-radius: 4px;
}
```

Uso:
```tsx
<div className="overflow-x-auto carousel-scrollbar">
  {/* Conteúdo com scroll horizontal */}
</div>
```

### Responsividade Mobile-First

```tsx
<div className="
  text-sm          // Mobile: 14px
  sm:text-base     // Tablet (640px+): 16px
  lg:text-lg       // Desktop (1024px+): 18px
  
  p-4              // Mobile: padding 16px
  sm:p-6           // Tablet: padding 24px
  lg:p-8           // Desktop: padding 32px
  
  landscape:gap-3  // Landscape mode: gap menor
  landscape:py-4   // Landscape mode: padding vertical menor
">
  Conteúdo responsivo
</div>
```

**Última atualização:** Novembro 2025  
**Versão:** 1.1.0