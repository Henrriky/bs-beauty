# Sistema de Navegação Inteligente - GoBackButton

## 📋 Visão Geral

O sistema de navegação inteligente implementado no BS Beauty utiliza um hook personalizado (`useSmartNavigation`) que define regras específicas de navegação para cada página, garantindo uma experiência de usuário consistente e intuitiva.

## 🏗️ Arquitetura

### Hook: `useSmartNavigation`
**Localização**: `/src/hooks/useSmartNavigation.ts`

O hook centraliza toda a lógica de navegação e fornece:
- Detecção automática se a página atual é uma home
- Regras de navegação baseadas em patterns de URL
- Labels contextuais para o botão "Voltar"
- Função `goBack()` que executa a navegação correta

### Componente: `GoBackButton`
**Localização**: `/src/components/button/GoBackButton.tsx`

Componente simples que:
- Consome o hook `useSmartNavigation`
- Renderiza automaticamente apenas quando necessário (não aparece na home)
- Exibe label contextual baseado na página atual
- Atua como wrapper com `<Outlet />` para páginas aninhadas

## 🎯 Regras de Navegação

### Hierarquia Padrão
```
Home
├── Payments (Lista)
│   └── Payment Detail → volta para /payments
├── Appointments (Lista)
│   └── Appointment Detail → volta para /appointments
├── Customers → volta para Home
├── Professionals → volta para Home
├── Services → volta para Home
├── Shifts → volta para Home
├── Blocked Times → volta para Home
├── Analytics Reports → volta para Home
├── Roles → volta para Home
├── Notification Templates → volta para Home
├── Notifications → volta para Home
└── Profile → volta para Home
```

### Como Funciona

1. **Detecção de Home**: O hook identifica automaticamente qual é a home do usuário baseado no `userType`:
   - `CUSTOMER` → `/customer/home`
   - `PROFESSIONAL` → `/professional/home`
   - `MANAGER` → `/manager/home`

2. **Matching de Padrão**: A URL atual é testada contra uma lista de regras (patterns regex) para determinar o destino correto

3. **Fallback Inteligente**: Se nenhuma regra específica for encontrada, o botão sempre volta para a home apropriada do usuário

## 📝 Estrutura de Regras

Cada regra no array `navigationRules` possui:

```typescript
interface NavigationRule {
  pattern: RegExp              // Pattern regex para matching de URL
  backTo: string | Function    // Destino (string fixa ou função dinâmica)
  label?: string              // Label exibido no botão
}
```

### Exemplo de Regra
```typescript
{
  pattern: /^\/payments\/([^/]+)$/,     // Match: /payments/:id
  backTo: '/payments',                   // Destino: lista de payments
  label: 'Voltar para Registros de Pagamento',
}
```

## 🔧 Como Adicionar Nova Regra

### Cenário 1: Página de Lista → Home
```typescript
{
  pattern: /^\/minha-nova-pagina$/,
  backTo: getHomeRoute(),
  label: 'Voltar para Início',
}
```

### Cenário 2: Página de Detalhes → Lista
```typescript
{
  pattern: /^\/minha-pagina\/([^/]+)$/,  // Captura ID na URL
  backTo: '/minha-pagina',
  label: 'Voltar para Minha Página',
}
```

### Cenário 3: Navegação Condicional Complexa
```typescript
{
  pattern: /^\/minha-pagina\/([^/]+)\/edit$/,
  backTo: (matches) => `/minha-pagina/${matches[1]}`, // Usa ID capturado
  label: 'Voltar para Detalhes',
}
```

## 🚀 Como Usar

### 1. No Componente de Rota (Atual)
```tsx
// routes/index.tsx
<Route element={<GoBackButton />}>
  <Route path="/payments" element={<PaymentRecords />} />
  <Route path="/payments/:paymentRecordId" element={<PaymentRecordDetails />} />
  // ... outras rotas
</Route>
```

### 2. Programaticamente em Qualquer Componente
```tsx
import { useSmartNavigation } from '../hooks/useSmartNavigation'

function MeuComponente() {
  const { goBack, navigationInfo } = useSmartNavigation()
  
  // Usar programaticamente
  const handleCancel = () => {
    goBack() // Volta para o destino correto automaticamente
  }
  
  // Verificar destino atual
  console.log(navigationInfo?.backTo)    // '/payments'
  console.log(navigationInfo?.label)     // 'Voltar para Registros de Pagamento'
}
```

## 🎨 Personalização

### Alterar Label Dinamicamente
```typescript
{
  pattern: /^\/payments\/([^/]+)$/,
  backTo: '/payments',
  label: (matches) => {
    const id = matches[1]
    return `Voltar da Transação #${id}`
  },
}
```

### Navegação Condicional por Role
```typescript
{
  pattern: /^\/admin\/settings$/,
  backTo: (matches) => {
    const userType = getUserType() // Implementar função
    return userType === 'MANAGER' ? '/manager/home' : '/professional/home'
  },
  label: 'Voltar',
}
```

## ⚠️ Comportamentos Especiais

### Páginas Sem GoBackButton
O botão **não aparece** automaticamente em:
- `/customer/home`
- `/professional/home`
- `/manager/home`

### Ordem de Prioridade
1. Verifica se é home → não renderiza
2. Testa regras específicas na ordem do array
3. Se nenhuma regra corresponder → volta para home

### URLs Não Mapeadas
Para qualquer URL que não tenha regra específica, o sistema automaticamente volta para a home apropriada do usuário.

## 🔍 Debugging

### Ver Informações de Navegação Atual
```tsx
const { navigationInfo, isHomePage } = useSmartNavigation()

console.log({
  isHome: isHomePage,
  destination: navigationInfo?.backTo,
  label: navigationInfo?.label,
})
```

## 🎯 Benefícios

✅ **Consistência**: Navegação uniforme em toda aplicação  
✅ **Manutenibilidade**: Regras centralizadas em um único local  
✅ **Flexibilidade**: Fácil adicionar/modificar regras  
✅ **Type-Safe**: TypeScript garante contratos de tipos  
✅ **Testável**: Lógica isolada no hook facilita testes  
✅ **DX Melhorada**: Desenvolvedores não precisam pensar em navegação manual  

## 📚 Referências

- Hook: `/src/hooks/useSmartNavigation.ts`
- Componente: `/src/components/button/GoBackButton.tsx`
- Rotas: `/src/routes/index.tsx`
- Guia Frontend: `/front-end/AGENTS.MD`
