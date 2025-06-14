class CustomError extends Error {
  public readonly statusCode: number
  public readonly details?: string

  constructor (message: string, statusCode: number, details?: string) {
    super(message)
    this.statusCode = statusCode
    this.details = details
    Object.setPrototypeOf(this, CustomError.prototype)
  }
}

export { CustomError }
