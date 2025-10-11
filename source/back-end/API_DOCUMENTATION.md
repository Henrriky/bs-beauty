# 🔐 API Documentation - Role-Based Permission System

## 📋 Visão Geral

Esta documentação descreve os endpoints desenvolvidos para o sistema de permissões dinâmicas baseado em roles no BS-Beauty Backend.

**Base URL:** `http://localhost:3000/api`

**Autenticação:** Bearer Token (JWT) no header `Authorization: Bearer <token>`

---

## 🎭 Roles Endpoints

### 1. Listar Roles (Paginado)
**GET** `/roles`

**Autenticação:** MANAGER

**Query Parameters:**
```typescript
{
  page?: number = 1,
  limit?: number = 10,
  name?: string,        // Filtro por nome da role
  isActive?: boolean    // Filtro por status ativo/inativo
}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "role-123",
      "name": "MANAGER",
      "description": "Manager role with full permissions",
      "isActive": true,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 45,
    "itemsPerPage": 10
  }
}
```

### 2. Listar Todas as Roles (Sem Paginação)
> **⚠️ NOTA: Este endpoint não está implementado nas rotas. Use o endpoint paginado com limit alto se necessário.**

### 2. Buscar Role por ID
**GET** `/roles/:id`

**Autenticação:** MANAGER

**Path Parameters:**
- `id` (string): ID da role

**Response (200):**
```json
{
  "id": "role-123",
  "name": "MANAGER",
  "description": "Manager role with full permissions",
  "isActive": true,
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T10:00:00.000Z"
}
```

**Response (404):**
```json
{
  "message": "Role not found"
}
```

### 3. Criar Nova Role
**POST** `/roles`

**Autenticação:** MANAGER

**Request Body:**
```json
{
  "name": "NEW_ROLE",
  "description": "Description of the new role",
  "isActive": true // opcional, default: true
}
```

**Response (201):**
```json
{
  "id": "role-789",
  "name": "NEW_ROLE",
  "description": "Description of the new role",
  "isActive": true,
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T10:00:00.000Z"
}
```

**Response (400) - Validation Error:**
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

### 4. Atualizar Role
**PUT** `/roles/:id`

**Autenticação:** MANAGER

**Path Parameters:**
- `id` (string): ID da role

**Request Body:**
```json
{
  "name": "UPDATED_ROLE",
  "description": "Updated description",
  "isActive": false
}
```

