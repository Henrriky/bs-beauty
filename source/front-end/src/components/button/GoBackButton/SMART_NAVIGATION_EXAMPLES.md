# Exemplos Práticos - Sistema de Navegação Inteligente

## 🎯 Fluxos de Navegação Implementados

### 1. Fluxo de Pagamentos (Manager/Professional)

```
Manager Home (/manager/home)
    ↓ clica em "Registros de Pagamento"
Payments List (/payments)
    ↓ clica em um pagamento específico
Payment Detail (/payments/abc-123)
    ↓ clica no GoBackButton "Voltar para Registros de Pagamento"
Payments List (/payments)
    ↓ clica no GoBackButton "Voltar para Início"
Manager Home (/manager/home)
```

### 2. Fluxo de Agendamentos (Todos os Usuários)

```
Customer Home (/customer/home)
    ↓ clica em "Agendamentos"
Appointments List (/appointments)
    ↓ clica em um agendamento específico
Appointment Detail (/appointments/xyz-456)
    ↓ clica no GoBackButton "Voltar para Agendamentos"
Appointments List (/appointments)
    ↓ clica no GoBackButton "Voltar para Início"
Customer Home (/customer/home)
```

### 3. Fluxo de Configurações (Manager)

```
Manager Home (/manager/home)
    ↓ clica em "Clientes"
Customers List (/manager/customers)
    ↓ clica no GoBackButton "Voltar para Início"
Manager Home (/manager/home)
```

### 4. Fluxo de Analytics (Manager/Professional)

```
Professional Home (/professional/home)
    ↓ clica em "Relatórios"
Analytics Dashboard (/analytics/reports)
    ↓ visualiza gráficos e métricas
    ↓ clica no GoBackButton "Voltar para Início"
Professional Home (/professional/home)
```

## 🧪 Casos de Teste

### Teste 1: Navegação Básica Detail → List
**Cenário**: Usuário Manager visualizando detalhes de pagamento

```typescript
// Estado inicial
currentPath = '/payments/abc-123'
userType = 'MANAGER'

// Resultado esperado do hook
{
  isHomePage: false,
  navigationInfo: {
    backTo: '/payments',
    label: 'Voltar para Registros de Pagamento'
  }
}

// Ao clicar no botão
navigate('/payments') // ✅
```

### Teste 2: Navegação List → Home
**Cenário**: Usuário Professional na lista de agendamentos

```typescript
// Estado inicial
currentPath = '/appointments'
userType = 'PROFESSIONAL'

// Resultado esperado do hook
{
  isHomePage: false,
  navigationInfo: {
    backTo: '/professional/home',
    label: 'Voltar para Início'
  }
}

// Ao clicar no botão
navigate('/professional/home') // ✅
```

### Teste 3: Página Home (Botão Não Aparece)
**Cenário**: Usuário Customer na home

```typescript
// Estado inicial
currentPath = '/customer/home'
userType = 'CUSTOMER'

// Resultado esperado do hook
{
  isHomePage: true,
  navigationInfo: null
}

// Componente GoBackButton
return <Outlet /> // Não renderiza o botão ✅
```

### Teste 4: URL Não Mapeada
**Cenário**: Página sem regra específica

```typescript
// Estado inicial
currentPath = '/alguma-pagina-nova'
userType = 'MANAGER'

// Resultado esperado do hook (fallback)
{
  isHomePage: false,
  navigationInfo: {
    backTo: '/manager/home',
    label: 'Voltar para Início'
  }
}

// Comportamento: Sempre volta para home apropriada ✅
```

## 💡 Exemplos de Uso Programático

### Exemplo 1: Botão de Cancelamento em Formulário

```tsx
import { useSmartNavigation } from '../hooks/useSmartNavigation'

function PaymentForm() {
  const { goBack } = useSmartNavigation()
  const [formData, setFormData] = useState({})

  const handleCancel = () => {
    if (window.confirm('Descartar alterações?')) {
      goBack() // Volta automaticamente para o destino correto
    }
  }

  return (
    <form>
      {/* campos do formulário */}
      <Button onClick={handleCancel}>Cancelar</Button>
    </form>
  )
}
```

### Exemplo 2: Navegação Após Sucesso

```tsx
function CreatePaymentPage() {
  const { goBack, navigationInfo } = useSmartNavigation()
  const [createPayment] = useCreatePaymentMutation()

  const handleSubmit = async (data) => {
    try {
      await createPayment(data).unwrap()
      toast.success('Pagamento criado com sucesso!')
      goBack() // Volta para /payments automaticamente
    } catch (error) {
      toast.error('Erro ao criar pagamento')
    }
  }

  return <PaymentForm onSubmit={handleSubmit} />
}
```

