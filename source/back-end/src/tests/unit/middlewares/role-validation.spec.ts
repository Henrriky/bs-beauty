import { validateCreateRole } from '@/middlewares/data-validation/role/create-role.validation.middleware'
import { validateUpdateRole } from '@/middlewares/data-validation/role/update-role.validation.middleware'
import { type Request, type Response, type NextFunction } from 'express'

describe('Role Validation Middlewares (Unit Tests)', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockRequest = {
      body: {}
    }
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn()
    }
    mockNext = vi.fn()
  })

  describe('validateCreateRole', () => {
    it('should pass validation with valid role data', async () => {
      mockRequest.body = {
        name: 'Admin',
        description: 'Administrador do sistema',
        isActive: true
      }

      await validateCreateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
    })

    it('should pass validation with minimal required data', async () => {
      mockRequest.body = {
        name: 'Manager'
      }

      await validateCreateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
    })

    it('should fail validation when name is missing', async () => {
      mockRequest.body = {
        description: 'Role sem nome'
      }

      await validateCreateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should fail validation when name is too short', async () => {
      mockRequest.body = {
        name: 'A'
      }

      await validateCreateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should fail validation when name is too long', async () => {
      mockRequest.body = {
        name: 'A'.repeat(51)
      }

      await validateCreateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should fail validation when name contains invalid characters', async () => {
      mockRequest.body = {
        name: 'Admin@#$'
      }

      await validateCreateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should fail validation when description is too long', async () => {
      mockRequest.body = {
        name: 'Admin',
        description: 'A'.repeat(501)
      }

      await validateCreateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should fail validation with extra fields (strict mode)', async () => {
      mockRequest.body = {
        name: 'Admin',
        description: 'Administrador do sistema',
        isActive: true,
        extraField: 'should not be allowed'
      }

      await validateCreateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('validateUpdateRole', () => {
    it('should pass validation with valid partial update data', async () => {
      mockRequest.body = {
        name: 'Updated Admin',
        description: 'Administrador atualizado'
      }

      await validateUpdateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
    })

    it('should pass validation with only name update', async () => {
      mockRequest.body = {
        name: 'Manager'
      }

      await validateUpdateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
    })

    it('should pass validation with only description update', async () => {
      mockRequest.body = {
        description: 'Nova descrição'
      }

      await validateUpdateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
    })

    it('should pass validation with only isActive update', async () => {
      mockRequest.body = {
        isActive: false
      }

      await validateUpdateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
    })

    it('should pass validation with empty body (partial update)', async () => {
      mockRequest.body = {}

      await validateUpdateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
      expect(mockResponse.status).not.toHaveBeenCalled()
    })

    it('should fail validation when name is too short', async () => {
      mockRequest.body = {
        name: 'A'
      }

      await validateUpdateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should fail validation when description is too long', async () => {
      mockRequest.body = {
        description: 'A'.repeat(501)
      }

      await validateUpdateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should fail validation with extra fields (strict mode)', async () => {
      mockRequest.body = {
        name: 'Admin',
        extraField: 'should not be allowed'
      }

      await validateUpdateRole(mockRequest as Request, mockResponse as Response, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})