**Response (200):**
```json
{
  "id": "role-123",
  "name": "UPDATED_ROLE",
  "description": "Updated description",
  "isActive": false,
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

### 5. Deletar Role
**DELETE** `/roles/:id`

**Autenticação:** MANAGER

**Path Parameters:**
- `id` (string): ID da role

**Response (200):**
```json
{
  "id": "role-123",
  "name": "DELETED_ROLE",
  "description": "Role that was deleted",
  "isActive": true,
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T10:00:00.000Z"
}
```

**Response (400) - Constraint Error:**
```json
{
  "message": "Cannot delete role: 3 professionals are still associated with this role"
}
```

### 6. Listar Associações da Role
**GET** `/roles/:id/associations`

**Autenticação:** MANAGER

**Path Parameters:**
- `id` (string): ID da role

**Query Parameters:**
```typescript
{
  page?: number = 1,
  limit?: number = 10,
  type?: 'permission' | 'professional' | 'all' = 'all'
}
```

**Response (200):**
```json
{
  "data": [
    {
      "permissions": [
        {
          "id": "perm-123",
          "name": "CREATE_APPOINTMENT",
          "description": "Permission to create appointments",
          "createdAt": "2025-01-01T10:00:00.000Z",
          "updatedAt": "2025-01-01T10:00:00.000Z"
        }
      ],
      "professionals": [
        {
          "id": "prof-456",
          "name": "João Silva",
          "email": "joao@example.com",
          "specialization": "Corte e escova",
          "profilePhotoUrl": "https://example.com/photo.jpg",
          "contact": "+55 11 99999-9999",
          "paymentMethods": ["PIX", "CARTAO_CREDITO"],
          "isActive": true,
          "registerCompleted": true,
          "googleId": "google-123",
          "createdAt": "2025-01-01T10:00:00.000Z",
          "updatedAt": "2025-01-01T10:00:00.000Z"
        }
      ],
      "totalPermissions": 5,
      "totalProfessionals": 3
    }
  ],
  "total": 8,
  "page": 1,
  "totalPages": 1,
  "limit": 10
}
```

**Observações:**
- Quando `type=permission`: apenas permissions são retornadas (professionals array vazio)
- Quando `type=professional`: apenas professionals são retornados (permissions array vazio)  
- Quando `type=all` ou omitido: ambos são retornados
- Os campos `totalPermissions` e `totalProfessionals` sempre mostram o total geral
- O `total` no pagination varia conforme o filtro `type`

### 7. Adicionar Permissão à Role
**POST** `/roles/:id/permissions`

**Autenticação:** MANAGER

**Path Parameters:**
- `id` (string): ID da role

**Request Body:**
```json
{
  "permissionId": "perm-123"
}
```

**Response (201):**
```json
{
  "message": "Permission added to Role successfully"
}
```

**Response (400) - Already Associated:**
```json
{
  "message": "Permission is already associated with this role"
}
```

### 8. Remover Permissão da Role
**DELETE** `/roles/:id/permissions`

**Autenticação:** MANAGER

**Path Parameters:**
- `id` (string): ID da role

**Request Body:**
```json
{
  "permissionId": "perm-123"
}
```

**Response (200):**
```json
{
  "message": "Permission removed from Role successfully"
}
```

---

## 👨‍💼 Professionals Endpoints

### 1. Listar Professionals (Paginado)
**GET** `/professionals`

**Autenticação:** MANAGER | CUSTOMER

**Query Parameters:**
```typescript
{
  page?: number = 1,
  limit?: number = 10,
  name?: string,           // Filtro por nome
  email?: string,          // Filtro por email
  specialization?: string, // Filtro por especialização
  isActive?: boolean       // Filtro por status ativo/inativo
}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "prof-123",
      "name": "João Silva",
      "email": "joao@example.com",
      "specialization": "Corte e escova",
      "profilePhotoUrl": "https://example.com/photo.jpg",
      "isActive": true,
      "registerCompleted": true,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 10
  }
}
```

### 2. Buscar Professional por ID
**GET** `/professionals/:id`

**Autenticação:** MANAGER

**Path Parameters:**
- `id` (string): ID do professional

**Response (200):**
```json
{
  "id": "prof-123",
  "name": "João Silva",
  "email": "joao@example.com",
  "specialization": "Corte e escova",
  "profilePhotoUrl": "https://example.com/photo.jpg",
  "contact": "+55 11 99999-9999",
  "paymentMethods": ["PIX", "CARTAO_CREDITO", "DINHEIRO"],
  "isActive": true,
  "registerCompleted": true,
  "googleId": "google-123",
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T10:00:00.000Z"
}
```

### 3. Criar Professional
**POST** `/professionals`

**Autenticação:** MANAGER

**Request Body:**
```json
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "specialization": "Manicure e pedicure",
  "contact": "+55 11 88888-8888",
  "paymentMethods": ["PIX", "DINHEIRO"],
  "profilePhotoUrl": "https://example.com/maria.jpg", // opcional
  "isActive": true, // opcional, default: true
  "registerCompleted": false // opcional, default: false
}
```

**Response (201):**
```json
{
  "id": "prof-456",
  "name": "Maria Santos",
  "email": "maria@example.com",
  "specialization": "Manicure e pedicure",
  "contact": "+55 11 88888-8888",
  "paymentMethods": ["PIX", "DINHEIRO"],
  "profilePhotoUrl": "https://example.com/maria.jpg",
  "isActive": true,
  "registerCompleted": false,
  "googleId": null,
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T10:00:00.000Z"
}
```

### 4. Atualizar Professional
**PUT** `/professionals/:id`

**Autenticação:** MANAGER | PROFESSIONAL (próprio perfil)

**Path Parameters:**
- `id` (string): ID do professional

**Request Body:**
```json
{
  "name": "João Silva Santos",
  "specialization": "Corte, escova e coloração",
  "contact": "+55 11 99999-8888",
  "paymentMethods": ["PIX", "CARTAO_CREDITO"],
  "isActive": true
}
```

**Response (200):**
```json
{
  "id": "prof-123",
  "name": "João Silva Santos",
  "email": "joao@example.com",
  "specialization": "Corte, escova e coloração",
  "contact": "+55 11 99999-8888",
  "paymentMethods": ["PIX", "CARTAO_CREDITO"],
  "profilePhotoUrl": "https://example.com/photo.jpg",
  "isActive": true,
  "registerCompleted": true,
  "googleId": "google-123",
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

### 5. Deletar Professional
**DELETE** `/professionals/:id`

**Autenticação:** MANAGER

**Path Parameters:**
- `id` (string): ID do professional

**Response (200):**
```json
{
  "id": "prof-123",
  "name": "João Silva",
  "email": "joao@example.com",
  "specialization": "Corte e escova",
  "isActive": false,
  "registerCompleted": true,
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

### 6. Buscar Serviços Oferecidos pelo Professional
**GET** `/professionals/:id/offers/service`

**Autenticação:** Não requerida

**Path Parameters:**
- `id` (string): ID do professional

**Query Parameters:**
```typescript
{
  page?: number = 1,
  limit?: number = 10,
  serviceName?: string,  // Filtro por nome do serviço
  isActive?: boolean     // Filtro por status ativo/inativo
}
```

**Response (200):**
```json
{
  "professional": {
    "id": "prof-123",
    "name": "João Silva",
    "email": "joao@example.com",
    "specialization": "Corte e escova",
    "offers": {
      "data": [
        {
          "id": "offer-123",
          "price": 50.00,
          "isActive": true,
          "isOffering": true,
          "createdAt": "2025-01-01T10:00:00.000Z",
          "service": {
            "id": "service-123",
            "name": "Corte Masculino",
            "description": "Corte de cabelo masculino tradicional",
            "estimatedDuration": 30
          }
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 2,
        "totalItems": 15,
        "itemsPerPage": 10
      }
    }
  }
}
```

### 7. Adicionar Role ao Professional
**POST** `/professionals/:id/roles`

**Autenticação:** MANAGER

**Path Parameters:**
- `id` (string): ID do professional

**Request Body:**
```json
{
  "roleId": "role-123"
}
```

**Response (200):**
```json
{
  "message": "Role added to professional successfully"
}
```

**Response (400) - Already Associated:**
```json
{
  "message": "Professional already has this role"
}
```

**Response (404) - Professional Not Found:**
```json
{
  "message": "Professional not found"
}
```

**Response (404) - Role Not Found:**
```json
{
  "message": "Role not found"
}
```

### 8. Remover Role do Professional
**DELETE** `/professionals/:id/roles`

**Autenticação:** MANAGER

**Path Parameters:**
- `id` (string): ID do professional

**Request Body:**
```json
{
  "roleId": "role-123"
}
```

**Response (200):**
```json
{
  "message": "Role removed from professional successfully"
}
```

**Response (400) - Not Associated:**
```json
{
  "message": "Professional does not have this role"
}
```

---

## 🔐 Permissions Endpoints

### 1. Listar Permissions (Paginado)
**GET** `/permissions`

**Autenticação:** MANAGER

**Query Parameters:**
```typescript
{
  page?: number = 1,
  limit?: number = 10,
  resource?: string,    // Filtro por resource (case insensitive)
  action?: string,      // Filtro por action (case insensitive)
  search?: string       // Busca textual em description, resource ou action (case insensitive)
}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "perm-123",
      "resource": "USER",
      "action": "CREATE",
      "description": "Permission to create users",
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    },
    {
      "id": "perm-456",
      "resource": "SERVICE",
      "action": "APPROVE",
      "description": "Aprovar serviço",
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  ],
  "total": 40,
  "page": 1,
  "totalPages": 4,
  "limit": 10
}
```

**Exemplos de Filtros:**
- `GET /permissions?resource=USER` - Apenas permissions com resource=USER
- `GET /permissions?action=CREATE` - Apenas permissions com action=CREATE
- `GET /permissions?search=aprovar` - Busca por "aprovar" em description/resource/action
- `GET /permissions?resource=SERVICE&action=APPROVE` - Filtros combinados
- `GET /permissions?page=2&limit=20` - Paginação customizada

**Response (403) - Acesso Negado:**
```json
{
  "message": "Access denied. Insufficient permissions."
}
```

---

## ❌ Códigos de Erro Comuns

### 400 - Bad Request
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "message": "Access denied. No token provided."
}
```

