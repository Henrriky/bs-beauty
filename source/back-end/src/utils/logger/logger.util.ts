import { logger } from '@/lib/pino'
import { type Logger } from 'pino'

export interface LogContext {
  userId?: string
  userType?: string
  requestId?: string
  operation?: string
  resource?: string
  [key: string]: any
}

class AppLogger {
  private static instance: AppLogger
  private readonly logger: Logger = logger

  public static getInstance (): AppLogger {
    if (!AppLogger.instance) {
      AppLogger.instance = new AppLogger()
    }
    return AppLogger.instance
  }

  public info (message: string, context?: LogContext): void {
    this.logger.info(context, message)
  }

  public error (message: string, error?: Error, context?: LogContext): void {
    this.logger.error({
      ...context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack
          }
        : undefined
    }, message)
  }

  public warn (message: string, context?: LogContext): void {
    this.logger.warn(context, message)
  }

  public debug (message: string, context?: LogContext): void {
    this.logger.debug(context, message)
  }

  public http (message: string, context?: LogContext): void {
    this.logger.info({ ...context, type: 'http' }, message)
  }

  public performance (message: string, duration: number, context?: LogContext): void {
    this.logger.info({
      ...context,
      type: 'performance',
      duration,
      unit: 'ms'
    }, message)
  }

  public security (message: string, context?: LogContext): void {
    this.logger.warn({ ...context, type: 'security' }, message)
  }

  public database (message: string, context?: LogContext): void {
    this.logger.debug({ ...context, type: 'database' }, message)
  }
}

export const AppLoggerInstance = AppLogger.getInstance()
