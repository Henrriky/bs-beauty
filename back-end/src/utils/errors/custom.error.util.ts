class CustomError extends Error {
  public statusCode: number
  public details?: string

  constructor (message: string, statusCode: number, details?: string) {
    super(message)
    this.statusCode = statusCode
    this.details = details
    Object.setPrototypeOf(this, CustomError.prototype)
  }
}

export { CustomError }