### 403 - Forbidden
```json
{
  "message": "Access denied. Insufficient permissions."
}
```

### 404 - Not Found
```json
{
  "message": "Resource not found"
}
```

### 409 - Conflict
```json
{
  "message": "Email already exists"
}
```

### 500 - Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## 🔒 Sistema de Autenticação

### Headers Obrigatórios
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Roles Disponíveis
- `MANAGER`: Acesso completo ao sistema
- `PROFESSIONAL`: Acesso limitado aos próprios dados
- `CUSTOMER`: Acesso de leitura limitado

### Estrutura do JWT Token
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "role": "MANAGER",
  "iat": 1640995200,
  "exp": 1641081600
}
```

---

## 📝 Notas Importantes

1. **Paginação Padrão:** page=1, limit=10
2. **Filtros:** Todos os filtros de string são case-insensitive
3. **Datas:** Formato ISO 8601 (UTC)
4. **IDs:** UUIDs v4
5. **Valores Monetários:** Números decimais (ex: 50.00)
6. **Arrays Vazios:** Retornados como `[]` quando não há dados
7. **Campos Opcionais:** Podem ser omitidos no request body
8. **Soft Delete:** Recursos deletados são marcados como `isActive: false`

---

## 🚀 Exemplos de Uso Frontend

### JavaScript/TypeScript
```typescript
// Listar roles com paginação
const response = await fetch('/api/roles?page=1&limit=5', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const roles = await response.json();

// Adicionar role ao professional
const addRoleResponse = await fetch('/api/professionals/prof-123/roles', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ roleId: 'role-456' })
});

// Criar nova role
const createRoleResponse = await fetch('/api/roles', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'SUPERVISOR',
    description: 'Supervisor role with elevated permissions'
  })
});
```

Esta documentação cobre todos os endpoints implementados no sistema de roles e permissões dinâmicas. Use estes exemplos como base para implementar o frontend! 🎯