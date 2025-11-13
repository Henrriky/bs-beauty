import { describe, expect, it } from 'vitest'
import {
  extractPlaceholders,
  replacePlaceholders,
  renderTemplate,
  expectedVarsOf,
  validateVars
} from '@/utils/formatting/placeholder.util'

describe('Placeholder Util', () => {
  describe('extractPlaceholders', () => {
    it('should extract placeholders from text', () => {
      const text = 'Hello {name}, your order {orderId} is ready!'
      const result = extractPlaceholders(text)

      expect(result).toEqual(['name', 'orderId'])
    })

    it('should return empty array for text without placeholders', () => {
      const text = 'Hello world, no placeholders here'
      const result = extractPlaceholders(text)

      expect(result).toEqual([])
    })

    it('should return empty array for empty string', () => {
      const result = extractPlaceholders('')

      expect(result).toEqual([])
    })

    it('should handle multiple occurrences of same placeholder', () => {
      const text = 'Hi {name}, {name} is great!'
      const result = extractPlaceholders(text)

      expect(result).toEqual(['name', 'name'])
    })

    it('should extract placeholders with numbers', () => {
      const text = 'Item {item1} and {item2}'
      const result = extractPlaceholders(text)

      expect(result).toEqual(['item1', 'item2'])
    })

    it('should extract placeholders with underscores', () => {
      const text = 'User {user_name} has {user_id}'
      const result = extractPlaceholders(text)

      expect(result).toEqual(['user_name', 'user_id'])
    })

    it('should handle placeholders with unicode characters', () => {
      const text = 'Olá {nome}, seu pedido {númeroPedido} está pronto'
      const result = extractPlaceholders(text)

      expect(result).toEqual(['nome', 'númeroPedido'])
    })

    it('should not extract placeholders longer than 64 characters', () => {
      const longPlaceholder = 'a'.repeat(65)
      const text = `Hello {${longPlaceholder}}`
      const result = extractPlaceholders(text)

      expect(result).toEqual([])
    })

    it('should extract placeholder with exactly 64 characters', () => {
      const placeholder = 'a'.repeat(64)
      const text = `Hello {${placeholder}}`
      const result = extractPlaceholders(text)

      expect(result).toEqual([placeholder])
    })
  })

  describe('replacePlaceholders', () => {
    it('should replace placeholders with values', () => {
      const text = 'Hello {name}, you are {age} years old'
      const values = { name: 'John', age: 30 }
      const result = replacePlaceholders(text, values)

      expect(result).toBe('Hello John, you are 30 years old')
    })

    it('should keep placeholder if value not provided', () => {
      const text = 'Hello {name}, {greeting}'
      const values = { name: 'John' }
      const result = replacePlaceholders(text, values)

      expect(result).toBe('Hello John, {greeting}')
    })

    it('should handle empty values object', () => {
      const text = 'Hello {name}'
      const values = {}
      const result = replacePlaceholders(text, values)

      expect(result).toBe('Hello {name}')
    })

    it('should return same text if no placeholders', () => {
      const text = 'Hello world'
      const values = { name: 'John' }
      const result = replacePlaceholders(text, values)

      expect(result).toBe('Hello world')
    })

    it('should handle empty string', () => {
      const result = replacePlaceholders('', { name: 'John' })

      expect(result).toBe('')
    })

    it('should convert numbers to strings', () => {
      const text = 'Order {orderId} costs {price}'
      const values = { orderId: 123, price: 99.99 }
      const result = replacePlaceholders(text, values)

      expect(result).toBe('Order 123 costs 99.99')
    })

    it('should handle multiple replacements of same placeholder', () => {
      const text = '{name} loves {name}'
      const values = { name: 'Alice' }
      const result = replacePlaceholders(text, values)

      expect(result).toBe('Alice loves Alice')
    })

    it('should handle special characters in values', () => {
      const text = 'Message: {message}'
      const values = { message: 'Hello! @#$%' }
      const result = replacePlaceholders(text, values)

      expect(result).toBe('Message: Hello! @#$%')
    })
  })

  describe('renderTemplate', () => {
    it('should render both title and body', () => {
      const title = 'Welcome {name}'
      const body = 'Hello {name}, you have {count} messages'
      const values = { name: 'John', count: 5 }

      const result = renderTemplate(title, body, values)

      expect(result).toEqual({
        title: 'Welcome John',
        body: 'Hello John, you have 5 messages'
      })
    })

    it('should handle templates without placeholders', () => {
      const title = 'Static Title'
      const body = 'Static Body'
      const values = { name: 'John' }

      const result = renderTemplate(title, body, values)

      expect(result).toEqual({
        title: 'Static Title',
        body: 'Static Body'
      })
    })

    it('should keep unmatched placeholders', () => {
      const title = 'Hello {name}'
      const body = 'Your code is {code}'
      const values = { name: 'Alice' }

      const result = renderTemplate(title, body, values)

      expect(result).toEqual({
        title: 'Hello Alice',
        body: 'Your code is {code}'
      })
    })
  })

  describe('expectedVarsOf', () => {
    it('should return variables from variables property if present', () => {
      const template = {
        variables: ['name', 'email'],
        title: 'Hello {name}',
        body: 'Email: {email}, Phone: {phone}'
      }

      const result = expectedVarsOf(template)

      expect(result).toEqual(['name', 'email'])
    })

    it('should extract from title and body if no variables property', () => {
      const template = {
        title: 'Hello {name}',
        body: 'Your order {orderId} is ready'
      }

      const result = expectedVarsOf(template)

      expect(result).toContain('name')
      expect(result).toContain('orderId')
    })

    it('should return unique variables', () => {
      const template = {
        title: 'Hello {name}',
        body: 'Bye {name}'
      }

      const result = expectedVarsOf(template)

      expect(result).toEqual(['name'])
    })

    it('should handle empty template', () => {
      const template = {
        title: '',
        body: ''
      }

      const result = expectedVarsOf(template)

      expect(result).toEqual([])
    })

    it('should return empty array if variables is not a string array', () => {
      const template = {
        variables: 'not-an-array',
        title: 'Hello {name}',
        body: 'Body'
      }

      const result = expectedVarsOf(template)

      expect(result).toContain('name')
    })
  })

  describe('validateVars', () => {
    it('should validate when all expected variables are provided', () => {
      const expected = ['name', 'email']
      const provided = { name: 'John', email: 'john@example.com' }

      const result = validateVars(expected, provided)

      expect(result).toEqual({
        ok: true,
        missing: [],
        extra: []
      })
    })

    it('should detect missing variables', () => {
      const expected = ['name', 'email', 'phone']
      const provided = { name: 'John' }

      const result = validateVars(expected, provided)

      expect(result.ok).toBe(false)
      expect(result.missing).toEqual(['email', 'phone'])
    })

    it('should detect extra variables', () => {
      const expected = ['name']
      const provided = { name: 'John', email: 'john@example.com', age: 30 }

      const result = validateVars(expected, provided)

      expect(result.ok).toBe(true)
      expect(result.extra).toContain('email')
      expect(result.extra).toContain('age')
    })

    it('should detect both missing and extra variables', () => {
      const expected = ['name', 'email']
      const provided = { name: 'John', age: 30 }

      const result = validateVars(expected, provided)

      expect(result.ok).toBe(false)
      expect(result.missing).toEqual(['email'])
      expect(result.extra).toEqual(['age'])
    })

    it('should handle empty expected array', () => {
      const expected: string[] = []
      const provided = { name: 'John' }

      const result = validateVars(expected, provided)

      expect(result.ok).toBe(true)
      expect(result.missing).toEqual([])
      expect(result.extra).toEqual(['name'])
    })

    it('should handle empty provided object', () => {
      const expected = ['name', 'email']
      const provided = {}

      const result = validateVars(expected, provided)

      expect(result.ok).toBe(false)
      expect(result.missing).toEqual(['name', 'email'])
      expect(result.extra).toEqual([])
    })
  })
})
