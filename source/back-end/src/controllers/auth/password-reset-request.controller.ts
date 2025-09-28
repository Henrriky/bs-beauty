import { makePasswordResetRequestUseCase } from "@/factory/auth/make-password-reset-request-use-case.factory";
import { formatValidationErrors } from "@/utils/formatting/zod-validation-errors.formatting.util";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";

const PasswordResetRequestSchema = z.object({
  email: z.string().email(),
}).strict()

class PasswordResetRequestController {
  public static async handle(req: Request, res: Response, next: NextFunction) {
    try {

      const { email } = PasswordResetRequestSchema.parse(req.body)
      const usecase = makePasswordResetRequestUseCase()
      await usecase.execute(email)

      res.status(StatusCodes.OK).send({
        success: true,
        message: 'Verification code sent to provided email'
      })
    } catch (error: any) {
      console.error(`Error trying to send password request.\nReason: ${error?.message}`)
      if (error instanceof z.ZodError) {
        formatValidationErrors(error, res)
        return
      }
      next(error)
    }
  }
}

export { PasswordResetRequestController };
