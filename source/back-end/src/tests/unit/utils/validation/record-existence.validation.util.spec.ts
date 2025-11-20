import { describe, expect, it } from 'vitest'
import { RecordExistence } from '@/utils/validation/record-existence.validation.util'
import { CustomError } from '@/utils/errors/custom.error.util'

describe('RecordExistence', () => {
  describe('validateRecordExistence', () => {
    it('should not throw error when record exists', () => {
      const record = { id: 1, name: 'Test' }

      expect(() => {
        RecordExistence.validateRecordExistence(record, 'User')
      }).not.toThrow()
    })

    it('should throw 404 error when record is null', () => {
      expect(() => {
        RecordExistence.validateRecordExistence(null, 'User')
      }).toThrow(CustomError)

      try {
        RecordExistence.validateRecordExistence(null, 'User')
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError)
        expect((error as CustomError).statusCode).toBe(404)
        expect((error as CustomError).message).toBe('Not Found')
        expect((error as CustomError).details).toBe('User not found.')
      }
    })

    it('should throw 404 error when record is undefined', () => {
      expect(() => {
        RecordExistence.validateRecordExistence(undefined, 'Product')
      }).toThrow(CustomError)

      try {
        RecordExistence.validateRecordExistence(undefined, 'Product')
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError)
        expect((error as CustomError).details).toBe('Product not found.')
      }
    })

    it('should include entity name in error message', () => {
      const entities = ['User', 'Product', 'Order', 'Customer']

      entities.forEach(entity => {
        try {
          RecordExistence.validateRecordExistence(null, entity)
        } catch (error) {
          expect((error as CustomError).details).toBe(`${entity} not found.`)
        }
      })
    })

    it('should not throw for falsy values that are valid records', () => {
      expect(() => {
        RecordExistence.validateRecordExistence(0, 'Number')
      }).not.toThrow()

      expect(() => {
        RecordExistence.validateRecordExistence('', 'String')
      }).not.toThrow()

      expect(() => {
        RecordExistence.validateRecordExistence(false, 'Boolean')
      }).not.toThrow()
    })
  })

  describe('validateRecordNonExistence', () => {
    it('should not throw error when record does not exist (null)', () => {
      expect(() => {
        RecordExistence.validateRecordNonExistence(null, 'User')
      }).not.toThrow()
    })

    it('should not throw error when record does not exist (undefined)', () => {
      expect(() => {
        RecordExistence.validateRecordNonExistence(undefined, 'User')
      }).not.toThrow()
    })

    it('should throw 400 error when record exists', () => {
      const record = { id: 1, email: 'test@example.com' }

      expect(() => {
        RecordExistence.validateRecordNonExistence(record, 'User')
      }).toThrow(CustomError)

      try {
        RecordExistence.validateRecordNonExistence(record, 'User')
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError)
        expect((error as CustomError).statusCode).toBe(400)
        expect((error as CustomError).message).toBe('Bad Request')
        expect((error as CustomError).details).toBe('User already exists.')
      }
    })

    it('should include entity name in error message', () => {
      const entities = ['Email', 'Username', 'Phone', 'Document']

      entities.forEach(entity => {
        try {
          RecordExistence.validateRecordNonExistence({ exists: true }, entity)
        } catch (error) {
          expect((error as CustomError).details).toBe(`${entity} already exists.`)
        }
      })
    })

    it('should throw for any truthy value', () => {
      expect(() => {
        RecordExistence.validateRecordNonExistence({ id: 1 }, 'Record')
      }).toThrow()

      expect(() => {
        RecordExistence.validateRecordNonExistence([], 'Array')
      }).toThrow()

      expect(() => {
        RecordExistence.validateRecordNonExistence('exists', 'String')
      }).toThrow()

      expect(() => {
        RecordExistence.validateRecordNonExistence(1, 'Number')
      }).toThrow()
    })
  })

  describe('validateManyRecordsExistence', () => {
    it('should not throw error when records array has items', () => {
      const records = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' }
      ]

      expect(() => {
        RecordExistence.validateManyRecordsExistence(records, 'Users')
      }).not.toThrow()
    })

    it('should not throw error when array has single item', () => {
      const records = [{ id: 1, name: 'User' }]

      expect(() => {
        RecordExistence.validateManyRecordsExistence(records, 'Users')
      }).not.toThrow()
    })

    it('should throw 404 error when records array is empty', () => {
      expect(() => {
        RecordExistence.validateManyRecordsExistence([], 'Users')
      }).toThrow(CustomError)

      try {
        RecordExistence.validateManyRecordsExistence([], 'Users')
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError)
        expect((error as CustomError).statusCode).toBe(404)
        expect((error as CustomError).message).toBe('Not Found')
        expect((error as CustomError).details).toBe('No Users found.')
      }
    })

    it('should include entity name in error message', () => {
      const entities = ['Products', 'Orders', 'Customers', 'Items']

      entities.forEach(entity => {
        try {
          RecordExistence.validateManyRecordsExistence([], entity)
        } catch (error) {
          expect((error as CustomError).details).toBe(`No ${entity} found.`)
        }
      })
    })

    it('should work with arrays of various types', () => {
      expect(() => {
        RecordExistence.validateManyRecordsExistence([1, 2, 3], 'Numbers')
      }).not.toThrow()

      expect(() => {
        RecordExistence.validateManyRecordsExistence(['a', 'b'], 'Strings')
      }).not.toThrow()

      expect(() => {
        RecordExistence.validateManyRecordsExistence([true], 'Booleans')
      }).not.toThrow()
    })
  })
})
