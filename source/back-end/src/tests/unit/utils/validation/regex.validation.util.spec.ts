import { describe, expect, it } from 'vitest'
import { RegexPatterns } from '@/utils/validation/regex.validation.util'

describe('RegexPatterns', () => {
  describe('names', () => {
    it('should match valid simple names', () => {
      expect(RegexPatterns.names.test('João')).toBe(true)
      expect(RegexPatterns.names.test('Maria')).toBe(true)
      expect(RegexPatterns.names.test('José')).toBe(true)
    })

    it('should match valid compound names', () => {
      expect(RegexPatterns.names.test('João Silva')).toBe(true)
      expect(RegexPatterns.names.test('Maria José Santos')).toBe(true)
      expect(RegexPatterns.names.test('Ana Paula')).toBe(true)
    })

    it('should match names with accents', () => {
      expect(RegexPatterns.names.test('José')).toBe(true)
      expect(RegexPatterns.names.test('André')).toBe(true)
      expect(RegexPatterns.names.test('Mônica')).toBe(true)
      expect(RegexPatterns.names.test('François')).toBe(true)
    })

    it('should not match names with numbers', () => {
      expect(RegexPatterns.names.test('João123')).toBe(false)
      expect(RegexPatterns.names.test('Maria2')).toBe(false)
    })

    it('should not match names with special characters', () => {
      expect(RegexPatterns.names.test('João@Silva')).toBe(false)
      expect(RegexPatterns.names.test('Maria-José')).toBe(false)
      expect(RegexPatterns.names.test('Ana_Paula')).toBe(false)
    })

    it('should not match names with multiple spaces', () => {
      expect(RegexPatterns.names.test('João  Silva')).toBe(false)
      expect(RegexPatterns.names.test('Maria   José')).toBe(false)
    })

    it('should not match names with leading or trailing spaces', () => {
      expect(RegexPatterns.names.test(' João')).toBe(false)
      expect(RegexPatterns.names.test('Maria ')).toBe(false)
    })
  })

  describe('phone', () => {
    it('should match valid phone numbers with DDD', () => {
      expect(RegexPatterns.phone.test('(11)98765-4321')).toBe(true)
      expect(RegexPatterns.phone.test('(21)91234-5678')).toBe(true)
    })

    it('should match phone numbers without parentheses', () => {
      expect(RegexPatterns.phone.test('11987654321')).toBe(true)
      expect(RegexPatterns.phone.test('2191234-5678')).toBe(true)
    })

    it('should match phone numbers with spaces', () => {
      expect(RegexPatterns.phone.test('(11) 98765-4321')).toBe(true)
      expect(RegexPatterns.phone.test('11 98765-4321')).toBe(true)
    })

    it('should match landline numbers (8 digits)', () => {
      expect(RegexPatterns.phone.test('(11)3456-7890')).toBe(true)
      expect(RegexPatterns.phone.test('1134567890')).toBe(true)
    })

    it('should match mobile numbers (9 digits)', () => {
      expect(RegexPatterns.phone.test('(11)98765-4321')).toBe(true)
      expect(RegexPatterns.phone.test('11987654321')).toBe(true)
    })

    it('should not match invalid phone numbers', () => {
      expect(RegexPatterns.phone.test('123')).toBe(false)
      expect(RegexPatterns.phone.test('(11)123')).toBe(false)
      expect(RegexPatterns.phone.test('abc123')).toBe(false)
    })
  })

  describe('content', () => {
    it('should match valid content with minimum length', () => {
      expect(RegexPatterns.content.test('This is a valid content message')).toBe(true)
      expect(RegexPatterns.content.test('Conteúdo válido em português com acentos')).toBe(true)
    })

    it('should match content with allowed special characters', () => {
      expect(RegexPatterns.content.test('Content with punctuation, and symbols!')).toBe(true)
      expect(RegexPatterns.content.test('Question? Answer! (parentheses) - dash.')).toBe(true)
    })

    it('should not match content shorter than 10 characters', () => {
      expect(RegexPatterns.content.test('Short')).toBe(false)
      expect(RegexPatterns.content.test('123')).toBe(false)
    })

    it('should not match content longer than 500 characters', () => {
      const longContent = 'a'.repeat(501)
      expect(RegexPatterns.content.test(longContent)).toBe(false)
    })

    it('should match content at exactly 10 characters', () => {
      expect(RegexPatterns.content.test('1234567890')).toBe(true)
    })

    it('should match content at exactly 500 characters', () => {
      const content = 'a'.repeat(500)
      expect(RegexPatterns.content.test(content)).toBe(true)
    })
  })

  describe('observation', () => {
    it('should match valid observations', () => {
      expect(RegexPatterns.observation.test('This is an observation')).toBe(true)
      expect(RegexPatterns.observation.test('Observação em português')).toBe(true)
    })

    it('should match empty string', () => {
      expect(RegexPatterns.observation.test('')).toBe(true)
    })

    it('should match observations with special characters', () => {
      expect(RegexPatterns.observation.test('Observation with punctuation and symbols')).toBe(true)
      expect(RegexPatterns.observation.test('Note - verify please')).toBe(true)
    })

    it('should not match observations longer than 500 characters', () => {
      const longObservation = 'a'.repeat(501)
      expect(RegexPatterns.observation.test(longObservation)).toBe(false)
    })

    it('should match observation at exactly 500 characters', () => {
      const observation = 'a'.repeat(500)
      expect(RegexPatterns.observation.test(observation)).toBe(true)
    })
  })

  describe('password', () => {
    it('should match valid strong passwords', () => {
      expect(RegexPatterns.password.test('Password123!')).toBe(true)
      expect(RegexPatterns.password.test('Str0ng@Pass')).toBe(true)
      expect(RegexPatterns.password.test('MyP@ssw0rd')).toBe(true)
    })

    it('should not match passwords without uppercase', () => {
      expect(RegexPatterns.password.test('password123!')).toBe(false)
    })

    it('should not match passwords without lowercase', () => {
      expect(RegexPatterns.password.test('PASSWORD123!')).toBe(false)
    })

    it('should not match passwords without numbers', () => {
      expect(RegexPatterns.password.test('Password!')).toBe(false)
    })

    it('should not match passwords without special characters', () => {
      expect(RegexPatterns.password.test('Password123')).toBe(false)
    })

    it('should not match passwords shorter than 8 characters', () => {
      expect(RegexPatterns.password.test('Pass1!')).toBe(false)
      expect(RegexPatterns.password.test('Pw@1')).toBe(false)
    })

    it('should match passwords with exactly 8 characters', () => {
      expect(RegexPatterns.password.test('Pass123!')).toBe(true)
    })

    it('should match passwords with various special characters', () => {
      expect(RegexPatterns.password.test('Password1@')).toBe(true)
      expect(RegexPatterns.password.test('Password1$')).toBe(true)
      expect(RegexPatterns.password.test('Password1%')).toBe(true)
      expect(RegexPatterns.password.test('Password1*')).toBe(true)
      expect(RegexPatterns.password.test('Password1?')).toBe(true)
      expect(RegexPatterns.password.test('Password1&')).toBe(true)
    })
  })

  describe('time', () => {
    it('should match valid time in HH:MM format', () => {
      expect(RegexPatterns.time.test('08:30')).toBe(true)
      expect(RegexPatterns.time.test('14:45')).toBe(true)
      expect(RegexPatterns.time.test('23:59')).toBe(true)
    })

    it('should match midnight and noon', () => {
      expect(RegexPatterns.time.test('00:00')).toBe(true)
      expect(RegexPatterns.time.test('12:00')).toBe(true)
    })

    it('should not match invalid hours', () => {
      expect(RegexPatterns.time.test('24:00')).toBe(false)
      expect(RegexPatterns.time.test('25:30')).toBe(false)
    })

    it('should not match invalid minutes', () => {
      expect(RegexPatterns.time.test('08:60')).toBe(false)
      expect(RegexPatterns.time.test('12:99')).toBe(false)
    })

    it('should not match time without leading zeros', () => {
      expect(RegexPatterns.time.test('8:30')).toBe(false)
      expect(RegexPatterns.time.test('08:5')).toBe(false)
    })

    it('should not match time with wrong format', () => {
      expect(RegexPatterns.time.test('8h30')).toBe(false)
      expect(RegexPatterns.time.test('08-30')).toBe(false)
      expect(RegexPatterns.time.test('08.30')).toBe(false)
    })
  })
})