### Exemplo 3: Breadcrumb Dinâmico

```tsx
function DynamicBreadcrumb() {
  const { navigationInfo, isHomePage } = useSmartNavigation()
  const location = useLocation()

  const getBreadcrumbs = () => {
    if (isHomePage) {
      return ['Início']
    }

    const breadcrumbs = ['Início']
    
    if (navigationInfo?.backTo !== getHomeRoute()) {
      breadcrumbs.push(navigationInfo.label)
    }
    
    breadcrumbs.push(getCurrentPageTitle(location.pathname))
    
    return breadcrumbs
  }

  return (
    <nav>
      {getBreadcrumbs().map((crumb, i) => (
        <span key={i}>{crumb} {i < breadcrumbs.length - 1 && '>'}</span>
      ))}
    </nav>
  )
}
```

## 🎨 Customizações Avançadas

### Adicionar Confirmação Antes de Sair

```tsx
function GoBackButtonWithConfirmation() {
  const { goBack, isHomePage, navigationInfo } = useSmartNavigation()
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const handleGoBack = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('Você tem alterações não salvas. Deseja sair?')) {
        goBack()
      }
    } else {
      goBack()
    }
  }

  if (isHomePage || !navigationInfo) {
    return <Outlet />
  }

  return (
    <>
      <Button onClick={handleGoBack}>
        {navigationInfo.label}
      </Button>
      <Outlet />
    </>
  )
}
```

### Navegação com Analytics

```tsx
function GoBackButtonWithTracking() {
  const { goBack, navigationInfo } = useSmartNavigation()
  const location = useLocation()

  const handleGoBack = () => {
    // Rastrear navegação
    analytics.track('navigation_back', {
      from: location.pathname,
      to: navigationInfo?.backTo,
    })
    
    goBack()
  }

  return <Button onClick={handleGoBack} />
}
```

## 🔧 Manutenção

### Adicionar Nova Página com Regra

**Cenário**: Adicionando página de "Ofertas" com detalhes

```typescript
// 1. Adicionar regras no useSmartNavigation.ts
const navigationRules: NavigationRule[] = [
  // ... regras existentes
  
  // Offer Detail → Offer List
  {
    pattern: /^\/offers\/([^/]+)$/,
    backTo: '/offers',
    label: 'Voltar para Ofertas',
  },
  
  // Offer List → Home
  {
    pattern: /^\/offers$/,
    backTo: getHomeRoute(),
    label: 'Voltar para Início',
  },
]

// 2. Adicionar rotas em routes/index.tsx
<Route element={<GoBackButton />}>
  <Route path="/offers" element={<OffersList />} />
  <Route path="/offers/:offerId" element={<OfferDetails />} />
</Route>

// Pronto! ✅ Sistema funcionando automaticamente
```

## 📊 Diagrama de Estados

```
┌─────────────┐
│   Home      │ ← GoBackButton NÃO aparece
└─────────────┘
      │
      ├──→ Lista 1 ───→ Detalhe 1
      │        │              │
      │        └──────────────┘
      │     (GoBackButton: "Voltar para Lista 1")
      │
      ├──→ Lista 2 ───→ Detalhe 2
      │        │              │
      │        └──────────────┘
      │     (GoBackButton: "Voltar para Lista 2")
      │
      └──→ Página Simples
           (GoBackButton: "Voltar para Início")
```

## ✅ Checklist de Implementação

Ao adicionar nova página que precisa do GoBackButton:

- [ ] Página tem navegação hierárquica? (Detail → List → Home)
- [ ] Adicionar regra para Detail → List (se aplicável)
- [ ] Adicionar regra para List → Home
- [ ] Label descritivo e contextual definido
- [ ] Rotas envolvidas com `<GoBackButton />` wrapper
- [ ] Testar navegação com diferentes userTypes
- [ ] Verificar se botão não aparece na home
- [ ] Testar fallback para URLs não mapeadas

## 🐛 Troubleshooting

### Problema: Botão aparece na home
**Solução**: Verificar se a home está na lista `homeRoutes` no hook

### Problema: Botão volta para lugar errado
**Solução**: Verificar ordem das regras no array `navigationRules` (primeira match vence)

### Problema: Label não contextual
**Solução**: Adicionar/modificar propriedade `label` na regra específica

### Problema: Navegação para página inexistente
**Solução**: Verificar se a rota de destino existe em `routes/index.tsx`
